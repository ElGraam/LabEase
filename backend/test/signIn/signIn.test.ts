import {
  describe,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from "@jest/globals";
import { Response } from "express";
import Sinon from "sinon";
import { mockReq, mockRes } from "sinon-express-mock";
import { signIn } from "../../functions/signIn";
import { resetDatabase } from "../utils/cleanupDb";
import { getTestData } from "../utils/testData";
import { prisma } from "../../lib/prisma";
import { ProgramType, Role, AuthUserInfo } from "../../types";

type DummyLab = {
  id: string;
  name: string;
  description: string | null;
  professorId: string;
  created_at: Date;
  updated_at: Date;
};

type DummyStudentProfile = {
  id: string;
  userId: string;
  entryYear: number;
  entryMonth: string;
  plannedGradYear: number;
  plannedGradMonth: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type DummyUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  studentId: string | null;
  program: ProgramType | null;
  labId: string | null;
  studentProfile?: DummyStudentProfile;
  created_at: Date;
  updated_at: Date;
};

describe("signIn", () => {
  let labs: DummyLab[];
  let users: DummyUser[];
  let res: Response & {
    send: Sinon.SinonSpy;
    status: Sinon.SinonSpy;
    json: Sinon.SinonSpy;
  };
  let next: Sinon.SinonSpy;

  beforeEach(async () => {
    await resetDatabase();
    ({ labs, users } = await getTestData());

    res = mockRes();
    next = Sinon.spy();
  });
  afterEach(async () => {
    await resetDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("正常にログインができる", async () => {
    const testUser = users[0];
    const plainPassword = "hashedpassword1"; // 元のパスワード

    const request = {
      body: {
        email: testUser.email,
        password: plainPassword,
      },
    };
    const req = mockReq(request);

    await signIn(req, res, next);

    const expectedResponse: AuthUserInfo = {
      id: testUser.id,
      username: testUser.username,
      email: testUser.email,
      role: testUser.role,
      labId: testUser.labId || "",
    };

    expect(res.status.calledWith(200)).toBeTruthy();
    expect(res.json.called).toBeTruthy();
    expect(res.json.firstCall.args[0]).toEqual(expectedResponse);
  });

  it("存在しないユーザーでログインを試みるとエラーになる", async () => {
    const request = {
      body: {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      },
    };
    const req = mockReq(request);

    await signIn(req, res, next);

    expect(res.status.calledWith(404)).toBeTruthy();
    expect(res.json.called).toBeTruthy();
  });

  it("パスワードが間違っているとエラーになる", async () => {
    const request = {
      body: {
        email: "sato@example.com",
        password: "wrongpassword",
      },
    };
    const req = mockReq(request);

    await signIn(req, res, next);

    expect(res.status.calledWith(401)).toBeTruthy();
    expect(res.json.called).toBeTruthy();
  });
  it("無効なメールアドレスでログインを試みるとエラーになる", async () => {
    const request = {
      body: {
        email: "invalidemail",
        password: "password",
      },
    };
    const req = mockReq(request);

    await signIn(req, res, next);

    expect(res.status.calledWith(500)).toBeTruthy();
    expect(res.json.called).toBeTruthy();
  });
  it("無効なメールアドレスでログインを試みるとエラーになる", async () => {
    const request = {
      body: {
        email: "prof_suwa@test.com",
        password: "prof_suwa",
      },
    };
    const req = mockReq(request);

    await signIn(req, res, next);

    expect(res.status.calledWith(500)).toBeTruthy();
    expect(res.json.called).toBeTruthy();
  });
});
