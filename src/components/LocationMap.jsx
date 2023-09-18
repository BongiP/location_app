import React, { useEffect, useRef, useState } from 'react';

// Default location coordinates for London
const DEFAULT_LAT = 51.5074; // Latitude for London
const DEFAULT_LNG = -0.1278; // Longitude for London

const LocationMap = ({ apiKey, searchedLocation }) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const directionsService = useRef(null);
  const directionsDisplay = useRef(null);

  const [mapLocation, setMapLocation] = useState(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        // Google Maps API already loaded
        initializeMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onerror = () => {
          console.error('Error loading Google Maps API.');
        };

        script.onload = () => {
          initializeMap();
        };

        document.body.appendChild(script);
      }
    };

    const initializeMap = () => {
      directionsService.current = new window.google.maps.DirectionsService();
      directionsDisplay.current = new window.google.maps.DirectionsRenderer();

      // Check if searchedLocation is available
      if (searchedLocation) {
        setMapLocation(searchedLocation);
      } else {
        // Use the default location in London if searchedLocation is not provided
        setMapLocation({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup script element
      const scriptElement = document.querySelector(
        `script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"]`
      );
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [apiKey, searchedLocation]);

  useEffect(() => {
    if (mapLocation && map.current) {
      map.current.setCenter(mapLocation);
      map.current.setZoom(12);

      directionsDisplay.current.setMap(map.current);

      // Add a marker for the searched location
      if (searchedLocation) {
        new window.google.maps.Marker({
          position: searchedLocation,
          map: map.current,
          title: 'Searched Location',
        });
      }
    }
  }, [mapLocation, searchedLocation]);

  return <div ref={mapRef} style={{ width: '100vw', height: '100vh' }}></div>;
};

export default LocationMap;
