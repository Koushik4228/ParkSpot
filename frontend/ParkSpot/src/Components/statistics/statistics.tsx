import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'; 
import './statistics.css'; 
import { FaUserMd, FaClipboardCheck, FaChartBar, FaTachometerAlt, FaUser } from 'react-icons/fa';
import { fetchAllUsers } from '../Accounts/Service/user.service'; // Assuming you're fetching user data here

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const Statistics = () => {
  const [counts, setCounts] = useState({
    users: 0,
    service: 0,
    user: 0,
  });

  useEffect(() => {
    try {
      fetchAllUsers()
        .then((res) => {
          // console.log(res);
          if (res && res.data.length > 0) {
            // Update the counts based on roles
            const users = res.data.length;
            const service = res.data.filter((pat: any) => pat.role === "service").length;
            const user = res.data.filter((pat: any) => pat.role === "user").length;
            
            // Set counts state
            setCounts({
              users, 
              service, 
              user
            });
          }
        })
        .catch((err) => {
          console.log("Error fetching users:", err);
        });
    } catch (ex) {
      console.log("Failed to fetch allUsers", ex);
    }
  }, []);

  const data = {
    labels: ['Users', 'Serviceproviders', 'Parkingusers'],
    datasets: [
      {
        label: 'Count (Bar)',
        data: [counts.users, counts.service, counts.user],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const lineData = {
    labels: ['Users', 'Serviceproviders', 'Parkingusers'],
    datasets: [
      {
        label: 'Count (Line)',
        data: [counts.users, counts.service, counts.user],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="statistics">
      
           <li onClick={() => window.location.href = '/statistics'}><FaChartBar /> Statistics</li>
     
      <div className="statistics__content">
        <h1 className="statisticsHeader">Admin Dashboard Statistics</h1>
        <div className="statisticsChartSection">
          <Bar data={data} className="statisticsCanvas" />
          <Line data={lineData} className="statisticsCanvas" />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
