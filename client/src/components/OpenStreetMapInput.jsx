import React, { useEffect, useRef, useState } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Crosshair, Search } from 'lucide-react';

const OpenStreetMapInput = ({
  onChange,
  onUseCurrentLocation,
  onPlaceSelected,
}) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce function
  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  };

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) return;

    const mapInstance = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, []);

  // Search locations
  const searchLocations = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const results = await response.json();
      setSearchResults(results);
      setIsSearching(false);
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  };

  // Debounced search
  const debouncedSearch = debounce(searchLocations, 300);

  // Handle location selection
  const handleLocationSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    // Update input
    if (inputRef.current) {
      inputRef.current.value = result.display_name;
    }

    // Remove existing marker
    if (marker) {
      map.removeLayer(marker);
    }

    // Add new marker
    const newMarker = L.marker([lat, lon]).addTo(map);
    setMarker(newMarker);

    // Center map
    map.setView([lat, lon], 13);

    // Prepare return object
    const returnObj = {
      coords: { lat, lng: lon },
      address: result.display_name
    };

    // Trigger callbacks
    onChange && onChange(returnObj);
    onPlaceSelected && onPlaceSelected(result);

    // Clear search results
    setSearchResults([]);
  };

  // Handle current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          // Update input
          if (inputRef.current) {
            inputRef.current.value = data.display_name;
          }

          // Remove existing marker
          if (marker) {
            map.removeLayer(marker);
          }

          // Add new marker
          const newMarker = L.marker([latitude, longitude]).addTo(map);
          setMarker(newMarker);

          // Center map
          map.setView([latitude, longitude], 13);

          // Prepare return object
          const returnObj = {
            coords: { lat: latitude, lng: longitude },
            address: data.display_name
          };

          // Trigger callbacks
          onChange && onChange(returnObj);
          onUseCurrentLocation && onUseCurrentLocation(data);
        } catch (error) {
          console.error('Reverse geocoding error:', error);
        }
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Search Input Container */}
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            name="location"
            placeholder="Search for a location"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="relative z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer group flex items-start space-x-3 border-b border-gray-100 last:border-b-0"
                onClick={() => handleLocationSelect(result)}
              >
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                    {result.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.display_name.split(',').slice(1).join(',')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Indicator */}
        {isSearching && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {/* Use Current Location Button */}
        <button
          onClick={handleUseCurrentLocation}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Crosshair className="w-5 h-5" />
          <span>Use Current Location</span>
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-64 bg-gray-200 rounded-lg shadow-md"
      />
    </div>
  );
};

export default OpenStreetMapInput;