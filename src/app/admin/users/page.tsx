"use client";

import { useState  } from "react"
import DataTable from "@/components/admin/DataTable";
import React from "react"

import { Badge } from "@/components/ui/badge"
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"
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
import { Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
 } from "@/components/ui/select"

import { Plus,  UserPlus,  Users  } from "lucide-react"


// Mock data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    registered: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    registered: "2024-02-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    role: "user",
    status: "inactive",
    registered: "2024-01-10",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "employer",
    status: "active",
    registered: "2024-03-05",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.b@example.com",
    role: "user",
    status: "active",
    registered: "2024-02-28",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "employer",
    status: "pending",
    registered: "2024-03-12",
  },
];

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (user: unknown) => {
    console.log("Edit user:", user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: unknown) => {
    console.log("Delete user:", user);
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
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Users
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage all registered users and their permissions.
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
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
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Users Table */}
      <DataTable
        data={users}
        columns={[
          {
            key: "name",
            label: "Name",
            render: (value) => (
              <span className="font-medium">{String(value)}</span>
            ),
          },
          {
            key: "email",
            label: "Email",
          },
          {
            key: "role",
            label: "Role",
            render: (value) => (
              <Badge
                variant={
                  value === "admin"
                    ? "default"
                    : value === "employer"
                    ? "secondary"
                    : "outline"
                }
              >
                {String(value)}
              </Badge>
            ),
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
            key: "registered",
            label: "Registered",
            render: (value) => new Date(String(value)).toLocaleDateString(),
          },
        ]}
        searchable={true}
        searchPlaceholder="Search users..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        actions={true}
      />
    </div>
  );
}
