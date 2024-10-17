import User from '../../models/User';
import DeliveryAssociate from '../../models/DeliveryAssociate';
import Shipment from '../../models/Shipment';

interface AdminStats {
  totalUsers: number;
  totalDeliveryAssociates: number;
  totalShipments: number;
  totalDeliveredShipments: number;
  totalPickupLocationReachedShipments: number;
  totalRequestedShipments: number;
  totalPriceOfDeliveredShipments: number;
}

/**
 * Service to get admin statistics: total users, delivery associates, and categorized shipments
 */
const getAdminStats = async (): Promise<AdminStats> => {
  const totalUsers = await User.countDocuments({});
  const totalDeliveryAssociates = await DeliveryAssociate.countDocuments({});

  // Total number of all shipments
  const totalShipments = await Shipment.countDocuments({});

  // Categorizing shipments based on their status
  const totalDeliveredShipments = await Shipment.countDocuments({ status: 'delivered' });
  const totalPickupLocationReachedShipments = await Shipment.countDocuments({ status: 'pickupLocationReached' });
  const totalRequestedShipments = await Shipment.countDocuments({ status: 'requested' });

  // Summing the prices of delivered shipments
  const deliveredShipments = await Shipment.find({ status: 'delivered' }, { price: 1 });
  const totalPriceOfDeliveredShipments = deliveredShipments.reduce((total, shipment) => total + shipment.price, 0);

  return {
    totalUsers,
    totalDeliveryAssociates,
    totalShipments,
    totalDeliveredShipments,
    totalPickupLocationReachedShipments,
    totalRequestedShipments,
    totalPriceOfDeliveredShipments
  };
};

export default getAdminStats;
