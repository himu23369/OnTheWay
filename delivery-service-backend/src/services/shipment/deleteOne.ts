import Shipment from '../../models/Shipment';
import { Types } from 'mongoose';

const deleteOne = async (id: string) => {
  const objectId = new Types.ObjectId(id);
  const deletedShipment = await Shipment.findByIdAndDelete(objectId);
  if (!deletedShipment) {
    throw new Error("Shipment not found");
  }
  return deletedShipment;
};

export default deleteOne;
