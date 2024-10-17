import * as turf from '@turf/turf';
import { randEmail, randUserName } from '@ngneat/falso';
import {
  DeliveryAssociateStatus,
  IDeliveryAssociate,
} from '../../models/DeliveryAssociate';

const generateAssociate = async (): Promise<IDeliveryAssociate> => {
  try {
    const THAPAR: [number, number, number, number] = [
      30.3562,
      76.3647, 
      30.3380, 
      76.4000  
  ];
  
    const randomLocation = turf.randomPoint(1, {
      bbox: THAPAR,
    });
    const randomPoint = randomLocation.features[0].geometry;
    const deliveryAssociate: IDeliveryAssociate = {
      email: randEmail(),
      name: randUserName(),
      status: DeliveryAssociateStatus.available,
      currentLocation: randomPoint,
    };
    return deliveryAssociate;
  } catch (error) {
    throw error;
  }
};
export default generateAssociate;
