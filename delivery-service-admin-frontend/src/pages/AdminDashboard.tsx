import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeliveryAssociates from '../components/DeliveryAssociates';
import Users from '../components/Users';
import Shipments from '../components/Shipments';
import StatsChart from '../components/StatsChart';
import '../styles/AdminDashboard.css';

interface DeliveryAssociate {
  _id: string;
  name: string;
  email: string;
  status: string;
  currentLocation: {
    coordinates: [number, number];
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Shipment {
  _id: string;
  pickupLocation: {
    coordinates: [number, number];
  };
  dropLocation: {
    coordinates: [number, number];
  };
  status: string;
  price: number;
}

interface AdminStats {
  totalUsers: number;
  totalDeliveryAssociates: number;
  totalShipments: number;
  totalDeliveredShipments: number;
  totalPickupLocationReachedShipments: number;
  totalRequestedShipments: number;
  totalPriceOfDeliveredShipments: number;
}

const AdminDashboard: React.FC = () => {
  const [deliveryAssociates, setDeliveryAssociates] = useState<DeliveryAssociate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeliveryAssociates, setShowDeliveryAssociates] = useState<boolean>(false);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [showShipments, setShowShipments] = useState<boolean>(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  // Fetch admin stats
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await axios.get('http://localhost:5050/admin/stats');
        setAdminStats(response.data.data); // Set the admin stats in state
      } catch (error) {
        console.error("Error fetching admin stats", error);
      }
    };
    fetchAdminStats();
  }, []);

  // Fetch all data in a single request for optimization
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Set loading true before fetching
      try {
        const [deliveryAssociatesRes, usersRes, shipmentsRes] = await Promise.all([
          axios.get('http://localhost:5050/delivery-associates'),
          axios.get('http://localhost:5050/users'),
          axios.get('http://localhost:5050/shipments'),
        ]);
        setDeliveryAssociates(deliveryAssociatesRes.data);
        setUsers(usersRes.data.data);
        setShipments(shipmentsRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };
    fetchAllData();
  }, []);

  const handleDeleteDeliveryAssociate = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5050/delivery-associates/${id}`);
      setDeliveryAssociates(prev => prev.filter(associate => associate._id !== id));
    } catch (error) {
      console.error("Error deleting delivery associate", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5050/users/${id}`);
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleDeleteShipment = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5050/shipments/${id}`);
      setShipments(prev => prev.filter(shipment => shipment._id !== id));
    } catch (error) {
      console.error("Error deleting shipment", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {adminStats && (
        <div className="admin-stats">
          {/* First row: Four cards */}
          <div className="stat-card">
            <h2>Total Users</h2>
            <p>{adminStats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h2>Total Delivery Associates</h2>
            <p>{adminStats.totalDeliveryAssociates}</p>
          </div>
          {/* <div className="stat-card">
            <h2>Total Shipments</h2>
            <p>{adminStats.totalShipments}</p>
          </div> */}
          <div className="stat-card">
            <h2>Total Price of Delivered Shipments</h2>
            <p>Rs. {adminStats.totalPriceOfDeliveredShipments.toFixed(2)}</p>
          </div>

          {/* Second row: Combined card */}
          <div className="stat-card combined-card">
            <div>
              <h2>Delivered Shipments</h2>
              <p>{adminStats.totalDeliveredShipments}</p>
            </div>
            <div>
              <h2>Pickup Location Reached</h2>
              <p>{adminStats.totalPickupLocationReachedShipments}</p>
            </div>
            <div>
              <h2>Requested Shipments</h2>
              <p>{adminStats.totalRequestedShipments}</p>
            </div>
          </div>
        </div>
      )}

      {adminStats && (
        <StatsChart
          totalUsers={adminStats.totalUsers}
          totalDeliveryAssociates={adminStats.totalDeliveryAssociates}
          totalShipments={adminStats.totalShipments}
          deliveredShipments={adminStats.totalDeliveredShipments}
          requestedShipments={adminStats.totalRequestedShipments}
        />
      )}

      <div className="toggle-sections">
        <button onClick={() => setShowDeliveryAssociates(!showDeliveryAssociates)}>
          {showDeliveryAssociates ? 'Hide' : 'Show'} Delivery Associates
        </button>
        <button onClick={() => setShowUsers(!showUsers)}>
          {showUsers ? 'Hide' : 'Show'} Users
        </button>
        <button onClick={() => setShowShipments(!showShipments)}>
          {showShipments ? 'Hide' : 'Show'} Shipments
        </button>
      </div>

      {showDeliveryAssociates && (
        <DeliveryAssociates
          deliveryAssociates={deliveryAssociates}
          handleDeleteDeliveryAssociate={handleDeleteDeliveryAssociate}
        />
      )}

      {showUsers && (
        <Users users={users} handleDeleteUser={handleDeleteUser} />
      )}

      {showShipments && (
        <Shipments shipments={shipments} handleDeleteShipment={handleDeleteShipment} />
      )}
    </div>
  );
};

export default AdminDashboard;
