import React, { useEffect, useRef, useState } from "react";

const GoogleMapInput = ({
  onChange, // Callback for input changes
  onUseCurrentLocation, // Callback for "Use Current Location" button clicks
  onPlaceSelected, // Callback for place selection
}) => {
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

        const returnObj = {
          coords :{lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
          address: place.formatted_address,
        }

        // Set address in the input field
        if (place.formatted_address) {
          inputRef.current.value = place.formatted_address;
          handleChange(returnObj);
          onPlaceSelected && onPlaceSelected(place); // Call the onPlaceSelected callback
        }
      });
    };

    loadGoogleMapsScript();
  }, []);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Current Location:", position.coords);
        const { latitude, longitude } = position.coords;
        const currentLocation = new window.google.maps.LatLng(latitude, longitude);
        map.setCenter(currentLocation);
        map.setZoom(15);

        // Geocoding to get the address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: currentLocation }, (results, status) => {
          if (status === "OK" && results[0]) {
            inputRef.current.value = results[0].formatted_address;
            const returnObj = {
              coords: { lat: latitude, lng: longitude },
              address: results[0].formatted_address,
            };
            handleChange(returnObj);
            onUseCurrentLocation && onUseCurrentLocation(results[0]); // Call the onUseCurrentLocation callback
          } else {
            console.error("Geocoder failed due to: " + status);
          }
        });
      });
    }
  };

  const handleChange = (obj) => {
    onChange && onChange(obj); // Call the onChange callback
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name="location"
          placeholder="Search for a location"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Use Current Location Button */}
      <input
        type="button"
        onClick={handleUseCurrentLocation}
        value="Use Current Location"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
     />
      

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-80 bg-gray-200 rounded-lg shadow-md"
      />
    </div>
  );
};

export default GoogleMapInput;