"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Save, X, AlertCircle, ArrowUpDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fileService } from "@/lib/file-service"
import { LinkedList } from "@/lib/linked-list"
import { format } from "date-fns"

export default function ServiceHistory({ selectedCar }) {
  const { toast } = useToast()
  const [serviceRecords, setServiceRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [sortDirection, setSortDirection] = useState("desc") // desc = newest first
  const [formData, setFormData] = useState({
    id: "",
    carId: "",
    date: "",
    description: "",
    cost: "",
    mileage: "",
  })

  // Create a linked list to store service records
  const serviceList = new LinkedList()

  useEffect(() => {
    if (selectedCar) {
      loadServiceHistory()
    }
  }, [selectedCar])

  const loadServiceHistory = async () => {
    if (!selectedCar) return

    try {
      const allRecords = await fileService.loadServiceHistory()
      const carRecords = allRecords.filter((record) => record.carId === selectedCar.id)

      // Clear the linked list
      serviceList.clear()

      // Add records to linked list
      carRecords.forEach((record) => {
        serviceList.append(record)
      })

      // Sort the records
      const sortedRecords = sortServiceRecords(carRecords, sortDirection)
      setServiceRecords(sortedRecords)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service history: " + error.message,
        variant: "destructive",
      })
    }
  }

  const sortServiceRecords = (records, direction) => {
    // Implementation of selection sort algorithm
    const recordsCopy = [...records]
    const n = recordsCopy.length

    for (let i = 0; i < n - 1; i++) {
      let minMaxIndex = i

      for (let j = i + 1; j < n; j++) {
        const dateA = new Date(recordsCopy[j].date)
        const dateB = new Date(recordsCopy[minMaxIndex].date)

        if (direction === "asc") {
          // Ascending (oldest first)
          if (dateA < dateB) {
            minMaxIndex = j
          }
        } else {
          // Descending (newest first)
          if (dateA > dateB) {
            minMaxIndex = j
          }
        }
      }

      if (minMaxIndex !== i) {
        // Swap
        ;[recordsCopy[i], recordsCopy[minMaxIndex]] = [recordsCopy[minMaxIndex], recordsCopy[i]]
      }
    }

    return recordsCopy
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddService = () => {
    if (!selectedCar) {
      toast({
        title: "No Car Selected",
        description: "Please select a car before adding a service record",
        variant: "destructive",
      })
      return
    }

    setFormData({
      id: Date.now().toString(),
      carId: selectedCar.id,
      date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
      description: "",
      cost: "",
      mileage: "",
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.date || !formData.description || !formData.cost || !formData.mileage) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    try {
      // Load all service records
      const allRecords = await fileService.loadServiceHistory()

      // Add new record
      const newRecord = { ...formData }
      const updatedRecords = [...allRecords, newRecord]

      // Save all records
      await fileService.saveServiceHistory(updatedRecords)

      // Update linked list and state
      serviceList.append(newRecord)

      // Re-sort and update the UI
      const carRecords = updatedRecords.filter((record) => record.carId === selectedCar.id)
      const sortedRecords = sortServiceRecords(carRecords, sortDirection)
      setServiceRecords(sortedRecords)

      setShowForm(false)

      toast({
        title: "Success",
        description: "Service record added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service record: " + error.message,
        variant: "destructive",
      })
    }
  }

  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc"
    setSortDirection(newDirection)

    // Re-sort the records
    const sortedRecords = sortServiceRecords(serviceRecords, newDirection)
    setServiceRecords(sortedRecords)
  }

  if (!selectedCar) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Car Selected</AlertTitle>
        <AlertDescription>
          Please select a car from the Car Management tab before viewing service history.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service History</h2>
          <p className="text-muted-foreground">
            {selectedCar.make} {selectedCar.model} ({selectedCar.year}) - {selectedCar.registrationNumber}
          </p>
        </div>
        <Button onClick={handleAddService}>
          <Plus className="mr-2 h-4 w-4" /> Add Service Record
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Service Record</CardTitle>
            <CardDescription>Enter the details of the service performed on this vehicle</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Service Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="45000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={handleInputChange}
                    placeholder="150.00"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Service Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Oil change, filter replacement, etc."
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save Record
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Service Records</CardTitle>
            <Button variant="outline" size="sm" onClick={toggleSortDirection}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort by Date ({sortDirection === "asc" ? "Oldest First" : "Newest First"})
            </Button>
          </div>
          <CardDescription>Complete service history for this vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          {serviceRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service Description</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>{record.mileage.toLocaleString()} mi</TableCell>
                    <TableCell className="text-right">${Number.parseFloat(record.cost).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground mb-4">No service records found for this vehicle.</p>
              <Button onClick={handleAddService}>
                <Plus className="mr-2 h-4 w-4" /> Add First Service Record
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

