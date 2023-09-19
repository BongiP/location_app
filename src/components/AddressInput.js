import React, { useState } from 'react';

const AddressInput = ({ onSearch }) => {
    const [address, setAddress] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const geocoder = new window.google.maps.Geocoder();
        const results = await geocodeAddress(geocoder, address);
  
        if (results) {
          onSearch(address, results[0].geometry.location);
          setAddress('');
        } else {
          console.error('Geocode request failed');
        }
      } catch (error) {
        console.error('Error retrieving geocoded data:', error);
      }
    };
  
    const geocodeAddress = (geocoder, address) => {
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0] && results[0].geometry) {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
    };  

  return (
    <form className="form-group" onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          className="form-control"
          placeholder="Enter an address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
};

export default AddressInput;