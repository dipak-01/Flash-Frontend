'use client'

import { useState } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Building, } from 'lucide-react'
import axios from 'axios'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState('player')
  const [errors, setErrors] = useState({
    password: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: 'Please enter a valid Indian phone number (+91)'
      }));
      return false;
    }
    setErrors(prev => ({ ...prev, phoneNumber: '' }));
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {    
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      validatePassword(value);
    }
    if (name === 'phoneNumber') {
      validatePhoneNumber(value);
    }
  }

  const handleSportsChange = (sport: string) => {    
    setFormData(prev => ({
      ...prev,
      preferredSports: prev.preferredSports.includes(sport)
        ? prev.preferredSports.filter(s => s !== sport)
        : [...prev.preferredSports, sport]
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isPasswordValid = validatePassword(formData.password);
    const isPhoneValid = validatePhoneNumber(formData.phoneNumber);
    
    if (!isPasswordValid || !isPhoneValid || !formData.agreeToTerms) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    setIsLoading(true);
    try {
      const url = userType === 'player' 
        ? `${import.meta.env.VITE_BACKEND_URL}/player/register` 
        : `${import.meta.env.VITE_BACKEND_URL}/owner/register`;
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

      await axios.post(url, data);
      toast.success('Registration successful! Redirecting to login...');
      
      // Delay navigation for toast to be visible
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="w-full bg-white shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-[#111827]">
              Let's Play
            </CardTitle>
            <CardDescription className="text-center text-[#111827]">
              Create your account to start playing or hosting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <RadioGroup defaultValue="player" className="flex justify-center space-x-4 mb-6" onValueChange={setUserType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="player" id="player" />
                    <Label htmlFor="player" className="flex items-center cursor-pointer text-[#000000]">
                      <User className="mr-2 h-4 w-4 text-[#FF3B30]" /> Player
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="venue" id="venue" />
                    <Label htmlFor="venue" className="flex items-center cursor-pointer text-[#000000]">
                      <Building className="mr-2 h-4 w-4 text-[#FF3B30]" /> Venue Owner
                    </Label>
                  </div>
                </RadioGroup>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      placeholder="John Doe" 
                      onChange={handleInputChange} 
                      required 
                      className="border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      onChange={handleInputChange} 
                      required 
                      className="border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"}
                        onChange={handleInputChange} 
                        required 
                        className={`border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300 ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-red-500 text-sm">{errors.password}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"}
                        onChange={handleInputChange} 
                        required 
                        className="border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX" 
                      onChange={handleInputChange} 
                      required 
                      className={`border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300 ${
                        errors.phoneNumber ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.phoneNumber && (
                      <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      name="dateOfBirth" 
                      type="date" 
                      onChange={handleInputChange} 
                      required 
                      className="border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                    />
                  </div>

                  {userType === 'player' && (
                    <div className="grid gap-2">
                      <Label>Preferred Sports</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Soccer', 'Basketball', 'Tennis', 'Volleyball', 'Swimming'].map((sport) => (
                          <div key={sport} className="flex items-center space-x-2">
                            <Checkbox 
                              id={sport} 
                              onCheckedChange={() => handleSportsChange(sport)}
                              className="border-[#9CA3AF] text-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                            />
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
                        <Input 
                          id="venueName" 
                          name="venueName" 
                          placeholder="City Sports Complex" 
                          onChange={handleInputChange} 
                          required 
                          className="border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="venueAddress">Venue Address</Label>
                        <Input 
                          id="venueAddress" 
                          name="venueAddress" 
                          placeholder="123 Main St, City, State, ZIP" 
                          onChange={handleInputChange} 
                          required 
                          className="border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="venueType">Venue Type</Label>
                        <Select 
                          name="venueType" 
                          onValueChange={(value) => handleInputChange({ target: { name: 'venueType', value } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
                        >
                          <SelectTrigger className="border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300">
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
                    <Checkbox 
                      id="agreeToTerms" 
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))}
                      className="border-[#9CA3AF] text-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-[#FFD60A] hover:bg-[#FFD60A]/90 text-[#111827] transition-all duration-300 ease-in-out hover:scale-105"
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-[#111827]">
              Already have an account?{' '}
              <a href="/login" className="text-[#FF3B30] hover:text-[#FF3B30]/90 transition-all duration-300 ease-in-out hover:scale-105 inline-block">
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}