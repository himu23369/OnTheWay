import Shipment, { IShipment } from '../../models/Shipment';

const getAll = async (): Promise<IShipment[]> => {
  try {
    return await Shipment.find(); // Fetch all shipments
  } catch (error) {
    throw new Error('Error fetching shipments');
  }
};

export default getAll;
