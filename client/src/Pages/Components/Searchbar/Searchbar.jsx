import React, { useState, useMemo } from 'react';
import { City } from 'country-state-city';
import { FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";

const Searchbar = () => {
  const [cityQuery, setCityQuery] = useState('');
  const [nurseQuery, setNurseQuery] = useState('');
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isNurseFocused, setIsNurseFocused] = useState(false);

  // Memoize cities to prevent unnecessary recalculation
  const cities = useMemo(() => City.getCitiesOfCountry("IN"), []);

  // Filter cities based on input
  const filteredCities = useMemo(() => {
    return cities.filter(city => 
      `${city.name}, ${city.stateCode}`.toLowerCase().includes(cityQuery.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions for better performance
  }, [cities, cityQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log('Searching for:', { city: cityQuery, nurse: nurseQuery });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Location Search */}
        <div className={`flex-1 relative border-b md:border-b-0 md:border-r border-gray-200 transition-all duration-200 ${isLocationFocused ? 'bg-blue-50' : ''}`}>
          <div className="flex items-center px-4 py-3">
            <FaLocationDot className="text-blue-500 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              onFocus={() => setIsLocationFocused(true)}
              onBlur={() => setIsLocationFocused(false)}
              placeholder="Select City"
              className="w-full pl-3 pr-2 py-1 text-gray-700 bg-transparent outline-none placeholder-gray-500"
              aria-label="City search"
            />
          </div>

          {/* City suggestions */}
          {isLocationFocused && cityQuery && (
            <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
              {filteredCities.map((city) => (
                <button
                  key={`${city.name}-${city.stateCode}`}
                  type="button"
                  onClick={() => {
                    setCityQuery(`${city.name}, ${city.stateCode}`);
                    setIsLocationFocused(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-200"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-gray-500">, {city.stateCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nurse Search */}
        <div className={`flex-[2] relative transition-all duration-200 ${isNurseFocused ? 'bg-blue-50' : ''}`}>
          <div className="flex items-center h-full">
            <div className="flex-1 flex items-center px-4 py-3">
              <FaMagnifyingGlass className="text-blue-500 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={nurseQuery}
                onChange={(e) => setNurseQuery(e.target.value)}
                onFocus={() => setIsNurseFocused(true)}
                onBlur={() => setIsNurseFocused(false)}
                placeholder="Search for nurses (e.g., Cardiac, Pediatric)"
                className="w-full pl-3 pr-2 py-1 text-gray-700 bg-transparent outline-none placeholder-gray-500"
                aria-label="Nurse search"
              />
            </div>
            
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 rounded-lg font-semibold"
            >
              <FaMagnifyingGlass className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Searchbar;