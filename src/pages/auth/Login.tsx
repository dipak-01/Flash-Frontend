'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, AlertCircle, User, Building } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isOwner, setIsOwner] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
      console.log(data);
      sessionStorage.setItem('token', data.token)
      // Handle successful login, e.g., redirect, etc.
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }
 

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back to Flash</CardTitle>
          <CardDescription className="text-center">Login to your account</CardDescription>
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
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
                  <label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            <Button className="w-full mt-6" type="submit">Log In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}