import { prisma } from "../../lib/prisma";
import { getTestData } from "../utils/testData";
import { resetDatabase } from "../utils/cleanupDb";
import { availableSlots_create } from "../../functions/availableslot_create";
import { delete_availableslot } from "../../functions/delete_availableslot";
import { Request, Response } from "express";
import {
  describe,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from "@jest/globals";

describe("AvailableSlots", () => {
  let mockRequest: Partial<Request> & {
    params: Record<string, string>;
    body: Record<string, any>;
  };
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(async () => {
    await resetDatabase();
    await getTestData();

    mockNext = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    await resetDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("availableSlots_create", () => {
    it("should create an available slot successfully", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startTime = new Date(tomorrow);
      startTime.setHours(10, 0, 0);

      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0);

      mockRequest = {
        params: { userId: "1a2b3c4d-5678-90ab-cdef-1234567890ab" },
        body: {
          dayOfWeek: 1,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      };

      await availableSlots_create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
      const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseData).toHaveProperty("id");
      expect(responseData.userId).toBe(mockRequest.params.userId);
      expect(responseData.dayOfWeek).toBe(mockRequest.body.dayOfWeek);
    });

    it("should return 400 if userId is missing", async () => {
      mockRequest = {
        params: {},
        body: {
          dayOfWeek: 1,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        },
      };

      await availableSlots_create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        messege: "userId is required",
      });
    });

    it("should return 400 if time slot overlaps with existing slot", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startTime = new Date(tomorrow);
      startTime.setHours(10, 0, 0);

      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0);

      // First slot creation
      mockRequest = {
        params: { userId: "1a2b3c4d-5678-90ab-cdef-1234567890ab" },
        body: {
          dayOfWeek: 1,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      };

      await availableSlots_create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Attempt to create overlapping slot
      await availableSlots_create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        messege: "The time period is already reserved.",
      });
    });
  });

  describe("delete_availableslot", () => {
    it("should delete an available slot successfully", async () => {
      // First create a slot
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startTime = new Date(tomorrow);
      startTime.setHours(10, 0, 0);

      const endTime = new Date(tomorrow);
      endTime.setHours(11, 0, 0);

      const slot = await prisma.availableSlot.create({
        data: {
          userId: "1a2b3c4d-5678-90ab-cdef-1234567890ab",
          dayOfWeek: 1,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      });

      mockRequest = {
        params: { availableSlotId: slot.id },
        body: {},
      };

      await delete_availableslot(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("should return 400 if availableSlotId is missing", async () => {
      mockRequest = {
        params: {},
        body: {},
      };

      await delete_availableslot(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if slot does not exist", async () => {
      mockRequest = {
        params: { availableSlotId: "non-existent-id" },
        body: {},
      };

      await delete_availableslot(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
