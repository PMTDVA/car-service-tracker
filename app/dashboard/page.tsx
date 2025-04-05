"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, Clock, History, Home, Plus, Settings, User } from "lucide-react"

// Mock data for demonstration
const upcomingAppointments = [
  {
    id: 1,
    date: "May 15, 2025",
    time: "10:00 AM",
    service: "Oil Change",
    vehicle: "Toyota Camry (2020)",
    status: "confirmed",
  },
  {
    id: 2,
    date: "June 3, 2025",
    time: "2:30 PM",
    service: "Brake Inspection",
    vehicle: "Toyota Camry (2020)",
    status: "pending",
  },
]

const serviceHistory = [
  {
    id: 101,
    date: "January 10, 2025",
    service: "Full Service",
    vehicle: "Toyota Camry (2020)",
    cost: "$249.99",
    notes: "Changed oil, replaced air filter, rotated tires",
  },
  {
    id: 102,
    date: "October 5, 2024",
    service: "Oil Change",
    vehicle: "Toyota Camry (2020)",
    cost: "$49.99",
    notes: "Synthetic oil change",
  },
  {
    id: 103,
    date: "July 22, 2024",
    service: "Tire Rotation",
    vehicle: "Toyota Camry (2020)",
    cost: "$29.99",
    notes: "Rotated and balanced all tires",
  },
]

const vehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: "2020",
    vin: "1HGCM82633A123456",
    lastService: "January 10, 2025",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("appointments")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-1 mb-6">
                <h2 className="font-semibold text-lg">John Doe</h2>
                <p className="text-sm text-muted-foreground">john@example.com</p>
              </div>
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="mr-2 h-4 w-4" />
                Service History
              </TabsTrigger>
              <TabsTrigger value="vehicles">
                <Car className="mr-2 h-4 w-4" />
                My Vehicles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                <Button asChild>
                  <Link href="/booking">
                    <Plus className="mr-2 h-4 w-4" />
                    Book New
                  </Link>
                </Button>
              </div>

              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{appointment.service}</CardTitle>
                          <CardDescription>{appointment.vehicle}</CardDescription>
                        </div>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                          {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {appointment.date}
                        <Clock className="ml-4 mr-2 h-4 w-4" />
                        {appointment.time}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">You have no upcoming appointments</p>
                    <Button asChild>
                      <Link href="/booking">Book a Service</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              <h2 className="text-xl font-semibold mb-4">Service History</h2>

              {serviceHistory.length > 0 ? (
                <div className="space-y-4">
                  {serviceHistory.map((service) => (
                    <Card key={service.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{service.service}</CardTitle>
                            <CardDescription>{service.vehicle}</CardDescription>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{service.cost}</span>
                            <p className="text-sm text-muted-foreground">{service.date}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{service.notes}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          View Invoice
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No service history available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="vehicles">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Vehicles</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </div>

              {vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((vehicle) => (
                    <Card key={vehicle.id}>
                      <CardHeader>
                        <CardTitle>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">VIN:</span>
                            <span>{vehicle.vin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Service:</span>
                            <span>{vehicle.lastService}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          Service History
                        </Button>
                        <Button size="sm">Schedule Service</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">No vehicles added yet</p>
                    <Button>Add a Vehicle</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

