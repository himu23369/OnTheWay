import React, { useState, ChangeEvent } from 'react';

interface DeliveryAssociate {
  _id: string;
  name: string;
  email: string;
  status: string;
  currentLocation: {
    coordinates: [number, number];
  };
}

interface DeliveryAssociatesProps {
  deliveryAssociates: DeliveryAssociate[];
  handleDeleteDeliveryAssociate: (id: string) => void;
}

const DeliveryAssociates: React.FC<DeliveryAssociatesProps> = React.memo(({ deliveryAssociates, handleDeleteDeliveryAssociate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredAssociates = deliveryAssociates.filter((associate) =>
    associate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section-container">
      <h2>Delivery Associates</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Current Location (Lat, Long)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssociates.map((associate) => (
            <tr key={associate._id}>
              <td>{associate.name}</td>
              <td>{associate.email}</td>
              <td>{associate.status}</td>
              <td>
                {associate.currentLocation.coordinates[1]}, {associate.currentLocation.coordinates[0]}
              </td>
              <td>
                <button onClick={() => handleDeleteDeliveryAssociate(associate._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default DeliveryAssociates;
