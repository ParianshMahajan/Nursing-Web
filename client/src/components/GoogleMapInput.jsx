import React, { useEffect, useRef, useState } from "react";

const GoogleMapInput = () => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    };

    const initMap = () => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.749933, lng: -73.98633 },
        zoom: 13,
        mapTypeControl: false,
      });
      setMap(mapInstance);

      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["formatted_address", "geometry", "name"],
        }
      );
      setAutocomplete(autocompleteInstance);

      autocompleteInstance.bindTo("bounds", mapInstance);

      const marker = new window.google.maps.Marker({
        map: mapInstance,
        anchorPoint: new window.google.maps.Point(0, -29),
      });

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        if (!place.geometry || !place.geometry.location) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        if (place.geometry.viewport) {
          mapInstance.fitBounds(place.geometry.viewport);
        } else {
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        // Set address in the input field
        if (place.formatted_address) {
          inputRef.current.value = place.formatted_address;
        }
      });
    };

    loadGoogleMapsScript();
  }, []);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation = new window.google.maps.LatLng(latitude, longitude);
        map.setCenter(currentLocation);
        map.setZoom(15);

        // Geocoding to get the address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: currentLocation }, (results, status) => {
          if (status === "OK" && results[0]) {
            inputRef.current.value = results[0].formatted_address;
          } else {
            console.error("Geocoder failed due to: " + status);
          }
        });
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a location"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Use Current Location Button */}
      <button
        onClick={handleUseCurrentLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Use Current Location
      </button>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-80 bg-gray-200 rounded-lg shadow-md"
      />
    </div>
  );
};

export default GoogleMapInput;
