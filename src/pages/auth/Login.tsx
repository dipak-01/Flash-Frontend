'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, AlertCircle, User, Building, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = isOwner 
        ? `${import.meta.env.VITE_BACKEND_URL}/owner/login` 
        : `${import.meta.env.VITE_BACKEND_URL}/player/login`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        throw new Error('Invalid email or password. Please try again.')
      }
      const data = await response.json()
      login({
        id: data.id,
        username: data.username,
        email: data.email,
        role: isOwner ? 'venue_owner' : 'player',
        token: data.token
      })
      toast.success('Login successful!');
      // Navigate to the correct profile route
      navigate(isOwner ? '/venue-owner-profile' : '/player-profile')
    } catch (err) {
      toast.error('Invalid email or password. Please try again.');
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#111827] text-center">Welcome Back to Flash</CardTitle>
          <CardDescription className="text-center text-[#9CA3AF]">Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <RadioGroup defaultValue="player" className="flex justify-center space-x-4 mb-6" onValueChange={(value) => setIsOwner(value === 'owner')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="player" id="player" />
                  <Label htmlFor="player" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Player
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owner" id="owner" />
                  <Label htmlFor="owner" className="flex items-center cursor-pointer">
                    <Building className="mr-2 h-4 w-4" /> Owner
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#111827]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#111827]">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 border-[#9CA3AF] focus:border-[#FF3B30] focus:ring-[#FF3B30] transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#FF3B30] transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
                  <label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-[#000000] hover:text-[#FF3B30] transition-colors duration-300">
                  Forgot password?
                </a>
              </div>
            </div>
            <Button 
              className="w-full mt-6 bg-[#FF3B30] hover:bg-[#e63529] text-white transition-all duration-300 ease-in-out hover:scale-105"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Log In'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-[#9CA3AF]">
            Don't have an account?{' '}
            <a href="/signup" className="text-[#FFD60A] hover:text-[#e6c700] transition-all duration-300 ease-in-out hover:scale-105 inline-block">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}