import React, { useState, useEffect } from 'react';
import LocationMap from './components/LocationMap';
import DistanceCalculator from './components/DistanceCalculator';
import AddressInput from './components/AddressInput';
import Footer from './components/Footer';

function App() {
  const [origin, setOrigin] = useState(null); 
  const [destination, setDestination] = useState(null); 
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [mapLocation, setMapLocation] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false); 

  const handleSearch = (address, location) => {
    setMapLocation(location);
    if (!origin) {
      setOrigin(address);
    } else {
      setDestination(address);
    }
  };

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
  };

  const updateMap = (newOrigin, newDestination) => {
    setOrigin(newOrigin);
    setDestination(newDestination);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=process.env.REACT_APP_GOOGLE_MAPS_API_KEY`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Error loading Google Maps API.');
    };

    script.onload = () => {
      setGoogleMapsLoaded(true); // Set the flag when Google Maps API is loaded
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1 className="heading">Location Finder App</h1>
      <div className='App'>
        <AddressInput onSearch={handleSearch} />
        <div className='mode'>
          <label className='label'>Select Travel Mode:</label>
          <select
            value={travelMode}
            onChange={(e) => handleTravelModeChange(e.target.value)}
          >
            <option value="DRIVING">Driving</option>
            <option value="WALKING">Walking</option>
          </select>
        </div>
        <div>
          <DistanceCalculator 
            origin={origin} 
            destination={destination} 
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}  
            updateMap={updateMap} // pass updateMap as a prop
            googleMapsLoaded={googleMapsLoaded} // pass the loading status
          />
        </div>
      </div>
      <LocationMap 
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}  
        mapLocation={mapLocation} 
        origin={origin} 
        destination={destination} 
        updateMap={updateMap} // pass updateMap as a prop
        googleMapsLoaded={googleMapsLoaded} // pass the loading status
      />
      <Footer />
    </div>
  );
}

export default App;
