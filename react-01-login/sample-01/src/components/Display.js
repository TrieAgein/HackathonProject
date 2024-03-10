import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../utils/prescriptionDisplay.css";

const PrescriptionsDisplay = ({ userId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isActive, setIsActive] = useState({}); // Maps prescription IDs to their active state

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/prescriptions/${userId}`);
        setPrescriptions(response.data); // Set the prescriptions in state
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, [userId]); // Re-fetch when userId changes

  const handleButtonClick = (id) => {
    setIsActive(prevState => ({ ...prevState, [id]: true }));

    // Set a timeout to disable the button after 3 minutes
    setTimeout(() => {
      setIsActive(prevState => ({ ...prevState, [id]: false }));
    }, 180000); // 3 minutes in milliseconds
  };

  return (
    <div>
      <h2>Prescriptions</h2>
      <ul>
        {prescriptions.map((prescription) => (
          <li key={prescription.id}>
            {prescription.prescriptionName} - {prescription.dosage}mg
            <button onClick={() => handleButtonClick(prescription.id)} disabled={isActive[prescription.id]}>
              Taken medication
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrescriptionsDisplay;

