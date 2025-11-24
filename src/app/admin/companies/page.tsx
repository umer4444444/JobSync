"use client";

import DataTable from "@/components/admin/DataTable";


import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

import { Building2  } from "lucide-react"


// Mock data
const companies = [
  {
    id: 1,
    name: "TechCorp",
    industry: "Technology",
    status: "verified",
    totalJobs: 45,
    location: "Sydney, NSW",
  },
  {
    id: 2,
    name: "StartupXYZ",
    industry: "Software",
    status: "verified",
    totalJobs: 32,
    location: "Melbourne, VIC",
  },
  {
    id: 3,
    name: "DesignStudio",
    industry: "Design",
    status: "verified",
    totalJobs: 18,
    location: "Brisbane, QLD",
  },
  {
    id: 4,
    name: "CloudTech",
    industry: "Cloud Services",
    status: "pending",
    totalJobs: 0,
    location: "Perth, WA",
  },
  {
    id: 5,
    name: "InnovateCo",
    industry: "Innovation",
    status: "verified",
    totalJobs: 67,
    location: "Adelaide, SA",
  },
  {
    id: 6,
    name: "DataLab",
    industry: "Data Science",
    status: "verified",
    totalJobs: 29,
    location: "Canberra, ACT",
  },
  {
    id: 7,
    name: "GreenEnergy",
    industry: "Energy",
    status: "verified",
    totalJobs: 14,
    location: "Darwin, NT",
  },
  {
    id: 8,
    name: "HealthTech",
    industry: "Healthcare",
    status: "pending",
    totalJobs: 0,
    location: "Hobart, TAS",
  },
];

export default function CompaniesPage() {
  const handleViewProfile = (company: unknown) => {
    console.log("View profile:", company);
    // Navigate to company detail page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 pb-2"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#B260E6]/10 to-[#ED84A5]/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Companies
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage all registered companies and their verification status.
          </p>
        </div>
      </motion.div>

      {/* Companies Table */}
      <DataTable
        data={companies}
        columns={[
          {
            key: "name",
            label: "Company Name",
            render: (value) => (
              <span className="font-medium text-foreground">
                {String(value)}
              </span>
            ),
          },
          {
            key: "industry",
            label: "Industry",
            render: (value) => <Badge variant="outline">{String(value)}</Badge>,
          },
          {
            key: "location",
            label: "Location",
          },
          {
            key: "totalJobs",
            label: "Total Jobs",
            render: (value) => (
              <span className="font-medium">{String(value)} posted</span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (value) => {
              const variants = {
                verified: "default",
                pending: "secondary",
                inactive: "outline",
              } as const;
              return (
                <Badge variant={variants[value as keyof typeof variants]}>
                  {String(value)}
                </Badge>
              );
            },
          },
        ]}
        searchable={true}
        searchPlaceholder="Search companies..."
        onEdit={handleViewProfile}
        editLabel="View Profile"
        actions={true}
      />
    </div>
  );
}
