import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import LocationMap from './components/LocationMap';
import Footer from './components/Footer';

function App() {
  const [apiLoaded, setApiLoaded] = useState(false);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [mapLocation, setMapLocation] = useState(null); // Store user's GPS location here
  const [searchedLocation, setSearchedLocation] = useState(null);

  const handleSearch = (address, location) => {
    setSearchedLocation(location);
  };

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMapLocation({ lat: latitude, lng: longitude }); // Set the user's GPS location here
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyABz5ezvSPPQMHhhHpeSdfDysyoze-SbBQ&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Error loading Google Maps API.');
    };

    script.onload = () => {
      setApiLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="App">
      <h1>Location Finder App</h1>
      <div className="cont">
        {apiLoaded && (
          <SearchBar onSearch={handleSearch} setMapLocation={setMapLocation} />
        )}
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
        <button onClick={handleGetCurrentLocation}>
          Get My Current Location
        </button>
      </div>

      {apiLoaded && (
        <LocationMap
          apiKey="AIzaSyABz5ezvSPPQMHhhHpeSdfDysyoze-SbBQ"
          mapLocation={mapLocation}
          searchedLocation={searchedLocation}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
