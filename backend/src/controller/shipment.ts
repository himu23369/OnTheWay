import { Request, Response, NextFunction } from 'express';
import AppRequest from 'AppRequest';
import { IShipment, ShipmentStatus } from '../models/Shipment';
import AppResponse from '../types/AppResponse';
import createOne from '../services/shipment/createOne';
import updateDeliveryAssociate from '../services/shipment/updateDeliveryAssociate';
import updateStatus from '../services/shipment/updateStatus';
import getAll from '../services/shipment/getAll'; // Import getAll service
import deleteOne from '../services/shipment/deleteOne'; // Import delete service

// Function to calculate the distance between two points using the Haversine formula
const calculateDistance = (pickupLocation: { type: 'Point'; coordinates: [number, number] }, dropLocation: { type: 'Point'; coordinates: [number, number] }): number => {
  const toRad = (value: number) => (value * Math.PI) / 180; // Convert degrees to radians

  const R = 6371; // Radius of Earth in kilometers
  const lat1 = pickupLocation.coordinates[1]; // Latitude of pickup location
  const lng1 = pickupLocation.coordinates[0]; // Longitude of pickup location
  const lat2 = dropLocation.coordinates[1]; // Latitude of drop location
  const lng2 = dropLocation.coordinates[0]; // Longitude of drop location

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
};

// Function to calculate price based on distance
const calculatePrice = (distance: number): number => {
  const baseFare = 50; // Example base fare
  const perKmRate = 10; // Example per kilometer rate
  return baseFare + perKmRate * distance;
};

export const createShipment = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const pickupLocation = req.body.pickupLocation; // Expecting { lat: number, lng: number }
    const dropLocation = req.body.dropLocation; // Expecting { lat: number, lng: number }

    // Calculate the distance between the pickup and drop-off locations
    const distance = calculateDistance(pickupLocation, dropLocation);
    console.log(distance)

    // Calculate the price based on the distance
    const price = calculatePrice(distance);

    // Create the shipment object
    const newShipment: IShipment = {
      pickupLocation,
      dropLocation,
      status: ShipmentStatus.requested,
      userId: req.user.userId,
      price, // Add price to the shipment
    };

    console.log(newShipment)

    // Save the shipment to the database
    const createdShipment = await createOne(newShipment);

    // Send the response
    const response: AppResponse = {
      data: createdShipment,
      isError: false,
    };
    res.send(response);
  } catch (error) {
    next(error);
  }
};

// export const createShipment = async (
//   req: AppRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const newShipment: IShipment = {
//       pickupLocation: req.body.pickupLocation,
//       dropLocation: req.body.dropLocation,
//       status: ShipmentStatus.requested,
//       userId: req.user.userId,
//     };
//     const createdShipment = await createOne(newShipment);
//     const response: AppResponse = {
//       data: createdShipment,
//       isError: false,
//     };
//     res.send(response);
//   } catch (error) {
//     next(error);
//   }
// };

export const patchDeliveryAssociate = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const shipmentId = req.params.id;
    const deliveryAssociateId = req.body.deliveryAssociateId;
    const shipmentWithDeliveryAssociate = await updateDeliveryAssociate(
      shipmentId,
      deliveryAssociateId
    );

    const response: AppResponse = {
      data: shipmentWithDeliveryAssociate,
      isError: false,
    };
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const patchStatus = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const shipmentId = req.params.id;
    const status = req.body.status;
    const shipment = await updateStatus(shipmentId, status);
    const response: AppResponse = {
      data: shipment,
      isError: false,
    };
    res.send(response);
  } catch (error) {
    next(error);
  }
};


// Get all shipments (Admin view)
export const getAllShipments = async (req: AppRequest, res: Response) => {
  try {
    const shipments = await getAll(); // Use the new getAll service
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message, isError: true });
  }
};

// Delete shipment by ID
export const deleteShipment = async (req: AppRequest, res: Response) => {
  try {
    await deleteOne(req.params.id); // Use the delete service
    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, isError: true });
  }
};
