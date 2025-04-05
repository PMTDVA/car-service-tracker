"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Save, X, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fileService } from "@/lib/file-service"

export default function CarManagement({ selectedUser, onSelectCar }) {
  const { toast } = useToast()
  const [cars, setCars] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState(null)
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    color: "",
  })

  useEffect(() => {
    loadCars()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      // Filter cars for the selected user
      filterCarsByUser(selectedUser.id)
    }
  }, [selectedUser])

  const loadCars = async () => {
    try {
      const loadedCars = await fileService.loadCars()
      setCars(loadedCars)

      if (selectedUser) {
        filterCarsByUser(selectedUser.id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cars: " + error.message,
        variant: "destructive",
      })
    }
  }

  const filterCarsByUser = (userId) => {
    fileService.loadCars().then((allCars) => {
      const userCars = allCars.filter((car) => car.userId === userId)
      setCars(userCars)
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCar = () => {
    if (!selectedUser) {
      toast({
        title: "No User Selected",
        description: "Please select a user before adding a car",
        variant: "destructive",
      })
      return
    }

    setFormData({
      id: Date.now().toString(),
      userId: selectedUser.id,
      registrationNumber: "",
      make: "",
      model: "",
      year: "",
      color: "",
    })
    setEditingCar(null)
    setShowForm(true)
  }

  const handleEditCar = (car) => {
    setFormData({ ...car })
    setEditingCar(car)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.registrationNumber || !formData.make || !formData.model || !formData.year) {
      toast({
        title: "Validation Error",
        description: "Registration number, make, model, and year are required fields",
        variant: "destructive",
      })
      return
    }

    try {
      // Load all cars first
      const allCars = await fileService.loadCars()

      // Check for duplicate registration number
      const isDuplicate = allCars.some(
        (car) => car.registrationNumber === formData.registrationNumber && car.id !== formData.id,
      )

      if (isDuplicate) {
        toast({
          title: "Validation Error",
          description: "A car with this registration number already exists",
          variant: "destructive",
        })
        return
      }

      let updatedAllCars

      if (editingCar) {
        // Update existing car
        updatedAllCars = allCars.map((car) => (car.id === formData.id ? formData : car))
      } else {
        // Add new car
        updatedAllCars = [...allCars, formData]
      }

      await fileService.saveCars(updatedAllCars)

      // Update the local state with filtered cars for the selected user
      const userCars = updatedAllCars.filter((car) => car.userId === selectedUser.id)
      setCars(userCars)

      setShowForm(false)

      toast({
        title: "Success",
        description: editingCar ? "Car updated successfully" : "Car added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save car: " + error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteCar = async (carId) => {
    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      // Load all cars
      const allCars = await fileService.loadCars()

      // Remove the car
      const updatedAllCars = allCars.filter((car) => car.id !== carId)

      // Save all cars
      await fileService.saveCars(updatedAllCars)

      // Update local state
      setCars(cars.filter((car) => car.id !== carId))

      toast({
        title: "Success",
        description: "Car deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car: " + error.message,
        variant: "destructive",
      })
    }
  }

  if (!selectedUser) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No User Selected</AlertTitle>
        <AlertDescription>Please select a user from the User Management tab before managing cars.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Car Management</h2>
          <p className="text-muted-foreground">Managing cars for: {selectedUser.name}</p>
        </div>
        <Button onClick={handleAddCar}>
          <Plus className="mr-2 h-4 w-4" /> Add Car
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCar ? "Edit Car" : "Add New Car"}</CardTitle>
            <CardDescription>
              {editingCar ? "Update the car's information" : "Enter the details to register a new car"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="ABC123"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    placeholder="Toyota"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Camry"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="2023"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="Silver"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> {editingCar ? "Update" : "Save"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {cars.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Registered Cars</CardTitle>
            <CardDescription>List of all cars registered to {selectedUser.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium">{car.registrationNumber}</TableCell>
                    <TableCell>{car.make}</TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>{car.color || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => onSelectCar(car)}>
                          <span className="sr-only">Select</span>
                          Select
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditCar(car)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteCar(car.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">No cars found for this user. Add a new car to get started.</p>
            <Button onClick={handleAddCar}>
              <Plus className="mr-2 h-4 w-4" /> Add Car
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

