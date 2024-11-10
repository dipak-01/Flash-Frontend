
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Building, } from 'lucide-react'
import axios from 'axios'
import { Toaster } from 'sonner'

export default function SignupPage() {
  const [userType, setUserType] = useState('player')
  interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    dateOfBirth: string;
    preferredSports: string[];
    venueName: string;
    venueAddress: string;
    venueType: string;
    agreeToTerms: boolean;
  }

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    preferredSports: [],
    venueName: '',
    venueAddress: '',
    venueType: '',
    agreeToTerms: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSportsChange = (sport: string) => {    setFormData(prev => ({
      ...prev,
      preferredSports: prev.preferredSports.includes(sport)
        ? prev.preferredSports.filter(s => s !== sport)
        : [...prev.preferredSports, sport]
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = userType === 'player' ? `${import.meta.env.VITE_BACKEND_URL}/player/register` : `${import.meta.env.VITE_BACKEND_URL}/owner/register`;
      const data = userType === 'player' ? {
        name: formData.fullName,
        email: formData.email,
        DOB: formData.dateOfBirth,
        phone: formData.phoneNumber,
        password: formData.password,
        preferredSports: formData.preferredSports.join(', ')
      } : {
        name: formData.fullName,
        email: formData.email,
        DOB: formData.dateOfBirth,
        phone: formData.phoneNumber,
        password: formData.password
      };

      const response = await axios.post(url, data);
      console.log(response.data);
       // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration error
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Join Flash Sports Platform</CardTitle>
          <CardDescription className="text-center">Create your account to start playing or hosting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <RadioGroup defaultValue="player" className="flex justify-center space-x-4 mb-6" onValueChange={setUserType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="player" id="player" />
                  <Label htmlFor="player" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Player
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venue" id="venue" />
                  <Label htmlFor="venue" className="flex items-center cursor-pointer">
                    <Building className="mr-2 h-4 w-4" /> Venue Owner
                  </Label>
                </div>
              </RadioGroup>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="John Doe" onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+1 (555) 123-4567" onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" onChange={handleInputChange} required />
                </div>

                {userType === 'player' && (
                  <div className="grid gap-2">
                    <Label>Preferred Sports</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Soccer', 'Basketball', 'Tennis', 'Volleyball', 'Swimming'].map((sport) => (
                        <div key={sport} className="flex items-center space-x-2">
                          <Checkbox id={sport} onCheckedChange={() => handleSportsChange(sport)} />
                          <label htmlFor={sport} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {sport}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userType === 'venue' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="venueName">Venue Name</Label>
                      <Input id="venueName" name="venueName" placeholder="City Sports Complex" onChange={handleInputChange} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="venueAddress">Venue Address</Label>
                      <Input id="venueAddress" name="venueAddress" placeholder="123 Main St, City, State, ZIP" onChange={handleInputChange} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="venueType">Venue Type</Label>
                      <Select name="venueType" onValueChange={(value) => handleInputChange({ target: { name: 'venueType', value } } as unknown as React.ChangeEvent<HTMLSelectElement>)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indoor">Indoor Facility</SelectItem>
                          <SelectItem value="outdoor">Outdoor Field</SelectItem>
                          <SelectItem value="multipurpose">Multipurpose Complex</SelectItem>
                          <SelectItem value="aquatic">Aquatic Center</SelectItem>
                          <SelectItem value="court">Court (Tennis, Basketball, etc.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox id="agreeToTerms" onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))} />
                  <label htmlFor="agreeToTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6" type="submit">Create Account</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
      <Toaster position="top-center" richColors />
    </div>
  )
}