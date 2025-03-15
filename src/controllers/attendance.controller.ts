import express from 'express';
import { recordAttendance, getAttendanceReport } from '../services/attendanceService';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response';
import { upload } from '../utils/file'; // Import multer config

const router = express.Router();

// Record Attendance dengan upload foto
router.post(
  '/attendance',
  upload.single('photo'), // Middleware untuk upload file
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.body.user.id;
      const { location, ipAddress } = req.body;
      const photoUrl = req.file?.path || ''; // Ambil path file dari multer

      const result = await recordAttendance(userId, location, ipAddress, photoUrl);
      sendSuccessResponse(res, result, 200);
    } catch (error) {
      if (error instanceof Error) {
        sendErrorResponse(res, error.message);
      } else {
        sendErrorResponse(res, 'An unknown error occurred');
      }
    }
  }
);

// Get Attendance Report
router.get('/attendance', async (req, res) => {
  try {
    const userId = req.body.user.id;
    const attendances = await getAttendanceReport(userId);
    sendSuccessResponse(res, attendances, 200);
  } catch (error) {
    if (error instanceof Error) {
      sendErrorResponse(res, error.message);
    } else {
      sendErrorResponse(res, 'An unknown error occurred');
    }
  }
});

export default router;