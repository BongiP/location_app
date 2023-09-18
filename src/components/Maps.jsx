import React, { useEffect, useRef, useState } from 'react';

// Default location coordinates for London
const DEFAULT_LAT = 51.5074; // Latitude for London
const DEFAULT_LNG = -0.1278; // Longitude for London

const Map = ({ apiKey, origin, destination, mapLocation }) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const directionsService = useRef(null);
  const directionsDisplay = useRef(null);

  // Use the user's GPS location if available, otherwise, use the default location in London
  const [initialLocation, setInitialLocation] = useState(
    mapLocation || { lat: DEFAULT_LAT, lng: DEFAULT_LNG }
  );

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Error loading Google Maps API.');
    };

    document.body.appendChild(script);

    script.onload = () => {
      directionsService.current = new window.google.maps.DirectionsService();
      directionsDisplay.current = new window.google.maps.DirectionsRenderer();

      // Check if mapLocation is available (user's GPS location)
      if (mapLocation) {
        setInitialLocation(mapLocation);
      }

      map.current = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 12,
      });

      directionsDisplay.current.setMap(map.current);

      // Add markers for origin and destination
      if (origin) {
        new window.google.maps.Marker({
          position: origin,
          map: map.current,
          title: 'Origin',
        });
      }

      if (destination) {
        new window.google.maps.Marker({
          position: destination,
          map: map.current,
          title: 'Destination',
        });
      }

      // Calculate and display directions
      if (origin && destination) {
        const request = {
          origin: origin,
          destination: destination,
          travelMode: 'DRIVING',
        };

        directionsService.current.route(request, (result, status) => {
          if (status === 'OK') {
            directionsDisplay.current.setDirections(result);
          } else {
            console.error('Directions request failed:', status);
          }
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey, initialLocation, origin, destination, mapLocation]);

  return <div ref={mapRef} style={{ width: '100vw', height: '100vh' }}></div>;
};

export default Map;