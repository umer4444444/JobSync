"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Shield } from "lucide-react";
import {
  Wrench,
  Hammer,
  Plug,
  Paintbrush,
  Truck,
  Utensils,
  Users,
  Scissors,
  Cog,
  Search,
  MapPin,
  Filter,
  Building,
  Clock,
  ArrowRight
} from "lucide-react"
import Image from "next/image";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  // Job categories with Australian context
  const jobCategories = [
    { id: 0, title: "All", icon: <Users className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-workers,team" },
    { id: 1, title: "Construction & Masonry", icon: <Hammer className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-construction,building" },
    { id: 2, title: "Electrical & Wiring", icon: <Plug className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-electrician,electrical" },
    { id: 3, title: "Plumbing & Fittings", icon: <Wrench className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-plumber,plumbing" },
    { id: 4, title: "Painting & Finishing", icon: <Paintbrush className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-painter,painting" },
    { id: 5, title: "Driving & Logistics", icon: <Truck className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-truck,logistics" },
    { id: 6, title: "Culinary & Kitchen Staff", icon: <Utensils className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-chef,kitchen" },
    { id: 7, title: "Cleaning & Maintenance", icon: <Users className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-cleaning,maintenance" },
    { id: 8, title: "Tailoring & Textile", icon: <Scissors className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-tailor,textile" },
    { id: 9, title: "Security & Supervision", icon: <Shield className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-security,supervisor" },
    { id: 10, title: "Machine & Auto Mechanics", icon: <Cog className="h-6 w-6 text-white" />, image: "https://source.unsplash.com/800x600/?australian-mechanic,automotive" },
  ];

  const locations = ["All", "Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD", "Perth, WA", "Adelaide, SA", "Canberra, ACT"];

  // Sample skilled jobs data with Australian context
  const jobs = [
    {
      id: 1,
      title: "Experienced Plumber",
      company: "AquaFlow Services",
      location: "Sydney, NSW",
      type: "Full-time",
      salary: "$75,000 - $95,000",
      posted: "2 hours ago",
      description:
        "Install and repair water supply lines, drainage systems, and related fixtures for residential and commercial properties.",
      emoji: "🔧",
      category: "Plumbing & Fittings",
      image: "/images/plumber.png",
      companyLogo: "/images/plumber.png", // optional — replace with your own logo if available
      featured: true,
    },
    {
      id: 2,
      title: "Commercial Electrician",
      company: "BrightVolt Ltd.",
      location: "Melbourne, VIC",
      type: "Full-time",
      salary: "$85,000 - $110,000",
      posted: "6 hours ago",
      description:
        "Maintain and install commercial wiring, lighting, and electrical systems for office buildings and retail spaces.",
      emoji: "💡",
      category: "Electrical & Wiring",
      image: "/images/electrician.png",
      companyLogo: "/images/electrician.png",
      featured: true,
    },
    {
      id: 3,
      title: "Construction Site Manager",
      company: "UrbanBuild Co.",
      location: "Brisbane, QLD",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      posted: "1 day ago",
      description:
        "Lead construction teams and manage residential and commercial building projects from start to finish.",
      emoji: "🏗️",
      category: "Construction & Masonry",
      image: "/images/construction.png",
      companyLogo: "/images/construction.png",
      featured: false,
    },
    {
      id: 4,
      title: "Head Chef (Modern Australian)",
      company: "The Grand Dine",
      location: "Sydney, NSW",
      type: "Full-time",
      salary: "$75,000 - $95,000",
      posted: "2 days ago",
      description:
        "Lead kitchen operations and create innovative Modern Australian cuisine in a premium waterfront restaurant.",
      emoji: "🍳",
      category: "Culinary & Kitchen Staff",
      image: "/images/chef.png",
      companyLogo: "/images/chef.png",
      featured: false,
    },
    {
      id: 5,
      title: "Delivery Driver",
      company: "Speedy Logistics",
      location: "Melbourne, VIC",
      type: "Full-time",
      salary: "$65,000 - $80,000",
      posted: "3 days ago",
      description:
        "Deliver goods and parcels safely within assigned routes across metropolitan Melbourne.",
      emoji: "🚚",
      category: "Driving & Logistics",
      image: "/images/driver.png",
      companyLogo: "/images/driver.png",
      featured: false,
    },
    {
      id: 6,
      title: "Residential Painter",
      company: "Premium Painters",
      location: "Perth, WA",
      type: "Contract",
      salary: "$70,000 - $90,000",
      posted: "4 days ago",
      description:
        "High-quality residential painting services for new builds and renovations across Perth.",
      emoji: "🎨",
      category: "Painting & Finishing",
      image: "/images/painter.png",
      companyLogo: "/images/painter.png",
      featured: false,
    },
  ];


  // Filtering jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || job.category === selectedCategory;
    const matchesType = selectedType === "All" || job.type === selectedType;
    const matchesLocation = selectedLocation === "All" || job.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesType && matchesLocation;
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* <Image
            src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=869"
            alt="Australian job opportunities"
            fill
            className="object-cover"
            priority
          /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#B260E6]/90 to-[#3b82f6]/90" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Dream Job in{" "}
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Australia
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of verified opportunities for skilled trades and professionals across Australia
          </p>
        </div>
      </section>

      {/* Enhanced Search & Filters Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 -mt-20 relative z-20 border">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Job title, company, or keywords..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B260E6] focus:border-transparent outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B260E6] focus:border-transparent outline-none appearance-none bg-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {jobCategories.map((cat) => (
                      <option key={cat.id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B260E6] focus:border-transparent outline-none appearance-none bg-white"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <Button className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                Search Jobs
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#B260E6]">1,200+</div>
                <div className="text-gray-600 text-sm">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ED84A5]">500+</div>
                <div className="text-gray-600 text-sm">Companies Hiring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#B260E6]">24h</div>
                <div className="text-gray-600 text-sm">Avg. Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ED84A5]">98%</div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {filteredJobs.length} Jobs Found
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {selectedLocation !== "All" && ` near ${selectedLocation}`}
              </h2>
              <p className="text-gray-600 text-lg">
                Browse the latest opportunities from Australia&apos;s top employers
              </p>

            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-600 text-sm">Sort by:</span>
              <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#B260E6] outline-none">
                <option>Most Relevant</option>
                <option>Newest First</option>
                <option>Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="grid gap-8">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card key={job.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Job Image */}
                    <div className="md:w-1/4 relative h-48 md:h-auto">
                      <Image
                        src={job.image}
                        alt={job.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {job.featured && (
                        <div className="absolute top-4 left-4 bg-[#ED84A5] text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Job Content */}
                    <div className="md:w-3/4 p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {/* <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                              <Image
                                src={job.companyLogo}
                                alt={`${job.company} logo`}
                                width={48}
                                height={48}
                                className="rounded-lg"
                              />
                            </div> */}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#B260E6] transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 font-medium">{job.company}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:text-right">
                          <div className="text-2xl font-bold text-[#ED84A5] mb-2">
                            {job.salary}
                          </div>
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {job.type}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 md:mb-0">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-[#B260E6]" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1 text-[#B260E6]" />
                            {job.category}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-[#B260E6]" />
                            {job.posted}
                          </div>
                        </div>

                        <Button className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] text-white rounded-full px-8">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No jobs found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search filters or browse all categories below
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedType("All");
                    setSelectedLocation("All");
                  }}
                  className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] text-white rounded-full px-8"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Job Categories Section */}
      {/* <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore by <span className="text-[#B260E6]">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse opportunities in Australia&apos;s most in-demand skilled trades and professions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {jobCategories
              .filter((cat) => cat.title !== "All")
              .map((category) => (
                <Card 
                  key={category.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white"
                  onClick={() => setSelectedCategory(category.title)}
                >
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="bg-[#B260E6] rounded-xl p-2 shadow-lg">
                        {category.icon}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {category.title}
                    </CardTitle>
                    <Button 
                      className="w-full bg-gray-100 hover:bg-[#B260E6] hover:text-white text-gray-700 rounded-full transition-all duration-300"
                      variant="ghost"
                    >
                      Browse Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#B260E6] to-[#3b82f6] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Sign up for job alerts and be the first to know when new opportunities match your skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <Button className="bg-white text-[#B260E6] hover:bg-gray-100 font-semibold px-8 py-3 rounded-full">
              Get Job Alerts
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}