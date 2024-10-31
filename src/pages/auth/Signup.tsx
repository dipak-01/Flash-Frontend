import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
 
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

export default function SignupPage() {
  const [userType] = useState<'player' | 'venueOwner'>('player') // Removed 'setUserType'
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
    agreeToTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked,
    }));
  };

  const handleSportChange = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSports: [...prev.preferredSports, sport],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} />

        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />

        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} />

        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />

        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} />

        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />

        <Label>Preferred Sports</Label>
        <RadioGroup onValueChange={handleSportChange} value="">
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="soccer" id="soccer" />
            <Label htmlFor="soccer">Soccer</Label>
          </div>
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="basketball" id="basketball" />
            <Label htmlFor="basketball">Basketball</Label>
          </div>
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="tennis" id="tennis" />
            <Label htmlFor="tennis">Tennis</Label>
          </div>
        </RadioGroup>

        {userType === 'venueOwner' && (
          <>
            <Label htmlFor="venueName">Venue Name</Label>
            <Input id="venueName" name="venueName" type="text" value={formData.venueName} onChange={handleInputChange} />

            <Label htmlFor="venueAddress">Venue Address</Label>
            <Input id="venueAddress" name="venueAddress" type="text" value={formData.venueAddress} onChange={handleInputChange} />

            <Label htmlFor="venueType">Venue Type</Label>
            <Select onValueChange={(value: string) => setFormData(prev => ({ ...prev, venueType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select venue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}

        <Checkbox checked={formData.agreeToTerms} onCheckedChange={handleCheckboxChange}>
          <span>I agree to the Terms and Conditions</span>
        </Checkbox>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={!formData.agreeToTerms}>Signup</Button>
      </CardFooter>
    </Card>
  )
}