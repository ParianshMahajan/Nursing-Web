import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Search as SearchIcon, Filter } from "lucide-react";
import { API_URL } from '@/api/config';
import toast from 'react-hot-toast';

export function SearchResults() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(API_URL + '/extra/getCities');
        if (response.data.status) {
          setCities(response.data.data);
        } else {
          toast.error('Failed to fetch cities');
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        toast.error('Failed to fetch cities');
      }
    };
    fetchCities();
  }, []);

  // Fetch nurses whenever city changes or search query changes
  useEffect(() => {
    if (selectedCity) {
      fetchNurses();
    }
  }, [selectedCity, searchQuery]);

  const fetchNurses = async () => {
    if (!selectedCity) {
      setError('Please select a city');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL + '/extra/getNursesByCity', {
        city: selectedCity,
        query: searchQuery
      });

      if (response.data.status) {
        let filteredResults = response.data.data;

        // Apply client-side filters
        if (ratingFilter && ratingFilter !== 'all') {
          filteredResults = filteredResults.filter(pro => 
            pro.Rating >= parseInt(ratingFilter));
        }
        if (skillFilter && skillFilter !== 'all') {
          filteredResults = filteredResults.filter(pro => 
            pro.Skilled <= parseInt(skillFilter));
        }

        setProfessionals(filteredResults);
      } else {
        toast.error(response.data.message || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  // Handle city selection
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSearchQuery(""); // Reset search query when city changes
  };

  // Handle search query changes with debouncing
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    fetchNurses();
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{paddingTop:"60px"}}>
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8 mt-4 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Find a Nurse</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Select value={selectedCity} onValueChange={handleCityChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-[2] min-w-[300px]">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search nurses by name, skills, or description"
                      value={searchQuery}
                      onChange={handleSearchQueryChange}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Level</SelectItem>
                <SelectItem value="1">Skilled</SelectItem>
                <SelectItem value="2">Semi-Skilled</SelectItem>
                <SelectItem value="3">Unskilled</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="bg-sky-700 text-white hover:bg-sky-800" 
              onClick={handleFilterChange}
            >
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Searching...' : `${professionals.length} Results Found`}
            </h2>
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-700"></div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid gap-6">
            {professionals.map((pro) => (
              <Card key={pro._id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-6">
                    <div className="h-40 w-40 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={pro.ImgUrl || "/placeholder.png"}
                        alt={pro.Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex flex-wrap justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{pro.Name}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <MapPin className="w-4 h-4" />
                            {pro.City}
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= pro.Rating ? 'text-yellow-400' : 'text-gray-300'
                                } fill-current`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              ({pro.Rating || 0} out of 5)
                            </span>
                          </div>
                          <div className="mt-3">
                            <Badge variant={pro.Skilled === 1 ? 'default' : 
                                         pro.Skilled === 2 ? 'secondary' : 'outline'}>
                              {pro.Skilled === 1 ? 'Skilled' : 
                               pro.Skilled === 2 ? 'Semi-Skilled' : 'Unskilled'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-sky-700">
                            ₹{pro.Price}
                            <span className="text-sm text-gray-600">/day</span>
                          </div>
                          <Badge
                            variant={pro.IsAvailable ? 'success' : 'destructive'}
                            className="mt-2"
                          >
                            {pro.IsAvailable ? 'Available' : 'Not Available'}
                          </Badge>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600 line-clamp-2">
                        {pro.AboutMe || 'No description available.'}
                      </p>
                      {pro.Skills && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {Array.isArray(pro.Skills) ? 
                            pro.Skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            )) : 
                            <span className="text-gray-600">No skills listed</span>
                          }
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => navigate(`/nurseProfile/${pro._id}`)}
                          disabled={!pro.IsAvailable}
                          className="bg-sky-700 hover:bg-sky-800 text-white"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {professionals.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <SearchIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedCity 
                  ? "No nurses found in this city" 
                  : "Please select a city to view nurses"}
              </h3>
              <p className="text-gray-600">
                {selectedCity 
                  ? "Try adjusting your filters or search terms" 
                  : "Choose a city from the dropdown above to start your search"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}