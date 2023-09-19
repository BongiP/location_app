import React, { useState, useRef, useEffect } from 'react';

const DistanceCalculator = ({ apiKey, LocationMap }) => {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const mapRef = useRef(null);
  const map = useRef(null);
  const directionsService = useRef(null);
  const directionsDisplay = useRef(null);

  // Logic for calculating distance and duration
  const calculateDistanceAndDuration = () => {
    const request = {
      origin: originAddress,
      destination: destinationAddress,
      travelMode: 'DRIVING', // You can change this to 'WALKING' or other modes
    };

    directionsService.current.route(request, (result, status) => {
      if (status === 'OK') {
        directionsDisplay.current.setDirections(result);

        const route = result.routes[0];
        const calculatedDistance = route.legs[0].distance.text;
        const calculatedDuration = route.legs[0].duration.text;

        setDistance(calculatedDistance);
        setDuration(calculatedDuration);

        // Assuming updateMap is a method in your main map component that takes origin and destination as parameters
        LocationMap.updateMap(originAddress, destinationAddress);
      } else {
        console.error('Directions request failed:', status);
        setDistance(null);
        setDuration(null);
      }
    });
  };

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
      map.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 12,
      });

      directionsService.current = new window.google.maps.DirectionsService();
      directionsDisplay.current = new window.google.maps.DirectionsRenderer();
      directionsDisplay.current.setMap(map.current);

      // Create markers for origin and destination addresses
      const originMarker = new window.google.maps.Marker({
        map: map.current,
      });

      const destinationMarker = new window.google.maps.Marker({
        map: map.current,
      });

      // Handle changes in origin and destination addresses
      const updateMarkers = () => {
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address: originAddress }, (results, status) => {
          if (status === 'OK' && results[0] && results[0].geometry) {
            originMarker.setPosition(results[0].geometry.location);
          }
        });

        geocoder.geocode({ address: destinationAddress }, (results, status) => {
          if (status === 'OK' && results[0] && results[0].geometry) {
            destinationMarker.setPosition(results[0].geometry.location);
          }
        });
      };

      // Listen for changes in origin and destination addresses
      updateMarkers();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey, originAddress, destinationAddress]);

  return (
    <div>
      <div className='calculate'>
        <h2>Calculate Distance and Duration</h2>
      <div className='distance'>
      <div>
        <label>From:</label>
        <input
          type="text"
          className='form-control'
          placeholder='Starting address'
          value={originAddress}
          onChange={(e) => setOriginAddress(e.target.value)}
        />
      </div>
      <div>
        <label>To:</label>
        <input
          type="text"
          className='form-control'
          placeholder='Destination address'
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
        />
      </div>
      <button onClick={calculateDistanceAndDuration}>Calculate</button>
      </div>
      </div>
      {distance && duration && (
        <div className='result'>
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
        </div>
      )}
    </div>
  );
};

export default DistanceCalculator;

