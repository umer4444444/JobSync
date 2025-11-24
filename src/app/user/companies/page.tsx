"use client";

import { useState  } from "react"
import DashboardCard from "@/components/admin/DashboardCard";
import { Card,  CardContent  } from "@/components/ui/card"
import React from "react"
import { Badge } from "@/components/ui/badge"
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input  } from "@/components/ui/input"
import { Label  } from "@/components/ui/label"
import { Eye  ,Briefcase} from "lucide-react"

import { Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
 } from "@/components/ui/select"
import { Building2, 
  Search, 
  MapPin, 
  Users, 
  Heart, 
  Filter, 
 } from "lucide-react"


// Mock companies data
const companiesData = [
  {
    id: 1,
    name: "TechCorp",
    industry: "Technology",
    location: "Sydney, Australia",
    openJobs: 12,
    employees: "500-1000",
    description: "Leading technology company specializing in innovative software solutions.",
  },
  {
    id: 2,
    name: "StartupXYZ",
    industry: "Technology",
    location: "Melbourne, Australia",
    openJobs: 8,
    employees: "50-200",
    description: "Fast-growing startup building the next generation of web applications.",
  },
  {
    id: 3,
    name: "DevInc",
    industry: "Technology",
    location: "Remote",
    openJobs: 15,
    employees: "100-500",
    description: "Remote-first development company focused on cutting-edge technologies.",
  },
  {
    id: 4,
    name: "DesignCo",
    industry: "Design",
    location: "Brisbane, Australia",
    openJobs: 5,
    employees: "20-50",
    description: "Creative design agency delivering exceptional user experiences.",
  },
  {
    id: 5,
    name: "CloudTech",
    industry: "Technology",
    location: "Perth, Australia",
    openJobs: 9,
    employees: "200-500",
    description: "Cloud infrastructure and DevOps solutions provider.",
  },
  {
    id: 6,
    name: "InfraSys",
    industry: "Technology",
    location: "Adelaide, Australia",
    openJobs: 6,
    employees: "100-200",
    description: "Infrastructure and systems management solutions.",
  },
  {
    id: 7,
    name: "InnovateLabs",
    industry: "Technology",
    location: "Sydney, Australia",
    openJobs: 10,
    employees: "50-100",
    description: "Innovation lab focused on emerging technologies and research.",
  },
  {
    id: 8,
    name: "AppWorks",
    industry: "Technology",
    location: "Remote",
    openJobs: 7,
    employees: "30-100",
    description: "Mobile app development company with global reach.",
  },
];

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [followedCompanies, setFollowedCompanies] = useState<number[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState(companiesData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedIndustry, selectedLocation);
  };

  const applyFilters = (
    query: string,
    industry: string,
    location: string
  ) => {
    let filtered = companiesData;

    // Search filter
    if (query.trim()) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query.toLowerCase()) ||
          company.description.toLowerCase().includes(query.toLowerCase()) ||
          company.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Industry filter
    if (industry !== "All") {
      filtered = filtered.filter((company) => company.industry === industry);
    }

    // Location filter
    if (location !== "All") {
      if (location === "Remote") {
        filtered = filtered.filter((company) => company.location === "Remote");
      } else {
        filtered = filtered.filter((company) =>
          company.location.includes(location)
        );
      }
    }

    setFilteredCompanies(filtered);
  };

  const toggleFollow = (companyId: number) => {
    if (followedCompanies.includes(companyId)) {
      setFollowedCompanies(followedCompanies.filter((id) => id !== companyId));
    } else {
      setFollowedCompanies([...followedCompanies, companyId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#B260E6]/10 to-[#ED84A5]/10">
            <Building2 className="h-6 w-6 text-[#B260E6]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
            <p className="text-muted-foreground mt-1">
              Explore companies and find your perfect match ({filteredCompanies.length} companies)
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <DashboardCard title="Filters" description="Refine your search">
            <div className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select
                  value={selectedIndustry}
                  onValueChange={(value) => {
                    setSelectedIndustry(value);
                    applyFilters(searchQuery, value, selectedLocation);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Industries</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={selectedLocation}
                  onValueChange={(value) => {
                    setSelectedLocation(value);
                    applyFilters(searchQuery, selectedIndustry, value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Locations</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Sydney">Sydney</SelectItem>
                    <SelectItem value="Melbourne">Melbourne</SelectItem>
                    <SelectItem value="Brisbane">Brisbane</SelectItem>
                    <SelectItem value="Perth">Perth</SelectItem>
                    <SelectItem value="Adelaide">Adelaide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustry("All");
                  setSelectedLocation("All");
                  setFilteredCompanies(companiesData);
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </DashboardCard>
        </div>

        {/* Companies Grid */}
        <div className="lg:col-span-3">
          {filteredCompanies.length === 0 ? (
            <DashboardCard title="No Companies Found" description="Try adjusting your filters">
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No companies match your criteria</p>
              </div>
            </DashboardCard>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="group overflow-hidden border-border bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#B260E6] to-[#ED84A5] text-white font-bold text-lg shadow-lg">
                              {company.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg group-hover:text-[#B260E6] transition-colors">
                                {company.name}
                              </h3>
                              <Badge variant="secondary" className="mt-1">
                                {company.industry}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={
                            followedCompanies.includes(company.id)
                              ? "text-[#ED84A5] hover:text-[#ED84A5]"
                              : "text-muted-foreground hover:text-[#ED84A5]"
                          }
                          onClick={() => toggleFollow(company.id)}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              followedCompanies.includes(company.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {company.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{company.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{company.employees} employees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span className="font-medium text-[#B260E6]">
                            {company.openJobs} open jobs
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl"
                          onClick={() => console.log("View company", company.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                        <Button
                          className="flex-1 rounded-xl bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] hover:scale-[1.02] transition-transform"
                          onClick={() => console.log("View jobs", company.id)}
                        >
                          View Jobs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

