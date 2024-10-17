import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeliveryAssociates from '../components/DeliveryAssociates';
import Users from '../components/Users';
import Shipments from '../components/Shipments';
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

const AdminDashboard: React.FC = () => {
  const [deliveryAssociates, setDeliveryAssociates] = useState<DeliveryAssociate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeliveryAssociates, setShowDeliveryAssociates] = useState<boolean>(false);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [showShipments, setShowShipments] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const deliveryAssociatesRes = await axios.get('http://localhost:5050/delivery-associates');
        const usersRes = await axios.get('http://localhost:5050/users');
        const shipmentsRes = await axios.get('http://localhost:5050/shipments');
        setDeliveryAssociates(deliveryAssociatesRes.data);
        setUsers(usersRes.data.data);
        setShipments(shipmentsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleDeleteDeliveryAssociate = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5050/delivery-associates/${id}`);
      setDeliveryAssociates(deliveryAssociates.filter(associate => associate._id !== id));
    } catch (error) {
      console.error("Error deleting delivery associate", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5050/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleDeleteShipment = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5050/shipments/${id}`);
      setShipments(shipments.filter(shipment => shipment._id !== id));
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
