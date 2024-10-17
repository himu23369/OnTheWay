import DeliveryAssociate, { IDeliveryAssociateSchema } from '../../models/DeliveryAssociate';

const getAll = async (): Promise<IDeliveryAssociateSchema[]> => {
  try {
    return await DeliveryAssociate.find(); // Fetch all delivery associates
  } catch (error) {
    throw new Error('Error fetching delivery associates');
  }
};

export default getAll;
