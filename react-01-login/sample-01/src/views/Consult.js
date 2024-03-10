import React, { Fragment } from "react";
import Chat from "../components/gptAPI";
import img from "../assets/nurse-chan.png";
import "../utils/consult.css";



const Consult = () => {
    console.log("Consult component is being rendered");

    return (
        <div className="consult-container">
            <h2 className="consult-title">Consultation</h2>
            <p className="consult-text">Consult with Nurse-chan!</p>
            <img className="center" src={img} alt="Nurse-chan"  />
            <Chat />
        </div>
    );
};

export default Consult;