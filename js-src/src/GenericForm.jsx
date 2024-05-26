import React, { useState, useEffect } from 'react';
import './App.css';

const GenericForm = ({ schema, apiUrl, onGoBack }) => {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error

  useEffect(() => {
    // Initialize form data with empty strings
    const initialFormData = {};
    schema.fields.forEach(field => {
      initialFormData[field.name] = '';
    });
    setFormData(initialFormData);

    // Fetch existing data to populate the form if needed
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setFormData(data))
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [schema, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Data updated successfully!');
          setMessageType('success');
        } else {
          setMessage('Error updating data.');
          setMessageType('error');
        }
      })
      .catch(error => {
        setMessage('Error updating data.');
        setMessageType('error');
        console.error('There was an error!', error);
      });

    // Clear the message after 5 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  return (
    <div className="topCenteredForm">
      <form onSubmit={handleSubmit} className="rightAlignedForm" autoComplete="off">
        {schema.fields.map((field, index) => (
          <div key={index}>
            <label>{field.label}:</label>
            <input
              autoComplete="off"
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        ))}
        <div className="MidSpacedContainer">
          <div className="MidSpacedContainerChild">
            <button type="button" onClick={onGoBack}>Go Back</button>
          </div>
          <div className="MidSpacedContainerChild">
            <button type="submit">Submit</button>
          </div>
        </div>
        {
          message &&
          <div className={`message ${messageType}`}>
            <p>{message}</p>
          </div>
        }
      </form>
    </div>
  );
};

export default GenericForm;
