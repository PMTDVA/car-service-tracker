"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SearchIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { fileService } from "@/lib/file-service"
import { format } from "date-fns"

export default function Search() {
  const { toast } = useToast()
  const [registrationSearch, setRegistrationSearch] = useState("")
  const [dateRangeSearch, setDateRangeSearch] = useState({
    startDate: "",
    endDate: "",
  })
  const [carResults, setCarResults] = useState([])
  const [serviceResults, setServiceResults] = useState([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleRegistrationSearch = async () => {
    if (!registrationSearch.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a registration number to search",
        variant: "destructive",
      })
      return
    }

    try {
      const allCars = await fileService.loadCars()
      const matchingCars = allCars.filter((car) =>
        car.registrationNumber.toLowerCase().includes(registrationSearch.toLowerCase()),
      )

      setCarResults(matchingCars)
      setSearchPerformed(true)

      if (matchingCars.length === 0) {
        toast({
          title: "No Results",
          description: "No cars found with that registration number",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search cars: " + error.message,
        variant: "destructive",
      })
    }
  }

  const handleDateRangeSearch = async () => {
    const { startDate, endDate } = dateRangeSearch

    if (!startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please enter both start and end dates",
        variant: "destructive",
      })
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Validation Error",
        description: "Start date must be before end date",
        variant: "destructive",
      })
      return
    }

    try {
      const allRecords = await fileService.loadServiceHistory()
      const matchingRecords = allRecords.filter((record) => {
        const recordDate = new Date(record.date)
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate)
      })

      // Get car details for each record
      const allCars = await fileService.loadCars()
      const recordsWithCarDetails = matchingRecords.map((record) => {
        const car = allCars.find((car) => car.id === record.carId) || {
          registrationNumber: "Unknown",
          make: "Unknown",
          model: "Unknown",
        }
        return {
          ...record,
          registrationNumber: car.registrationNumber,
          carDetails: `${car.make} ${car.model}`,
        }
      })

      setServiceResults(recordsWithCarDetails)
      setSearchPerformed(true)

      if (matchingRecords.length === 0) {
        toast({
          title: "No Results",
          description: "No service records found in the specified date range",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search service history: " + error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Search</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Car Search by Registration */}
        <Card>
          <CardHeader>
            <CardTitle>Find Car by Registration</CardTitle>
            <CardDescription>Search for a car using its registration number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="registrationSearch" className="sr-only">
                  Registration Number
                </Label>
                <Input
                  id="registrationSearch"
                  placeholder="Enter registration number"
                  value={registrationSearch}
                  onChange={(e) => setRegistrationSearch(e.target.value)}
                />
              </div>
              <Button onClick={handleRegistrationSearch}>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {searchPerformed && carResults.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carResults.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">{car.registrationNumber}</TableCell>
                      <TableCell>{car.make}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {searchPerformed && carResults.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No cars found matching that registration number</p>
            )}
          </CardContent>
        </Card>

        {/* Service History Search by Date Range */}
        <Card>
          <CardHeader>
            <CardTitle>Find Service History by Date Range</CardTitle>
            <CardDescription>Search for service records within a specific date range</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRangeSearch.startDate}
                  onChange={(e) => setDateRangeSearch((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRangeSearch.endDate}
                  onChange={(e) => setDateRangeSearch((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <Button onClick={handleDateRangeSearch} className="w-full">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search Date Range
            </Button>

            {searchPerformed && serviceResults.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceResults.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{record.registrationNumber}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell className="text-right">${Number.parseFloat(record.cost).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {searchPerformed && serviceResults.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No service records found in the specified date range
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

