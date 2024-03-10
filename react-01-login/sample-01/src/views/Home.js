import PrescriptionsDisplay from '../components/Display'; // Adjust the import path as needed
import React, { Fragment } from "react";


const Home = () => {
  const userId = 1;


    return (
    
      <div>
        <h1>Home</h1>
        <PrescriptionsDisplay userId={userId} />

      </div>
     
    );
};


export default Home;


