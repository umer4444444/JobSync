"use client";

import { useState  } from "react"
import DashboardCard from "@/components/admin/DashboardCard";
import DataTable from "@/components/admin/DataTable";
import React from "react"
import { Badge } from "@/components/ui/badge"
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"

import { FileText } from "lucide-react"

import { 
 } from "@/components/ui/dropdown-menu"

// Mock applications data
const applicationsData = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp",
    appliedDate: "2024-06-15",
    status: "Under Review",
    location: "Sydney, Australia",
    salary: "$120k - $150k",
  },
  {
    id: 2,
    jobTitle: "Full Stack Engineer",
    company: "StartupXYZ",
    appliedDate: "2024-06-14",
    status: "Pending",
    location: "Melbourne, Australia",
    salary: "$100k - $130k",
  },
  {
    id: 3,
    jobTitle: "React Developer",
    company: "DevInc",
    appliedDate: "2024-06-12",
    status: "Shortlisted",
    location: "Remote",
    salary: "$90k - $120k",
  },
  {
    id: 4,
    jobTitle: "UI/UX Designer",
    company: "DesignCo",
    appliedDate: "2024-06-10",
    status: "Rejected",
    location: "Brisbane, Australia",
    salary: "$80k - $110k",
  },
  {
    id: 5,
    jobTitle: "Backend Developer",
    company: "CloudTech",
    appliedDate: "2024-06-08",
    status: "Accepted",
    location: "Perth, Australia",
    salary: "$110k - $140k",
  },
  {
    id: 6,
    jobTitle: "DevOps Engineer",
    company: "InfraSys",
    appliedDate: "2024-06-05",
    status: "Under Review",
    location: "Adelaide, Australia",
    salary: "$115k - $145k",
  },
  {
    id: 7,
    jobTitle: "Product Manager",
    company: "InnovateLabs",
    appliedDate: "2024-06-03",
    status: "Pending",
    location: "Sydney, Australia",
    salary: "$130k - $160k",
  },
  {
    id: 8,
    jobTitle: "Mobile Developer",
    company: "AppWorks",
    appliedDate: "2024-06-01",
    status: "Shortlisted",
    location: "Remote",
    salary: "$95k - $125k",
  },
];

const statusFilters = [
  "All",
  "Pending",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Accepted",
];

export default function ApplicationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredData, setFilteredData] = useState(applicationsData);

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === "All") {
      setFilteredData(applicationsData);
    } else {
      setFilteredData(applicationsData.filter((app) => app.status === filter));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
      Pending: "secondary",
      "Under Review": "default",
      Shortlisted: "default",
      Rejected: "destructive",
      Accepted: "default",
    };
    return variants[status] || "secondary";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            <FileText className="h-6 w-6 text-[#B260E6]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your job applications.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilter(filter)}
            className={
              selectedFilter === filter
                ? "bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5]"
                : ""
            }
          >
            {filter}
            {filter !== "All" && (
              <Badge
                variant="secondary"
                className="ml-2 bg-background/50 text-xs"
              >
                {applicationsData.filter((app) => app.status === filter).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Applications Table */}
      <DashboardCard
        title={`${filteredData.length} Application${
          filteredData.length !== 1 ? "s" : ""
        }`}
        description="Your job application history"
      >
        <DataTable
          data={filteredData}
          columns={[
            {
              key: "jobTitle",
              label: "Job Title",
              render: (value, row) => (
                <div>
                  <div className="font-medium">{String(value)}</div>
                  <div className="text-xs text-muted-foreground">
                    {(row as (typeof applicationsData)[number]).location}
                  </div>
                </div>
              ),
            },
            {
              key: "company",
              label: "Company",
              render: (value) => (
                <span className="font-medium">{String(value)}</span>
              ),
            },
            {
              key: "appliedDate",
              label: "Applied Date",
              render: (value) => formatDate(value as string),
            },
            {
              key: "status",
              label: "Status",
              render: (value) => (
                <Badge variant={getStatusBadgeVariant(value as string)}>
                  {String(value)}
                </Badge>
              ),
            },
            {
              key: "salary",
              label: "Salary",
            },
          ]}
          searchable={true}
          searchPlaceholder="Search applications..."
          actions={true}
          editLabel="View"
          onEdit={(row) => {
            // Handle view action
            console.log("View application", row);
          }}
          onDelete={(row) => {
            // Handle withdraw action
            console.log("Withdraw application", row);
          }}
        />
      </DashboardCard>
    </div>
  );
}
