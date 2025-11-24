"use client";

import StatWidget from "@/components/admin/StatWidget";
import DashboardCard from "@/components/admin/DashboardCard";
import DataTable from "@/components/admin/DataTable";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import { FileText,  Bookmark,  UserCheck  } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button  } from "@/components/ui/button";


import { ArrowRight  } from "lucide-react"


// Mock data
const recentActivity = [
  {
    id: 1,
    action: "Applied to",
    job: "Senior Frontend Developer",
    company: "TechCorp",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    action: "Saved job",
    job: "Full Stack Engineer",
    company: "StartupXYZ",
    time: "15 minutes ago",
    status: "saved",
  },
  {
    id: 3,
    action: "Profile updated",
    job: "Skills & Experience",
    company: "Profile",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 4,
    action: "Application status changed",
    job: "React Developer",
    company: "DevInc",
    time: "2 hours ago",
    status: "active",
  },
  {
    id: 5,
    action: "Applied to",
    job: "UI/UX Designer",
    company: "DesignCo",
    time: "3 hours ago",
    status: "pending",
  },
];

const applicationsTimeline = [
  { name: "Jan", count: 2 },
  { name: "Feb", count: 5 },
  { name: "Mar", count: 3 },
  { name: "Apr", count: 8 },
  { name: "May", count: 6 },
  { name: "Jun", count: 4 },
];

const applicationsStatusData = [
  { name: "Pending", value: 8 },
  { name: "Under Review", value: 5 },
  { name: "Shortlisted", value: 3 },
  { name: "Rejected", value: 4 },
  { name: "Accepted", value: 1 },
];

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your job search activity.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatWidget
          title="Total Applications"
          value="21"
          icon={FileText}
          description="All applications"
          trend={{ value: 15.5, isPositive: true }}
        />
        <StatWidget
          title="Active Applications"
          value="13"
          icon={CheckCircle}
          description="In progress"
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatWidget
          title="Saved Jobs"
          value="12"
          icon={Bookmark}
          description="Bookmarked jobs"
          trend={{ value: 25.0, isPositive: true }}
        />
        <StatWidget
          title="Profile Completion"
          value="85%"
          icon={UserCheck}
          description="Profile strength"
          trend={{ value: 5.0, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsChart
          title="Applications Status Distribution"
          description="Breakdown of your application statuses"
          data={applicationsStatusData}
          type="pie"
          dataKey="value"
          nameKey="name"
        />
        <AnalyticsChart
          title="Application Timeline"
          description="Your applications over time"
          data={applicationsTimeline}
          type="line"
          dataKey="count"
          nameKey="name"
        />
      </div>

      {/* Recent Activity */}
      <DashboardCard
        title="Recent Activity"
        description="Your latest job search actions"
        action={
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        }
      >
        <DataTable
          data={recentActivity}
          columns={[
            {
              key: "action",
              label: "Action",
              render: (value) => (
                <span className="font-medium">{String(value)}</span>
              ),
            },
            {
              key: "job",
              label: "Job",
            },
            {
              key: "company",
              label: "Company",
            },
            {
              key: "time",
              label: "Time",
            },
            {
              key: "status",
              label: "Status",
              render: (value) => {
                const variants = {
                  active: "default",
                  pending: "secondary",
                  completed: "outline",
                  saved: "secondary",
                } as const;
                return (
                  <Badge variant={variants[value as keyof typeof variants]}>
                    {String(value)}
                  </Badge>
                );
              },
            },
          ]}
          searchable={false}
          actions={false}
        />
      </DashboardCard>
    </div>
  );
}
