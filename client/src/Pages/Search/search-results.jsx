import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Star, MapPin, Clock } from "lucide-react"
import { API_URL } from '@/api/config'

export function SearchResults() {
  const [professionals, setProfessionals] = useState([])
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(API_URL + '/extra/getCities')
        if (response.data.status) {
          setCities(response.data.data)
        }
      } catch (err) {
        setError('Failed to fetch cities')
        console.error('Error fetching cities:', err)
      }
    }
    fetchCities()
  }, [])

  // Fetch nurses whenever city changes or search query changes
  useEffect(() => {
    if (selectedCity) {
      fetchNurses()
    }
  }, [selectedCity, searchQuery])

  const fetchNurses = async () => {
    if (!selectedCity) {
      setError('Please select a city')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(API_URL + '/extra/getNursesByCity', {
        city: selectedCity,
        query: searchQuery // This can be empty string
      })

      if (response.data.status) {
        let filteredResults = response.data.data

        // Apply client-side filters
        if (ratingFilter) {
          filteredResults = filteredResults.filter(pro => 
            pro.Rating >= parseInt(ratingFilter))
        }
        if (skillFilter) {
          filteredResults = filteredResults.filter(pro => 
            pro.Skilled <= parseInt(skillFilter))
        }

        setProfessionals(filteredResults)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError('Failed to fetch results')
      console.error('Error fetching results:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle city selection
  const handleCityChange = (city) => {
    setSelectedCity(city)
    setSearchQuery("") // Reset search query when city changes
  }

  // Handle search query changes with debouncing
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle filter changes
  const handleFilterChange = () => {
    fetchNurses() // Re-fetch with current filters
  }

  return (
    <div className="min-h-screen bg-sky-50" style={{paddingTop:"60px"}}>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 mt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-2 w-[420px]" style={{overflow:"hidden"}}>
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search nurses by name, skills, or description"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">FILTERS</h2>
          <div className="flex flex-wrap gap-4">
            <Select onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setSkillFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Results</h2>
          {loading && <p className="text-sky-600">Loading...</p>}
        </div>

        <div className="space-y-6">
          {professionals.map((pro) => (
            <Card key={pro._id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-6">
                  <img
                    src={pro.ImgUrl || "/placeholder.svg"}
                    alt={pro.Name}
                    width={150}
                    height={150}
                    className="rounded-lg"
                  />
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-xl font-semibold">{pro.Name}</h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {pro.City}
                    </p>
                    <p className="mt-2">
                      {pro.AboutMe && (
                        <span className="text-gray-600">{pro.AboutMe}</span>
                      )}
                    </p>
                    <div className="flex mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= pro.Rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <div>
                      <p className="font-semibold">
                        {pro.Skilled === 1 ? 'Skilled' : 
                         pro.Skilled === 2 ? 'Semi-Skilled' : 
                         'Unskilled'}
                      </p>
                      {pro.Skills && (
                        <p className="text-sm text-gray-600">
                          {typeof pro.Skills === 'string' 
                            ? pro.Skills 
                            : pro.Skills.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {pro.Price && (
                        <>
                          <p className="text-sm text-gray-600">Rate</p>
                          <p className="text-2xl font-bold">
                            INR <span className="text-sky-700">{pro.Price}</span>
                          </p>
                          <p className="text-sm text-gray-600">per Day</p>
                        </>
                      )}
                      <Button 
                        className="mt-2 bg-sky-700 text-white hover:bg-sky-800"
                        disabled={!pro.IsAvailable}
                      >
                        {pro.IsAvailable ? 'CONNECT' : 'UNAVAILABLE'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {professionals.length === 0 && !loading && (
            <p className="text-center text-gray-500">
              {selectedCity 
                ? "No nurses found in this city" 
                : "Please select a city to view nurses"}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default SearchResults