import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// Default location coordinates
const DEFAULT_LAT = 51.5074;
const DEFAULT_LNG = -0.1278;

const LocationMap = forwardRef(({ apiKey, origin, destination, initialLocation: propInitialLocation }, ref) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const directionsService = useRef(null);
  const directionsDisplay = useRef(null);

  // Use the user's GPS location if available, otherwise, use the default location
  const [currentLocation, setCurrentLocation] = useState(
    propInitialLocation || { lat: DEFAULT_LAT, lng: DEFAULT_LNG }
  );

  // Method to update the map based on the origin and destination addresses
  const updateMap = (newOrigin, newDestination) => {
    if (newOrigin && newDestination) {
      // Update origin and destination markers and directions
      // ...
    }
  };

  // Expose the updateMap function through ref
  useImperativeHandle(ref, () => ({
    updateMap,
  }));

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Error loading Google Maps API.');
    };

    document.body.appendChild(script);

    script.onload = () => {
      directionsService.current = new window.google.maps.DirectionsService();
      directionsDisplay.current = new window.google.maps.DirectionsRenderer();

      map.current = new window.google.maps.Map(mapRef.current, {
        center: currentLocation, // Updated to use currentLocation
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

      const destinationMarker = new window.google.maps.Marker({
        position: destination,
        map: map.current,
        title: 'Destination',
      });

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

            // Get and display distance
            const route = result.routes[0];
            const distance = route.legs[0].distance.text;

            const distanceInfoWindow = new window.google.maps.InfoWindow({
              content: `Distance: ${distance}`,
            });

            distanceInfoWindow.open(map.current, destinationMarker);
          } else {
            console.error('Directions request failed:', status);
          }
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey, currentLocation, origin, destination]);

  // Update map center when propInitialLocation changes
  useEffect(() => {
    if (propInitialLocation) {
      setCurrentLocation(propInitialLocation);
    }
  }, [propInitialLocation]);

  return <div ref={mapRef} style={{ width: '100vw', height: '100vh' }}></div>;
});

export default LocationMap;
