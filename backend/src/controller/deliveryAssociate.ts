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
    if (!id) {
      return res.status(400).json({ message: 'Delivery associate ID is required', isError: true });
    }

    // Call the delete service
    const deletedAssociate = await deleteOne(id);
    
    // Optionally log the deleted associate or take additional actions
    console.log(`Deleted delivery associate: ${deletedAssociate._id}`);
    
    // Send a success response
    res.json({ message: 'Delivery associate deleted successfully', deletedAssociate });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error deleting delivery associate:', error);
    
    // Send an error response
    res.status(500).json({ message: error.message, isError: true });
  }
};