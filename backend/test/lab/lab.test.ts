import { describe, expect, test, beforeEach, afterEach } from "@jest/globals";
import { prisma } from "../../lib/prisma";
import { getTestData } from "../utils/testData";
import { resetDatabase } from "../utils/cleanupDb";
import { Request, Response } from "express";
import { get_lab } from "../../functions/get_lab";
import { lab_register } from "../../functions/lab_register";
import { get_lab_member } from "../../functions/get_lab_member";

describe("Lab API Functions", () => {
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

  describe("get_lab", () => {
    test("研究室の詳細を取得できる", async () => {
      mockRequest = {
        params: {
          labId: "lab01",
        },
      };

      await get_lab(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData).toHaveProperty("name");
      expect(responseData).toHaveProperty("description");
      expect(responseData).toHaveProperty("professor");
      expect(responseData.id).toBe("lab01");
    });

    test("存在しない研究室IDの場合は404を返す", async () => {
      mockRequest = {
        params: {
          labId: "non-existent-lab",
        },
      };

      await get_lab(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe("lab_register", () => {
    test("学生を研究室に登録できる", async () => {
      mockRequest = {
        body: {
          studentId: "Footrest5022",
          labId: "lab01",
        },
      };

      await lab_register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData.labId).toBe("lab01");
    });

    test("存在しない学生IDの場合は404を返す", async () => {
      mockRequest = {
        body: {
          studentId: "non-existent-student",
          labId: "lab01",
        },
      };

      await lab_register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    test("存在しない研究室IDの場合は404を返す", async () => {
      mockRequest = {
        body: {
          studentId: "Footrest5022",
          labId: "non-existent-lab",
        },
      };

      await lab_register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe("get_lab_member", () => {
    test("研究室のメンバー一覧を取得できる", async () => {
      // まず研究室にメンバーを登録
      await prisma.users.update({
        where: {
          studentId: "Footrest5022",
        },
        data: {
          labId: "lab01",
        },
      });

      mockRequest = {
        params: {
          labId: "lab01",
        },
      };

      await get_lab_member(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(Array.isArray(responseData)).toBeTruthy();
      expect(responseData.length).toBeGreaterThan(0);
      expect(responseData[0]).toHaveProperty("id");
      expect(responseData[0]).toHaveProperty("username");
    });

    test("存在しない研究室IDの場合は404を返す", async () => {
      mockRequest = {
        params: {
          labId: "non-existent-lab",
        },
      };

      await get_lab_member(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
