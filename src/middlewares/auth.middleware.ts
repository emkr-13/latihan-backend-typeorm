import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  // Periksa apakah header Authorization ada
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // res.status(401).json({ message: "No token provided" });
    sendErrorResponse(res, "No token provided", 401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Cari pengguna berdasarkan ID dari token
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.userId });

    if (!user) {
      // res.status(403).json({ message: "Invalid or expired token" });
      sendErrorResponse(res, "Invalid or expired token", 403);
      return;
    }

    // Tambahkan user ke request object
    req.body.user = user; // Simpan user di req.body
    // console.log('Authenticated User:', user);
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT Verification Error:", error.message);
    } else {
      console.error("JWT Verification Error:", error);
    }
    // res.status(403).json({ message: "Invalid or expired token" });
    sendErrorResponse(res, "Invalid or expired token", 403);
  }
};
