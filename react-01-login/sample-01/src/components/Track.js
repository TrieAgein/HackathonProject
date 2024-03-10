import React, { useState } from 'react';
import '../utils/tracker.css'; // Make sure the CSS file is correctly linked

function PrescriptionForm() {
    // State for each field in the form
    const [prescriptionName, setPrescriptionName] = useState('');
    const [prescriptionType, setPrescriptionType] = useState('');
    const [dosage, setDosage] = useState('');
    const [timeTillNext, setTimeTillNext] = useState('');
    const [taken, setTaken] = useState(false);

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Here, you would typically send this data to a backend server
        // For demonstration, we'll just log it to the console
        console.log({
            prescriptionName,
            prescriptionType,
            dosage: Number(dosage), // Ensure dosage is treated as a number
            timeTillNext: Number(timeTillNext), // Ensure timeTillNext is treated as a number
            taken
        });

        // Reset form fields
        setPrescriptionName('');
        setPrescriptionType('');
        setDosage('');
        setTimeTillNext('');
        setTaken(false);
    };

    // Render the form
    return (
        <form onSubmit={handleSubmit} className="google-form">
            <div className="form-group">
                <label htmlFor="prescriptionName" className="form-label">Prescription Name:</label>
                <input
                    type="text"
                    id="prescriptionName"
                    className="form-input"
                    value={prescriptionName}
                    onChange={e => setPrescriptionName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="prescriptionType" className="form-label">Prescription Type:</label>
                <input
                    type="text"
                    id="prescriptionType"
                    className="form-input"
                    value={prescriptionType}
                    onChange={e => setPrescriptionType(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="dosage" className="form-label">Dosage (mg):</label>
                <input
                    type="number"
                    id="dosage"
                    className="form-input"
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="timeTillNext" className="form-label">Time Till Next Dose (hours):</label>
                <input
                    type="number"
                    id="timeTillNext"
                    className="form-input"
                    value={timeTillNext}
                    onChange={e => setTimeTillNext(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Taken Today?</label>
                <input
                    type="checkbox"
                    id="taken"
                    className="form-input"
                    checked={taken}
                    onChange={e => setTaken(e.target.checked)}
                />
            </div>
            <button type="submit" className="form-submit">Submit</button>
        </form>
    );
}

export default PrescriptionForm;
