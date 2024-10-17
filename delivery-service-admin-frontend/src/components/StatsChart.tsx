import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface StatsChartProps {
  totalUsers: number;
  totalDeliveryAssociates: number;
  totalShipments: number;
  deliveredShipments: number;
  requestedShipments: number;
}

const StatsChart: React.FC<StatsChartProps> = ({
  totalUsers,
  totalDeliveryAssociates,
  totalShipments,
  deliveredShipments,
  requestedShipments,
}) => {
  const barData = {
    labels: ['Users', 'Delivery Associates', 'Shipments'],
    datasets: [
      {
        label: 'Admin Statistics',
        data: [totalUsers, totalDeliveryAssociates, totalShipments],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
      },
    ],
  };

  const pieData = {
    labels: ['Delivered Shipments', 'Requested Shipments'],
    datasets: [
      {
        label: '# of Shipments',
        data: [deliveredShipments, requestedShipments],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Admin Overview</h3>
      <div className="chart">
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Overall Statistics' } } }} />
      </div>
      <div className="chart">
        <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Shipments Overview' } } }} />
      </div>
    </div>
  );
};

export default StatsChart;
