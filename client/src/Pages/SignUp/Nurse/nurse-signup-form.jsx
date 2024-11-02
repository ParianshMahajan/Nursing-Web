import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'
import GoogleMapInput from '@/components/GoogleMapInput';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export function NurseSignupFormComponent() {
  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    skilled: '',
    skills: [],
    certificateLinks: [],
    aboutMe: ''
  })
  const [errors, setErrors] = useState({})
  const [newSkill, setNewSkill] = useState('')
  const [newCertificateLink, setNewCertificateLink] = useState('')
  const [address, setAddress] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSkillChange = (value) => {
    setFormData(prev => ({ ...prev, skilled: value }))
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addCertificateLink = () => {
    if (newCertificateLink.trim()) {
      setFormData(prev => ({
        ...prev,
        certificateLinks: [...prev.certificateLinks, newCertificateLink.trim()]
      }))
      setNewCertificateLink('')
    }
  }

  const removeCertificateLink = (linkToRemove) => {
    setFormData(prev => ({
      ...prev,
      certificateLinks: prev.certificateLinks.filter(link => link !== linkToRemove)
    }))
  }

  const validateForm = () => {
    let newErrors = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
    else if (!/^\d+$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number should only contain digits"
    if (!formData.skilled) newErrors.skilled = "Skill level is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const formDataWithAddress = { ...formData, address };
      axios.post('http://localhost:3001/nurse/create', formDataWithAddress)
        .then((response) => {
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            //redirect to nurse dashboard
            navigate('/nurse/dashboard');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    (<form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto overflow-auto p-2">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          required />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="skilled">Skill Level</Label>
        <Select onValueChange={handleSkillChange} value={formData.skilled}>
          <SelectTrigger>
            <SelectValue placeholder="Select skill level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Skilled</SelectItem>
            <SelectItem value="2">Semi-Skilled</SelectItem>
            <SelectItem value="3">Unskilled</SelectItem>
          </SelectContent>
        </Select>
        {errors.skilled && <p className="text-red-500 text-sm">{errors.skilled}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <div className="flex space-x-2">
          <Input
            id="skills"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter a skill" />
          <Button type="button" onClick={addSkill}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full flex items-center">
              {skill}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2 h-4 w-4"
                onClick={() => removeSkill(skill)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="certificateLinks">Certificate Links</Label>
        <div className="flex space-x-2">
          <Input
            id="certificateLinks"
            value={newCertificateLink}
            onChange={(e) => setNewCertificateLink(e.target.value)}
            placeholder="Enter a certificate link" />
          <Button type="button" onClick={addCertificateLink}>Add</Button>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {formData.certificateLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-secondary text-secondary-foreground p-2 rounded">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline truncate">
                {link}
              </a>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCertificateLink(link)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="aboutMe">About Me</Label>
        <Textarea
          id="aboutMe"
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleChange}
          placeholder="Tell us about yourself, your experience, and your specialties..."
          rows={4} />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <GoogleMapInput handleAddressChange={(address) => setAddress(address)} />
      </div>
      <Button type="submit" className="w-full">Sign Up</Button>
    </form>)
  );
}