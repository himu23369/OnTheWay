import { Request, Response, NextFunction } from 'express';
import AppRequest from 'AppRequest';
import AppResponse from '../types/AppResponse';
import createOne from '../services/deliveryAssociate/createOne';
import generateAssociate from '../services/deliveryAssociate/generateAssociate';
import getOne from '../services/deliveryAssociate/getOne';
import getAll from '../services/deliveryAssociate/getAll'; // Import getAll service
import deleteOne from '../services/deliveryAssociate/deleteOne'; // Import delete service


export const createDeliveryAssociate = async (
  _req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const randomDeliveryAssociate = await generateAssociate();
    const deliveryAssociate = await createOne(randomDeliveryAssociate);
    const response: AppResponse = { data: deliveryAssociate, isError: false };
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getDAById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    console.log(id);
    const deliveryAssociate = await getOne(id);
    const response: AppResponse = { 
      data: deliveryAssociate, isError: false 
    };
    res.send(response);
  } catch (error) {
    next(error);
  }
};

// Get all delivery associates (Admin view)
export const getAllDeliveryAssociates = async (req: AppRequest, res: Response) => {
  try {
    const deliveryAssociates = await getAll(); // Use the new getAll service
    res.json(deliveryAssociates);
  } catch (error) {
    res.status(500).json({ message: error.message, isError: true });
  }
};
  
// Delete delivery associate by ID
export const deleteDeliveryAssociate = async (req: AppRequest, res: Response) => {
  try {
    const id = req.params.id;
    await deleteOne(id); // Use the delete service
    res.json({ message: 'Delivery associate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, isError: true });
  }
};