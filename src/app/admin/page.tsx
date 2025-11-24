"use client";

import StatWidget from "@/components/admin/StatWidget";
import DashboardCard from "@/components/admin/DashboardCard";
import DataTable from "@/components/admin/DataTable";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import {  Users,  Building2,  CheckCircle2 ,Briefcase } from "lucide-react"
import { motion } from "framer-motion";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button  } from "@/components/ui/button";



import { ArrowRight  } from "lucide-react"

// Mock data
const recentActivity = [
  {
    id: 1,
    action: "New job posted",
    user: "TechCorp",
    item: "Senior Developer",
    time: "2 minutes ago",
    status: "active",
  },
  {
    id: 2,
    action: "User registered",
    user: "John Doe",
    item: "job-seeker@example.com",
    time: "15 minutes ago",
    status: "pending",
  },
  {
    id: 3,
    action: "Company verified",
    user: "StartupXYZ",
    item: "Verified status",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 4,
    action: "Job application",
    user: "Jane Smith",
    item: "Frontend Developer",
    time: "2 hours ago",
    status: "active",
  },
  {
    id: 5,
    action: "User updated profile",
    user: "Mike Johnson",
    item: "Profile completion",
    time: "3 hours ago",
    status: "completed",
  },
];

const jobsData = [
  { name: "Jan", count: 45 },
  { name: "Feb", count: 52 },
  { name: "Mar", count: 48 },
  { name: "Apr", count: 61 },
  { name: "May", count: 55 },
  { name: "Jun", count: 67 },
];

import { LayoutDashboard  } from "lucide-react"


export default function AdminDashboard() {
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
          <LayoutDashboard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back! Here&apos;s what&apos;s happening with your platform.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Jobs",
            value: "1,234",
            icon: Briefcase,
            description: "Active job listings",
            trend: { value: 12.5, isPositive: true },
          },
          {
            title: "Total Users",
            value: "8,456",
            icon: Users,
            description: "Registered users",
            trend: { value: 8.3, isPositive: true },
          },
          {
            title: "Active Companies",
            value: "342",
            icon: Building2,
            description: "Verified companies",
            trend: { value: 5.2, isPositive: true },
          },
          {
            title: "Pending Approvals",
            value: "23",
            icon: CheckCircle2,
            description: "Awaiting review",
            trend: { value: -2.1, isPositive: false },
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatWidget {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsChart
          title="Jobs Posted Over Time"
          description="Monthly job posting trends"
          data={jobsData}
          type="line"
          dataKey="count"
          nameKey="name"
        />
        <DashboardCard
          title="Quick Actions"
          description="Common administrative tasks"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: "Manage Users", desc: "View all users" },
              { icon: Briefcase, label: "Manage Jobs", desc: "View all jobs" },
              {
                icon: Building2,
                label: "Manage Companies",
                desc: "View all companies",
              },
              {
                icon: CheckCircle2,
                label: "Pending Reviews",
                desc: "23 items",
              },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Button
                    variant="outline"
                    className="h-auto w-full flex-col items-start p-4 rounded-xl transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
                  >
                    <Icon className="mb-2 h-5 w-5 text-primary" />
                    <span className="font-medium">{action.label}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {action.desc}
                    </span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      {/* Recent Activity */}
      <DashboardCard
        title="Recent Activity"
        description="Latest actions and updates"
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
              key: "user",
              label: "User",
            },
            {
              key: "item",
              label: "Item",
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
