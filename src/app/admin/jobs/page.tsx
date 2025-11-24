"use client";

import { useState  } from "react"
import DataTable from "@/components/admin/DataTable";
import React from "react"

import { Badge } from "@/components/ui/badge"
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Briefcase 
 } from "lucide-react"

import { Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
 } from "@/components/ui/dialog"
import { Input  } from "@/components/ui/input"
import { Label  } from "@/components/ui/label"
import { Textarea  } from "@/components/ui/textarea"
import { Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
 } from "@/components/ui/select"

import { Plus } from "lucide-react"



// Mock data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    type: "Full-time",
    status: "active",
    postedDate: "2024-03-15",
    location: "Sydney, NSW",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "StartupXYZ",
    type: "Full-time",
    status: "active",
    postedDate: "2024-03-14",
    location: "Melbourne, VIC",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignStudio",
    type: "Part-time",
    status: "active",
    postedDate: "2024-03-13",
    location: "Brisbane, QLD",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech",
    type: "Contract",
    status: "pending",
    postedDate: "2024-03-12",
    location: "Remote",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateCo",
    type: "Full-time",
    status: "active",
    postedDate: "2024-03-11",
    location: "Perth, WA",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "DataLab",
    type: "Full-time",
    status: "inactive",
    postedDate: "2024-03-10",
    location: "Adelaide, SA",
  },
];

export default function JobsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (job: unknown) => {
    console.log("Edit job:", job);
    setIsDialogOpen(true);
  };

  const handleDelete = (job: unknown) => {
    console.log("Delete job:", job);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between pb-2"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#B260E6]/10 to-[#ED84A5]/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Jobs
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage all job listings and postings.
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
              <DialogDescription>
                Create a new job listing. Fill in all the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g., Senior Developer" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Company name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City, State" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Job description and requirements..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl transition-transform duration-200 hover:scale-[1.02]"
              >
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <Briefcase className="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Jobs Table */}
      <DataTable
        data={jobs}
        columns={[
          {
            key: "title",
            label: "Title",
            render: (value) => (
              <span className="font-medium">{String(value)}</span>
            ),
          },
          {
            key: "company",
            label: "Company",
          },
          {
            key: "type",
            label: "Type",
            render: (value) => <Badge variant="outline">{String(value)}</Badge>,
          },
          {
            key: "location",
            label: "Location",
          },
          {
            key: "status",
            label: "Status",
            render: (value) => {
              const variants = {
                active: "default",
                inactive: "secondary",
                pending: "outline",
              } as const;
              return (
                <Badge variant={variants[value as keyof typeof variants]}>
                  {String(value)}
                </Badge>
              );
            },
          },
          {
            key: "postedDate",
            label: "Posted Date",
            render: (value) => new Date(String(value)).toLocaleDateString(),
          },
        ]}
        searchable={true}
        searchPlaceholder="Search jobs..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        actions={true}
      />
    </div>
  );
}
