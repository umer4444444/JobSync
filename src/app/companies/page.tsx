"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Search,
  ArrowRight,
  Star,
  Heart,
  Filter,
  Factory,
  ClipboardList,
  UserCheck2,
  BadgeCheck,
  Building2,
  Users,
  BadgeDollarSign,
  BarChart3,
  Coffee,
  GraduationCap,

  Baby,
} from "lucide-react"

/**
 * CompaniesPage.tsx
 * - All JSX is inside the component return
 * - No emojis for icons — corporate lucide icons used (Option B)
 * - State is strongly typed
 * - No JSX outside return
 */

/* ---------------------------
   Types
   --------------------------- */
type Company = {
  id: number
  name: string
  industry: string
  location: string
  employees: string
  openJobs: number
  description: string
  logo?: string
  coverImage?: string
  rating?: number
  featured?: boolean
  established?: number
}

type Benefit = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  image?: string
}

type StatItem = {
  number: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  bg: string
}

/* ---------------------------
   Data
   --------------------------- */
const companies: Company[] = [
  {
    id: 1,
    name: "BuildRight Constructions",
    industry: "Construction & Masonry",
    location: "Sydney, NSW",
    employees: "500-1000",
    openJobs: 12,
    description:
      "Trusted construction company delivering residential and commercial masonry projects with precision and quality.",
    logo: "https://via.placeholder.com/100x100?text=BuildRight+Logo",
    coverImage: "/images/construction-company.png",
    rating: 4.8,
    featured: true,
    established: 1998,
  },
  {
    id: 2,
    name: "Elite Electric Works",
    industry: "Electrical & Wiring",
    location: "Melbourne, VIC",
    employees: "100-200",
    openJobs: 10,
    description:
      "Leading electrical contracting firm specializing in wiring, power systems, and industrial installations.",
    logo: "https://via.placeholder.com/100x100?text=Elite+Electric+Logo",
    coverImage: "/images/electrical eng.png",
    rating: 4.6,
    featured: true,
    established: 2005,
  },
  {
    id: 3,
    name: "FlowMaster Plumbing",
    industry: "Plumbing & Fittings",
    location: "Brisbane, QLD",
    employees: "200-500",
    openJobs: 15,
    description:
      "Expert plumbing company providing installation, repair, and maintenance services across major Australian cities.",
    logo: "https://via.placeholder.com/100x100?text=FlowMaster+Logo",
    coverImage: "/images/flow master.png",
    rating: 4.9,
    featured: false,
    established: 2001,
  },
  {
    id: 4,
    name: "PerfectFinish Painters",
    industry: "Painting & Finishing",
    location: "Perth, WA",
    employees: "50-100",
    openJobs: 6,
    description:
      "Professional painting and finishing services for homes, offices, and industrial spaces, ensuring flawless results.",
    logo: "https://via.placeholder.com/100x100?text=PerfectFinish+Logo",
    coverImage: "/images/painters.png",
    rating: 4.7,
    featured: false,
    established: 2012,
  },
  {
    id: 5,
    name: "DrivePro Logistics",
    industry: "Driving & Logistics",
    location: "Adelaide, SA",
    employees: "300-600",
    openJobs: 9,
    description:
      "Reliable logistics company offering professional driving, delivery, and freight management solutions.",
    logo: "https://via.placeholder.com/100x100?text=DrivePro+Logo",
    coverImage: "/images/driver 1.png",
    rating: 4.5,
    featured: false,
    established: 1995,
  },
  {
    id: 6,
    name: "ChefConnect Kitchens",
    industry: "Culinary & Kitchen Staff",
    location: "Sydney, NSW",
    employees: "100-300",
    openJobs: 8,
    description:
      "Hospitality group providing expert culinary staff and chefs to top hotels, restaurants, and catering services.",
    logo: "https://via.placeholder.com/100x100?text=ChefConnect+Logo",
    coverImage: "/images/chef-company.png",
    rating: 4.8,
    featured: true,
    established: 2008,
  },
  {
    id: 7,
    name: "CleanMate Services",
    industry: "Cleaning & Maintenance",
    location: "Melbourne, VIC",
    employees: "200-400",
    openJobs: 11,
    description:
      "Comprehensive cleaning and maintenance company serving commercial, industrial, and residential clients.",
    logo: "https://via.placeholder.com/100x100?text=CleanMate+Logo",
    coverImage: "/images/cleaning-company.png",
    rating: 4.4,
    featured: false,
    established: 2010,
  },
  {
    id: 8,
    name: "TailorWorks Studio",
    industry: "Tailoring & Textile",
    location: "Brisbane, QLD",
    employees: "50-100",
    openJobs: 7,
    description:
      "Professional tailoring and textile production company known for precision stitching and custom designs.",
    logo: "https://via.placeholder.com/100x100?text=TailorWorks+Logo",
    coverImage: "/images/tailor 1.png",
    rating: 4.9,
    featured: false,
    established: 2015,
  },
  {
    id: 9,
    name: "SecureOne Guards",
    industry: "Security & Supervision",
    location: "Perth, WA",
    employees: "400-700",
    openJobs: 14,
    description:
      "Security agency providing trained guards, supervisors, and safety personnel for corporate and event security.",
    logo: "https://via.placeholder.com/100x100?text=SecureOne+Logo",
    coverImage: "/images/security-company.png",
    rating: 4.6,
    featured: false,
    established: 2003,
  },
]

const benefits: Benefit[] = [
  { icon: BadgeDollarSign, title: "Competitive Salaries", description: "Top-tier compensation packages with industry-leading rates", image: "/images/salary 2.png" },
  { icon: BarChart3, title: "Career Growth", description: "Work with leaders who prioritize your long-term success and advancement", image: "/images/growth.png" },
  { icon: Coffee, title: "Work-Life Balance", description: "Flexible arrangements to enjoy the Australian lifestyle", image: "/images/balance 1.png" },
  { icon: GraduationCap, title: "Learning Budget", description: "Annual stipend for professional development and training", image: "/images/learning.png" },
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive medical, dental, and mental health support", image: "/images/health 2.png" },
  { icon: Baby, title: "Family Support", description: "Generous parental leave and childcare assistance programs", image: "/images/family.png" },
]

const stats: StatItem[] = [
  { number: "2,000+", label: "Australian Companies", icon: Factory, bg: "bg-gradient-to-br from-[#B260E6] to-[#ED84A5]" },
  { number: "50,000+", label: "Active Jobs", icon: ClipboardList, bg: "bg-gradient-to-br from-[#ED84A5] to-[#FF9F7C]" },
  { number: "500,000+", label: "Candidates", icon: UserCheck2, bg: "bg-gradient-to-br from-[#6EC8FF] to-[#B260E6]" },
  { number: "95%", label: "Success Rate", icon: BadgeCheck, bg: "bg-gradient-to-br from-[#8EE078] to-[#4CCB9A]" },
]

const industries = [
  "All",
  "Construction & Masonry",
  "Electrical & Wiring",
  "Plumbing & Fittings",
  "Painting & Finishing",
  "Driving & Logistics",
  "Culinary & Kitchen Staff",
  "Cleaning & Maintenance",
  "Tailoring & Textile",
  "Security & Supervision",
]

/* ---------------------------
   Component
   --------------------------- */
export default function CompaniesPage(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All")
  const [favoriteCompanies, setFavoriteCompanies] = useState<number[]>([])

  const toggleFavorite = (companyId: number) => {
    setFavoriteCompanies((prev) =>
      prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]
    )
  }

  const filteredCompanies = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return companies.filter((company) => {
      const matchesSearch =
        q === "" ||
        company.name.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q) ||
        company.location.toLowerCase().includes(q)
      const matchesIndustry = selectedIndustry === "All" || company.industry === selectedIndustry
      return matchesSearch && matchesIndustry
    })
  }, [searchTerm, selectedIndustry])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#B260E6] to-[#3b82f6] text-white py-28 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Australia&apos;s{" "}
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Top Employers</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with leading Australian companies that value skilled trades and professional growth
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200 h-5 w-5" />
              <Input
                placeholder="Search companies by name, industry or location..."
                className="pl-12 h-14 text-lg rounded-xl border-0 focus:ring-2 focus:ring-white bg-white/20 backdrop-blur-sm text-white placeholder-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
                aria-label="Search companies"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, idx) => {
              const Icon = s.icon
              return (
                <div key={idx} className="p-5 bg-white rounded-2xl shadow-lg text-center hover:shadow-xl transition">
                  <div className={`mx-auto w-14 h-14 flex items-center justify-center text-3xl rounded-2xl text-white shadow-md ${s.bg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-gray-800">{s.number}</h3>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured <span className="text-[#B260E6]">Companies</span>
            </h2>
            <p className="text-gray-600 text-lg">Discover {filteredCompanies.length} amazing companies hiring across Australia</p>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <select
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B260E6] outline-none appearance-none bg-white w-full sm:w-64"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry((e.target as HTMLSelectElement).value)}
                aria-label="Filter by industry"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("")
                setSelectedIndustry("All")
              }}
              className="hidden sm:inline-flex"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => {
            const isFav = favoriteCompanies.includes(company.id)
            return (
              <Card key={company.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={company.coverImage ?? "/images/placeholder.png"}
                    alt={`${company.name} cover`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={company.featured}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  <button
                    onClick={() => toggleFavorite(company.id)}
                    aria-label={isFav ? "Remove favorite" : "Add to favorites"}
                    className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isFav ? "fill-[#ED84A5] text-[#ED84A5]" : "text-white"}`} />
                  </button>

                  {company.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[#ED84A5] text-white border-0 px-3 py-1">Featured</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="pt-8 pb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-[#B260E6] transition-colors">{company.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-[#B260E6] text-white border-0 text-xs">{company.industry}</Badge>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {company.rating}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#ED84A5]" />
                      {company.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-[#ED84A5]" />
                      {company.employees} employees
                    </div>
                    <div className="flex items-center text-[#B260E6] font-semibold">
                      <Building2 className="h-4 w-4 mr-2" />
                      {company.openJobs} open positions
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] text-white rounded-xl py-3 group/btn">
                    View Opportunities
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No results */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No companies found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Try adjusting your search terms or browse all industries</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedIndustry("All")
              }}
              className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] text-white rounded-full px-8"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load more placeholder */}
        {filteredCompanies.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-[#B260E6] text-[#B260E6] rounded-full px-8 py-3">
              Load More Companies
            </Button>
          </div>
        )}
      </main>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Work With <span className="text-[#ED84A5]">Australian Companies?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join companies that invest in their employees&apos; growth, well-being, and work-life balance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => {
              const Icon = b.icon
              return (
                <Card key={i} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={b.image ?? "/images/placeholder.png"} alt={b.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B260E6] to-[#ED84A5] rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#B260E6] transition-colors">{b.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{b.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#B260E6] to-[#3b82f6] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Perfect Company Match?</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">Join thousands of skilled professionals who found their dream workplace through our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-[#B260E6] hover:bg-gray-100 font-semibold px-6 py-3 text-lg rounded-full">Create Company Profile</Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-semibold px-6 py-3 text-lg rounded-full">Browse All Jobs</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
