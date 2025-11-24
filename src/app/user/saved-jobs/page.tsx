"use client";
import { motion } from "framer-motion"
import { X } from "lucide-react"
import  "react"
import { useState  } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DashboardCard from "@/components/admin/DashboardCard";
import { Card,  CardContent  } from "@/components/ui/card"
import React from "react"

import { Input  } from "@/components/ui/input"

import { Bookmark, 
  Search, 
  Grid3x3, 
  List, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
 } from "lucide-react"


// Mock saved jobs data
const savedJobsData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Sydney, Australia",
    type: "Full-time",
    salary: "$120k - $150k",
    savedDate: "2024-06-10",
    description: "We are looking for an experienced frontend developer...",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Melbourne, Australia",
    type: "Full-time",
    salary: "$100k - $130k",
    savedDate: "2024-06-09",
    description: "Join our dynamic team as a full stack engineer...",
  },
  {
    id: 3,
    title: "React Developer",
    company: "DevInc",
    location: "Remote",
    type: "Contract",
    salary: "$90k - $120k",
    savedDate: "2024-06-08",
    description: "Looking for a skilled React developer...",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "DesignCo",
    location: "Brisbane, Australia",
    type: "Part-time",
    salary: "$80k - $110k",
    savedDate: "2024-06-07",
    description: "Creative UI/UX designer needed...",
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "CloudTech",
    location: "Perth, Australia",
    type: "Full-time",
    salary: "$110k - $140k",
    savedDate: "2024-06-06",
    description: "Backend developer with Node.js experience...",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "InfraSys",
    location: "Adelaide, Australia",
    type: "Full-time",
    salary: "$115k - $145k",
    savedDate: "2024-06-05",
    description: "DevOps engineer to manage our infrastructure...",
  },
];

export default function SavedJobsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(savedJobsData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredJobs(savedJobsData);
    } else {
      const filtered = savedJobsData.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          job.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  const removeSavedJob = (id: number) => {
    const updated = filteredJobs.filter((job) => job.id !== id);
    setFilteredJobs(updated);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#B260E6]/10 to-[#ED84A5]/10">
              <Bookmark className="h-6 w-6 text-[#B260E6]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
              <p className="text-muted-foreground mt-1">
                Your saved job listings ({filteredJobs.length} jobs)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5]"
                  : ""
              }
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5]"
                  : ""
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search saved jobs..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Jobs Grid/List */}
      {filteredJobs.length === 0 ? (
        <DashboardCard title="No Saved Jobs" description="You haven't saved any jobs yet">
          <div className="flex flex-col items-center justify-center py-12">
            <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Start saving jobs to see them here</p>
            <Button className="mt-4 bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5]">
              Browse Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DashboardCard>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="group overflow-hidden border-border bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-[#B260E6] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSavedJob(job.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Saved {formatDate(job.savedDate)}</span>
                    </div>
                  </div>

                  <Badge className={getTypeColor(job.type)}>{job.type}</Badge>

                  <div className="mt-4 space-y-2">
                    <Button className="w-full rounded-xl bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] hover:scale-[1.02] transition-transform">
                      Quick Apply
                    </Button>
                    <Button variant="outline" className="w-full rounded-xl">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <DashboardCard title={`${filteredJobs.length} Saved Jobs`}>
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                          </div>
                          <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Saved {formatDate(job.savedDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeSavedJob(job.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button className="rounded-xl bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] whitespace-nowrap">
                          Quick Apply
                        </Button>
                        <Button variant="outline" className="rounded-xl whitespace-nowrap">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      )}
    </div>
  );
}

