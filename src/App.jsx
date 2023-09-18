import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Map from './components/Map';
import Footer from './components/Footer';

function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [mapLocation, setMapLocation] = useState(null); // Store user's GPS location here

  const handleSearch = (address, location) => {
    if (!origin) {
      setOrigin(location);
    } else {
      setDestination(location);
    }
  };

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyABz5ezvSPPQMHhhHpeSdfDysyoze-SbBQ&libraries=places`; // Replace with your API key
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Error loading Google Maps API.');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="App">
      <h1>Location Finder App</h1>
      <div className='cont'>
        <SearchBar onSearch={handleSearch} setMapLocation={setMapLocation} />
        <div>
          <label>Select Travel Mode:</label>
          <select
            value={travelMode}
            onChange={(e) => handleTravelModeChange(e.target.value)}
          >
            <option value="DRIVING">Driving</option>
            <option value="WALKING">Walking</option>
          </select>
        </div>
      </div>

      <Map apiKey="AIzaSyABz5ezvSPPQMHhhHpeSdfDysyoze-SbBQ" origin={origin} destination={destination} mapLocation={mapLocation} />
      <Footer />
    </div>
  );
}

export default App;
