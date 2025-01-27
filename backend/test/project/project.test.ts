import { describe, expect, beforeEach, afterEach, afterAll } from "@jest/globals";
import { prisma } from "../../lib/prisma";
import { getTestData } from "../utils/testData";
import { resetDatabase } from "../utils/cleanupDb";
import { randomUUID } from "crypto";
import { updateProjectMilestone } from "../../functions/update_project_milestone";
import { projectCreate } from "../../functions/project_create";
import { projectRegister } from "../../functions/project_register";
import { get_labproject } from "../../functions/get_labproject";
import { get_project } from "../../functions/get_project";
import { update_project } from "../../functions/update_project";
import { delete_project } from "../../functions/delete_project";
import { delete_projectmember } from "../../functions/delete_projectmember";
import { get_user_projects } from "../../functions/get_user_projects";
import { Request, Response } from "express";

describe("Project API Functions", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(async () => {
    await resetDatabase();
    await getTestData();
    mockNext = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(async () => {
    await resetDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("projectCreate", () => {
    it("新しいプロジェクトを作成できる", async () => {
      mockRequest = {
        body: {
          title: "新規プロジェクト",
          description: "新規プロジェクトの説明",
          labId: "lab01",
          memberIds: ["2b3c4d5e-6789-01bc-def0-2345678901bc", "4b3c4d5e-6789-01bc-def0-2345678901bc"],
          milestones: [
            {
              title: "マイルストーン1",
              description: "最初のマイルストーン",
              dueDate: "2024-12-31",
            },
          ],
        },
      };

      await projectCreate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData).toHaveProperty("id");
      expect(responseData.title).toBe(mockRequest.body.title);
      expect(responseData.description).toBe(mockRequest.body.description);
      expect(responseData.labId).toBe("lab01");
      expect(responseData.members).toHaveLength(2);
      expect(responseData.milestones).toHaveLength(1);
    });

    it("必須フィールドが欠けている場合はエラーを返す", async () => {
      mockRequest = {
        body: {
          description: "説明のみ",
        },
      };

      await projectCreate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toHaveProperty("statusCode", 500);
    });
  });

  describe("get_project", () => {
    it("プロジェクトの詳細を取得できる", async () => {
      const project = await prisma.project.create({
        data: {
          id: randomUUID(),
          title: "テストプロジェクト",
          description: "テストプロジェクトの説明",
          labId: "lab01",
        },
      });

      mockRequest = {
        params: {
          projectId: project.id,
        },
      };

      await get_project(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData.id).toBe(project.id);
      expect(responseData.title).toBe(project.title);
    });

    it("存在しないプロジェクトIDの場合は404を返す", async () => {
      mockRequest = {
        params: {
          projectId: randomUUID(),
        },
      };

      await get_project(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe("update_project", () => {
    it("プロジェクトを更新できる", async () => {
      const project = await prisma.project.create({
        data: {
          id: randomUUID(),
          title: "テストプロジェクト",
          description: "テストプロジェクトの説明",
          labId: "lab01",
        },
      });

      mockRequest = {
        params: {
          projectId: project.id,
        },
        body: {
          title: "更新後のタイトル",
          description: "更新後の説明",
          milestones: [],
        },
      };

      await update_project(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData.title).toBe(mockRequest.body.title);
      expect(responseData.description).toBe(mockRequest.body.description);
    });
  });

  describe("projectRegister", () => {
    it("プロジェクトメンバーを追加できる", async () => {
      // まず研究室メンバーとしてユーザーを追加
      await prisma.users.update({
        where: {
          id: "2b3c4d5e-6789-01bc-def0-2345678901bc",
        },
        data: {
          labId: "lab01",
        },
      });

      const project = await prisma.project.create({
        data: {
          id: randomUUID(),
          title: "テストプロジェクト",
          description: "テストプロジェクトの説明",
          labId: "lab01",
        },
      });

      mockRequest = {
        body: {
          projectId: project.id,
          memberIds: ["2b3c4d5e-6789-01bc-def0-2345678901bc"], // student_tanakaのID
        },
      };

      await projectRegister(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData.members).toHaveLength(1);
    });
  });

  describe("delete_project", () => {
    it("プロジェクトを削除できる", async () => {
      const project = await prisma.project.create({
        data: {
          id: randomUUID(),
          title: "テストプロジェクト",
          description: "テストプロジェクトの説明",
          labId: "lab01",
        },
      });

      mockRequest = {
        params: {
          projectId: project.id,
        },
      };

      await delete_project(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const deletedProject = await prisma.project.findUnique({
        where: { id: project.id },
      });
      expect(deletedProject).toBeNull();
    });
  });

  describe("get_labproject", () => {
    it("研究室のプロジェクト一覧を取得できる", async () => {
      await prisma.project.createMany({
        data: [
          {
            id: randomUUID(),
            title: "プロジェクト1",
            description: "説明1",
            labId: "lab01",
          },
          {
            id: randomUUID(),
            title: "プロジェクト2",
            description: "説明2",
            labId: "lab01",
          },
        ],
      });

      mockRequest = {
        params: {
          labId: "lab01",
        },
      };

      await get_labproject(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData).toHaveLength(2);
      expect(responseData[0]).toHaveProperty("title");
      expect(responseData[1]).toHaveProperty("title");
    });
  });

  describe("updateProjectMilestone", () => {
    it("プロジェクトのマイルストーンを更新できる", async () => {
      const project = await prisma.project.create({
        data: {
          id: randomUUID(),
          title: "テストプロジェクト",
          description: "テストプロジェクトの説明",
          labId: "lab01",
        },
      });

      const milestone = await prisma.projectMilestone.create({
        data: {
          id: randomUUID(),
          projectId: project.id,
          title: "マイルストーン1",
          description: "説明",
          dueDate: new Date("2024-12-31"),
          status: "PLANNED",
        },
      });

      mockRequest = {
        body: {
          milestoneId: milestone.id,
          title: "更新後のマイルストーン",
          description: "更新後の説明",
          status: "IN_PROGRESS",
        },
      };

      await updateProjectMilestone(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData.milestones[0].title).toBe("更新後のマイルストーン");
      expect(responseData.milestones[0].status).toBe("IN_PROGRESS");
    });
  });

  describe("delete_projectmember", () => {
    it("プロジェクトメンバーを削除できる", async () => {
      const project = await prisma.project.create({
        data: {
          id: randomUUID(),
          title: "テストプロジェクト",
          description: "テストプロジェクトの説明",
          labId: "lab01",
        },
      });

      const member = await prisma.projectMember.create({
        data: {
          id: randomUUID(),
          projectId: project.id,
          userId: "2b3c4d5e-6789-01bc-def0-2345678901bc", // student_tanakaのID
        },
      });

      mockRequest = {
        params: {
          projectId: project.id,
          userId: "2b3c4d5e-6789-01bc-def0-2345678901bc",
        },
      };

      await delete_projectmember(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);

      const deletedMember = await prisma.projectMember.findFirst({
        where: {
          projectId: project.id,
          userId: "2b3c4d5e-6789-01bc-def0-2345678901bc",
        },
      });
      expect(deletedMember).toBeNull();
    });

    it("存在しないメンバーの削除を試みた場合は404を返す", async () => {
      mockRequest = {
        params: {
          projectId: randomUUID(),
          userId: "2b3c4d5e-6789-01bc-def0-2345678901bc",
        },
      };

      await delete_projectmember(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe("get_user_projects", () => {
    it("ユーザーが参加しているプロジェクト一覧を取得できる", async () => {
      // プロジェクトを2つ作成
      const project1 = await prisma.project.create({
        data: {
          id: randomUUID(),
          title: "プロジェクト1",
          description: "説明1",
          labId: "lab01",
        },
      });

      const project2 = await prisma.project.create({
        data: {
          id: randomUUID(),
          title: "プロジェクト2",
          description: "説明2",
          labId: "lab01",
        },
      });

      // ユーザーをプロジェクトのメンバーとして追加
      await prisma.projectMember.createMany({
        data: [
          {
            id: randomUUID(),
            projectId: project1.id,
            userId: "2b3c4d5e-6789-01bc-def0-2345678901bc",
          },
          {
            id: randomUUID(),
            projectId: project2.id,
            userId: "2b3c4d5e-6789-01bc-def0-2345678901bc",
          },
        ],
      });

      mockRequest = {
        params: {
          userId: "2b3c4d5e-6789-01bc-def0-2345678901bc",
        },
      };

      await get_user_projects(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData).toHaveLength(2);
      expect(responseData[0]).toHaveProperty("title");
      expect(responseData[1]).toHaveProperty("title");
    });

    it("プロジェクトに参加していないユーザーの場合は空配列を返す", async () => {
      mockRequest = {
        params: {
          userId: "2b3c4d5e-6789-01bc-def0-2345678901bc",
        },
      };

      await get_user_projects(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData).toHaveLength(0);
    });
  });
});
