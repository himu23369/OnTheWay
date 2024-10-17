import { Request, Response, NextFunction } from 'express';
import getAdminStats from '../services/admin/getAdminStats';
import AppResponse from '../types/AppResponse';

/**
 * Get admin statistics: total number of users, delivery associates, and shipments
 */
export const getAdminStatsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getAdminStats();
    const response: AppResponse = { data: stats, isError: false };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
