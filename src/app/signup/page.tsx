"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Eye, EyeOff, User, Building, ArrowRight, CheckCircle, MapPin, Star } from "lucide-react"

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "", // Changed from firstname + lastname to match user model
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Changed to match user model ("user" or "admin")
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", { // Changed endpoint to match our API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert("Account created successfully! Please sign in.")
        router.push("/signin") // Redirect to signin page
      } else {
        alert(data.error || "Something went wrong")
      }
    } catch (error: unknown) {
      console.error("Signup error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const passwordStrength = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password),
  }

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#B260E6] to-[#ED84A5] text-white font-bold text-xl shadow-lg">
                S
              </div>
              <span className="font-bold text-3xl bg-gradient-to-r from-[#B260E6] to-[#ED84A5] bg-clip-text text-transparent">
                SkillLink
              </span>
            </Link>
            <p className="text-gray-600 mt-2">Join Australia&apos;s Skilled Workforce Platform</p>
          </div>

          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Create Your Account</CardTitle>
              <p className="text-gray-600">
                Join thousands of skilled professionals finding opportunities across Australia
              </p>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">I am a</Label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "user" })}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${form.role === "user"
                          ? "bg-white shadow-md text-[#B260E6]"
                          : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                      <User className="h-4 w-4" />
                      <span className="font-medium">Worker</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "admin" })}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${form.role === "admin"
                          ? "bg-white shadow-md text-[#B260E6]"
                          : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                      <Building className="h-4 w-4" />
                      <span className="font-medium">Employer</span>
                    </button>
                  </div>
                </div>

                {/* Single Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    className="h-12 border-gray-200 rounded-xl focus:border-[#B260E6] focus:ring-[#B260E6] transition-colors"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 border-gray-200 rounded-xl focus:border-[#B260E6] focus:ring-[#B260E6] transition-colors"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="h-12 border-gray-200 rounded-xl focus:border-[#B260E6] focus:ring-[#B260E6] transition-colors pr-12"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((index) => (
                          <div
                            key={index}
                            className={`h-1 flex-1 rounded-full ${index <= strengthScore
                                ? strengthScore >= 3
                                  ? "bg-green-500"
                                  : strengthScore >= 2
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                : "bg-gray-200"
                              }`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className={`h-3 w-3 ${passwordStrength.length ? "text-green-500" : "text-gray-300"}`} />
                          <span className={passwordStrength.length ? "text-green-600" : "text-gray-500"}>8+ characters</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className={`h-3 w-3 ${passwordStrength.uppercase ? "text-green-500" : "text-gray-300"}`} />
                          <span className={passwordStrength.uppercase ? "text-green-600" : "text-gray-500"}>Uppercase</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className={`h-3 w-3 ${passwordStrength.number ? "text-green-500" : "text-gray-300"}`} />
                          <span className={passwordStrength.number ? "text-green-600" : "text-gray-500"}>Number</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className={`h-3 w-3 ${passwordStrength.special ? "text-green-500" : "text-gray-300"}`} />
                          <span className={passwordStrength.special ? "text-green-600" : "text-gray-500"}>Special char</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`h-12 border-gray-200 rounded-xl focus:border-[#B260E6] focus:ring-[#B260E6] transition-colors pr-12 ${form.confirmPassword && form.password !== form.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-red-500 text-sm">Passwords do not match</p>
                  )}
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    className="mt-1 rounded border-gray-300 text-[#B260E6] focus:ring-[#B260E6] transition-colors"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="#" className="text-[#B260E6] hover:text-[#A050D6] font-medium transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[#B260E6] hover:text-[#A050D6] font-medium transition-colors">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">Already have an account?</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/signin"
                  className="inline-flex items-center text-[#B260E6] hover:text-[#A050D6] font-semibold transition-colors"
                >
                  Sign in to your account
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-4">Trusted by Australian workers and employers</p>
            <div className="flex justify-center space-x-6 opacity-60">
              <div className="text-xs text-gray-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Australian
              </div>
              <div className="text-xs text-gray-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </div>
              <div className="text-xs text-gray-600 flex items-center">
                <Star className="h-3 w-3 mr-1" />
                4.9/5 Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits Section */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#B260E6] to-[#3b82f6]">
        <div className="absolute inset-0">
          <Image
            src="https://source.unsplash.com/1200x1600/?australian-construction,skilled-trades"
            alt="Australian skilled trades"
            fill
            className="object-cover mix-blend-overlay opacity-20"
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
                {form.role === "admin" ? "🏢" : "👷"}
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                {form.role === "admin" ? "Find Australia&apos;s Best Talent" : "Build Your Australian Career"}
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                {form.role === "admin"
                  ? "Connect with skilled Australian workers and grow your business with the right talent."
                  : "Join thousands of skilled professionals finding meaningful work across Australia."
                }
              </p>
            </div>

            {/* Dynamic Benefits Based on Role */}
            <div className="space-y-4">
              {form.role === "user" ? (
                <>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      💼
                    </div>
                    <div>
                      <h4 className="font-semibold">50,000+ Jobs</h4>
                      <p className="text-sm opacity-80">Active opportunities across Australia</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      🎯
                    </div>
                    <div>
                      <h4 className="font-semibold">Smart Matching</h4>
                      <p className="text-sm opacity-80">Get matched with jobs that fit your skills</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      📱
                    </div>
                    <div>
                      <h4 className="font-semibold">Easy Apply</h4>
                      <p className="text-sm opacity-80">One-click applications to save time</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      👥
                    </div>
                    <div>
                      <h4 className="font-semibold">100,000+ Workers</h4>
                      <p className="text-sm opacity-80">Skilled professionals across Australia</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-semibold">Fast Hiring</h4>
                      <p className="text-sm opacity-80">Fill positions in days, not weeks</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      ✅
                    </div>
                    <div>
                      <h4 className="font-semibold">Verified Workers</h4>
                      <p className="text-sm opacity-80">All profiles are validated and reviewed</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Testimonial */}
            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <p className="text-lg italic mb-4">
                {form.role === "admin"
                  ? "SkillLink helped us find qualified electricians in Melbourne within 48 hours. The platform saved us weeks of recruitment time."
                  : "Within a week of joining SkillLink, I found a stable plumbing job in Sydney. The process was seamless and professional."
                }
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {form.role === "admin" ? "👨‍💼" : "👷"}
                </div>
                <div>
                  <p className="font-semibold">
                    {form.role === "admin" ? "Sarah Johnson" : "Michael Chen"}
                  </p>
                  <p className="text-sm opacity-80">
                    {form.role === "admin" ? "Construction Manager, Melbourne" : "Plumber, Sydney"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}