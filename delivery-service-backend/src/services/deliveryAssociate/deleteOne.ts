import DeliveryAssociate from '../../models/DeliveryAssociate';
import { Types } from 'mongoose';

const deleteOne = async (id: string) => {
  const objectId = new Types.ObjectId(id);
  const deletedAssociate = await DeliveryAssociate.findByIdAndDelete(objectId);
  if (!deletedAssociate) {
    throw new Error("Delivery Associate not found");
  }
  return deletedAssociate;
};

export default deleteOne;
