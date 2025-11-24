"use client";

import { useState  } from "react"
import DashboardCard from "@/components/admin/DashboardCard";
import { Card,  CardContent  } from "@/components/ui/card"
import React from "react"
import { Badge } from "@/components/ui/badge"
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"

import { Briefcase } from "lucide-react";

import { Input  } from "@/components/ui/input"
import { Label  } from "@/components/ui/label"

import { Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
 } from "@/components/ui/select"
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  ArrowRight, 
  Filter, 
 } from "lucide-react"


// Mock jobs data
const jobsData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Sydney, Australia",
    type: "Full-time",
    salary: "$120k - $150k",
    industry: "Technology",
    remote: false,
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Melbourne, Australia",
    type: "Full-time",
    salary: "$100k - $130k",
    industry: "Technology",
    remote: true,
  },
  {
    id: 3,
    title: "React Developer",
    company: "DevInc",
    location: "Remote",
    type: "Contract",
    salary: "$90k - $120k",
    industry: "Technology",
    remote: true,
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "DesignCo",
    location: "Brisbane, Australia",
    type: "Part-time",
    salary: "$80k - $110k",
    industry: "Design",
    remote: false,
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "CloudTech",
    location: "Perth, Australia",
    type: "Full-time",
    salary: "$110k - $140k",
    industry: "Technology",
    remote: false,
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "InfraSys",
    location: "Adelaide, Australia",
    type: "Full-time",
    salary: "$115k - $145k",
    industry: "Technology",
    remote: true,
  },
  {
    id: 7,
    title: "Product Manager",
    company: "InnovateLabs",
    location: "Sydney, Australia",
    type: "Full-time",
    salary: "$130k - $160k",
    industry: "Technology",
    remote: false,
  },
  {
    id: 8,
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Remote",
    type: "Contract",
    salary: "$95k - $125k",
    industry: "Technology",
    remote: true,
  },
];

export default function BrowseJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [filteredJobs, setFilteredJobs] = useState(jobsData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedType, selectedLocation, selectedIndustry);
  };

  const applyFilters = (
    query: string,
    type: string,
    location: string,
    industry: string
  ) => {
    let filtered = jobsData;

    // Search filter
    if (query.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          job.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Type filter
    if (type !== "All") {
      filtered = filtered.filter((job) => job.type === type);
    }

    // Location filter
    if (location !== "All") {
      if (location === "Remote") {
        filtered = filtered.filter((job) => job.remote);
      } else {
        filtered = filtered.filter((job) => job.location.includes(location));
      }
    }

    // Industry filter
    if (industry !== "All") {
      filtered = filtered.filter((job) => job.industry === industry);
    }

    setFilteredJobs(filtered);
  };

  const toggleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Full-time": "bg-green-500/10 text-green-700 dark:text-green-400",
      "Part-time": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      Contract: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    };
    return colors[type] || "bg-gray-500/10 text-gray-700 dark:text-gray-400";
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
            <Briefcase className="h-6 w-6 text-[#B260E6]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Browse Jobs</h1>
            <p className="text-muted-foreground mt-1">
              Discover opportunities that match your skills ({filteredJobs.length} jobs)
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
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value);
                    applyFilters(searchQuery, value, selectedLocation, selectedIndustry);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
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
                    applyFilters(searchQuery, selectedType, value, selectedIndustry);
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
                  </SelectContent>
                </Select>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select
                  value={selectedIndustry}
                  onValueChange={(value) => {
                    setSelectedIndustry(value);
                    applyFilters(searchQuery, selectedType, selectedLocation, value);
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

              {/* Reset Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setSelectedLocation("All");
                  setSelectedIndustry("All");
                  setFilteredJobs(jobsData);
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </DashboardCard>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-3">
          {filteredJobs.length === 0 ? (
            <DashboardCard title="No Jobs Found" description="Try adjusting your filters">
              <div className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No jobs match your criteria</p>
              </div>
            </DashboardCard>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="group overflow-hidden border-border bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1 group-hover:text-[#B260E6] transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                              {job.remote && (
                                <Badge variant="secondary">Remote</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.industry}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              className="rounded-xl bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] hover:scale-[1.02] transition-transform"
                              onClick={() => console.log("Apply to", job.id)}
                            >
                              Quick Apply
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => console.log("View", job.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={
                            savedJobs.includes(job.id)
                              ? "text-[#ED84A5] hover:text-[#ED84A5]"
                              : "text-muted-foreground hover:text-[#ED84A5]"
                          }
                          onClick={() => toggleSaveJob(job.id)}
                        >
                          <Bookmark
                            className={`h-5 w-5 ${
                              savedJobs.includes(job.id) ? "fill-current" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredJobs.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="default" className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5]">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

