"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserManagement from "@/components/user-management"
import CarManagement from "@/components/car-management"
import ServiceHistory from "@/components/service-history"
import Search from "@/components/search"

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)

  return (
    <main className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Car Service Management System</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="cars">Car Management</TabsTrigger>
          <TabsTrigger value="service">Service History</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement onSelectUser={setSelectedUser} />
        </TabsContent>

        <TabsContent value="cars">
          <CarManagement selectedUser={selectedUser} onSelectCar={setSelectedCar} />
        </TabsContent>

        <TabsContent value="service">
          <ServiceHistory selectedCar={selectedCar} />
        </TabsContent>

        <TabsContent value="search">
          <Search />
        </TabsContent>
      </Tabs>
    </main>
  )
}

