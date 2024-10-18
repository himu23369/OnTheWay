import DeliveryAssociate, {
  IDeliveryAssociateSchema,
} from '../../models/DeliveryAssociate';

import { Types } from 'mongoose';

const getOne = async (id: string): Promise<IDeliveryAssociateSchema> => {
  try {
    const objectId = new Types.ObjectId(id);
    const deliveryAssociate = await DeliveryAssociate.findById(objectId);
    if(!deliveryAssociate){
      throw new Error("Delivery Associate not Found");
    }
    return deliveryAssociate;
  } catch (error) {
    throw error;
  }
};
export default getOne;
