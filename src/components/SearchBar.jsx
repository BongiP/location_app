import React, { useState } from 'react';

const SearchBar = ({ onSearch, mapLocation, setMapLocation }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const geocoder = new window.google.maps.Geocoder();

      // Only set the map's center to the user's location if mapLocation is not available
      if (!mapLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setMapLocation({ lat: latitude, lng: longitude }); // Set the user's GPS location here
        });
      }

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0] && results[0].geometry) {
          onSearch(address, results[0].geometry.location);

          // Set the map's center to the geocoded location
          if (!mapLocation) {
            setMapLocation(results[0].geometry.location);
          }

          setAddress('');
        } else {
          console.error('Geocode request failed:', status);
        }
      });
    } catch (error) {
      console.error('Error retrieving geocoded data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
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

export default SearchBar;

