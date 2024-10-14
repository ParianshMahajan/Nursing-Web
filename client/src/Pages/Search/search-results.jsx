
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Star, MapPin, Clock } from "lucide-react"

// Mock data for healthcare professionals
const initialProfessionals = [
  {
    id: 1,
    name: "Vanya Kaur",
    location: "Patiala, Punjab",
    languages: ["English", "Punjabi", "Hindi"],
    responseTime: 12,
    rating: 4,
    specialty: "Cardiac",
    experience: 5,
    reviews: 28,
    rate: 4000,
    image: "/placeholder.svg"
  },
  {
    id: 267 ,
    name: "Arjun Singh",
    location: "Patiala, Punjab",
    languages: ["English", "Punjabi"],
    responseTime: 8,
    rating: 5,
    specialty: "Cardiac",
    experience: 7,
    reviews: 42,
    rate: 4500,
    image: "/placeholder.svg"
  },
  {
    id: 4567,
    name: "Arjun Singh",
    location: "Patiala, Punjab",
    languages: ["English", "Punjabi"],
    responseTime: 8,
    rating: 5,
    specialty: "Cardiac",
    experience: 7,
    reviews: 42,
    rate: 4500,
    image: "/placeholder.svg"
  },
  {
    id: 35,
    name: "Arjun Singh",
    location: "Patiala, Punjab",
    languages: ["English", "Punjabi"],
    responseTime: 8,
    rating: 5,
    specialty: "Cardiac",
    experience: 7,
    reviews: 42,
    rate: 4500,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Arjun Singh",
    location: "Patiala, Punjab",
    languages: ["English", "Punjabi"],
    responseTime: 8,
    rating: 5,
    specialty: "Cardiac",
    experience: 7,
    reviews: 42,
    rate: 4500,
    image: "/placeholder.svg"
  },

]

export function SearchResults() {
  const [professionals, setProfessionals] = useState(initialProfessionals)
  const [location, setLocation] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")
  const [skillFilter, setSkillFilter] = useState("")

  const handleSearch = () => {
    // In a real application, this would make an API call
    // For now, we'll just filter the mock data
    const filtered = initialProfessionals.filter(pro =>
      pro.location.toLowerCase().includes(location.toLowerCase()) &&
      pro.specialty.toLowerCase().includes(specialty.toLowerCase()))
    setProfessionals(filtered)
  }

  const handleFilter = () => {
    let filtered = [...initialProfessionals]
    if (ratingFilter) {
      filtered = filtered.filter(pro => pro.rating >= parseInt(ratingFilter))
    }
    if (skillFilter) {
      filtered = filtered.filter(pro => pro.experience >= parseInt(skillFilter))
    }
    setProfessionals(filtered)
  }

  return (
    (<div className="min-h-screen bg-sky-50" style={{padding:"4%"}}>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 mt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-2 w-[420px]" style={{overflow:"hidden"}}>
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)} />
            </div>
            <Button className="bg-sky-700 text-white hover:bg-sky-800" onClick={handleSearch}>
              Search
            </Button>
          </div>
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
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3+ Years</SelectItem>
                <SelectItem value="5">5+ Years</SelectItem>
                <SelectItem value="7">7+ Years</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-sky-700 text-white hover:bg-sky-800" onClick={handleFilter}>
              APPLY
            </Button>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6">Results</h2>
        <div className="space-y-6">
          {professionals.map((pro) => (
            <Card key={pro.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-6">
                  <img
                    src={pro.image}
                    alt={pro.name}
                    width={150}
                    height={150}
                    className="rounded-lg" />
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-xl font-semibold">{pro.name}</h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {pro.location}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Can speak:</span> {pro.languages.join(", ")}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-semibold">Responds Within:</span>
                      <Clock className="w-4 h-4" /> {pro.responseTime} hrs
                    </p>
                    <div className="flex mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= pro.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <div>
                      <p className="font-semibold">{pro.specialty}</p>
                      <p>{pro.experience} Years of Experience</p>

                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Asking</p>
                      <p className="text-2xl font-bold">
                        INR <span className="text-sky-700">{pro.rate}</span>
                      </p>
                      <p className="text-sm text-gray-600">per Day</p>
                      <Button className="mt-2 bg-sky-700 text-white hover:bg-sky-800">CONNECT</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>)
  );
}