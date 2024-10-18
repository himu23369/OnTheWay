import React, { useState, ChangeEvent } from 'react';

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

interface ShipmentsProps {
  shipments: Shipment[];
  handleDeleteShipment: (id: string) => void;
}

const Shipments: React.FC<ShipmentsProps> = ({ shipments, handleDeleteShipment }) => {
  const [filterStatus, setFilterStatus] = useState<string>('');

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
  };

  const filteredShipments = filterStatus
    ? shipments.filter((shipment) => shipment.status === filterStatus)
    : shipments;

  return (
    <div className="section-container">
      <h2>Shipments</h2>
      <label htmlFor="statusFilter">Filter by Status:</label>
      <select id="statusFilter" value={filterStatus} onChange={handleStatusChange}>
        <option value="">All</option>
        <option value="requested">Requested</option>
        <option value="delivered">Delivered</option>
        <option value="deliveryAssociateAssigned">Delivery Associate Assigned</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Tracking Number</th>
            <th>Pickup Location</th>
            <th>Drop-off Location</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredShipments.map((shipment) => (
            <tr key={shipment._id}>
              <td>{shipment._id}</td>
              <td>{`(${shipment.pickupLocation.coordinates[1]}, ${shipment.pickupLocation.coordinates[0]})`}</td>
              <td>{`(${shipment.dropLocation.coordinates[1]}, ${shipment.dropLocation.coordinates[0]})`}</td>
              <td>{shipment.status}</td>
              <td>{`Rs ${shipment.price.toFixed(2)}`}</td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteShipment(shipment._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Shipments;
