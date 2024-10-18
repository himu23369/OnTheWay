import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import AppResponse from '../types/AppResponse';
import { createLocalUser } from '../services/user/createOne';
import getById from '../services/user/getById';
import deleteById from '../services/user/deleteById';
import { getAllUsers } from '../services/user/getAllUsers';
import deleteUser from '../services/user/deleteUser';
import AppRequest from 'AppRequest';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser: IUser = {
      email: req.body.email || '',
      name: req.body.name || '',
      roles: req.body.roles || '',
      organization: req.body.organization || '',
    };
    const password = req.body.password || '';
    const createdUser = await createLocalUser(newUser, password);
    const response: AppResponse = { data: createdUser, isError: false };
    res.send(response);
  } catch (error) {
    next(error);
  }
};
export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.params.userId;
    const userData = await getById(userId);
    const response: AppResponse = { data: userData, isError: false };
    res.send(response);
  } catch (error) {
    next(error);
  }
};
export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.params.userId;
    const deleteUser = await deleteById(userId);
    const response: AppResponse = { data: deleteUser, isError: false };
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user id form token
    const userId: string = req.user.userId;
    const userData = await getById(userId);
    const response: AppResponse = { data: userData, isError: false };
    res.send(response);
  } catch (error) {
    next(error);
  }
};


// Get all users (Admin view)
export const getAllUsersController = async (
  req: Request,         // Explicitly type 'req' as Request
  res: Response<AppResponse>, // Explicitly type 'res' as Response<AppResponse>
  next: NextFunction     // Explicitly type 'next' as NextFunction
) => {
  try {
    const users = await getAllUsers(); // Fetch all users
    const response: AppResponse = { data: users, isError: false };
    res.json(response); // Send the response back
  } catch (error) {
    next(error); // Call the next middleware with the error
  }
};

// Delete user by ID
export const deleteUserController = async (
  req: Request,          // Explicitly type 'req' as Request
  res: Response<AppResponse>, // Explicitly type 'res' as Response<AppResponse>
  next: NextFunction      // Explicitly type 'next' as NextFunction
) => {
  try {
    const userId: string = req.params.id; // Get user ID from request params
    const message = await deleteUser(userId); // Delete user by ID
    const response: AppResponse = { data: message, isError: false };
    res.json(response); // Send the response back
  } catch (error) {
    next(error); // Call the next middleware with the error
  }
};