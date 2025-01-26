import { beforeEach, describe, expect, it } from "@jest/globals";
import { Response } from "express";
import Sinon from "sinon";
import { mockReq, mockRes } from "sinon-express-mock";
import { meeting_create } from "../../functions/meeting_create";
import { MeetingType } from "../../types";
import { resetDatabase } from "../utils/cleanupDb";
import { getTestData } from "../utils/testData";
import { prisma } from "../../lib/prisma";

describe("meeting_create", () => {
  let res: Response & {
    send: Sinon.SinonSpy;
    status: Sinon.SinonSpy;
    json: Sinon.SinonSpy;
  };
  let next: Sinon.SinonSpy;

  beforeEach(async () => {
    await resetDatabase();
    await getTestData();

    res = mockRes();
    next = Sinon.spy();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("通常ミーティングが正常に作成される", async () => {
    const professor = await prisma.users.findFirst({
      where: { role: "PROFESSOR" },
    });
    const students = await prisma.users.findMany({
      where: { role: "STUDENT" },
      take: 2,
    });

    const request = {
      body: {
        type: MeetingType.REGULAR,
        title: "定例ミーティング",
        description: "週次進捗報告",
        startTime: new Date("2024-02-01T10:00:00Z"),
        endTime: new Date("2024-02-01T11:00:00Z"),
        participants: [
          { userId: professor!.id },
          { userId: students[0].id },
          { userId: students[1].id },
        ],
      },
    };
    const req = mockReq(request);

    await meeting_create(req, res, next);

    expect(res.status.calledWith(201)).toBeTruthy();
    expect(res.send.args.length).toBe(1);
    expect(res.send.firstCall.args[0].meeting.title).toBe(request.body.title);
    expect(res.send.firstCall.args[0].meeting.type).toBe(request.body.type);
    expect(next.called).toBeFalsy();
  });
  it("無効なデータでミーティング作成を試みるとエラーになる", async () => {
    const request = {
      body: {
        type: MeetingType.REGULAR,
        title: "", // 空のタイトル
        startTime: new Date("2024-02-01T10:00:00Z"),
        endTime: new Date("2024-02-01T09:00:00Z"), // 開始時刻より前の終了時刻
        participants: [], // 参加者なし
      },
    };
    const req = mockReq(request);

    await meeting_create(req, res, next);

    expect(res.send.called).toBeFalsy();
    expect(res.status.calledWith(400)).toBeTruthy();
  });
});
