import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, PenToolIcon as Tool, Wrench, Car, Gauge, Battery, Droplet } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Oil Change",
      description: "Regular oil changes are essential for maintaining your engine's performance and longevity.",
      details:
        "Our oil change service includes draining old oil, replacing the oil filter, and refilling with high-quality oil that meets your vehicle's specifications.",
      icon: <Droplet className="h-6 w-6" />,
      price: "From $29.99",
    },
    {
      id: 2,
      title: "Brake Service",
      description: "Ensure your safety with our comprehensive brake inspection and repair service.",
      details:
        "We inspect brake pads, rotors, calipers, and fluid levels, replacing worn components as needed to ensure optimal braking performance.",
      icon: <Gauge className="h-6 w-6" />,
      price: "From $89.99",
    },
    {
      id: 3,
      title: "Battery Replacement",
      description: "Don't get stranded with a dead battery. We offer testing and replacement services.",
      details:
        "Our technicians will test your battery's charge, clean terminals, and replace if necessary with a new battery that meets your vehicle's specifications.",
      icon: <Battery className="h-6 w-6" />,
      price: "From $119.99",
    },
    {
      id: 4,
      title: "Tire Services",
      description: "From rotation to replacement, we handle all your tire needs.",
      details:
        "Services include tire rotation, balancing, alignment, puncture repair, and new tire installation to ensure optimal traction and safety.",
      icon: <Car className="h-6 w-6" />,
      price: "From $49.99",
    },
    {
      id: 5,
      title: "Engine Diagnostics",
      description: "Check engine light on? Our advanced diagnostic tools can identify the issue.",
      details:
        "We use state-of-the-art computer diagnostics to read error codes and identify problems with your vehicle's engine, transmission, and other systems.",
      icon: <Tool className="h-6 w-6" />,
      price: "From $79.99",
    },
    {
      id: 6,
      title: "Full Vehicle Inspection",
      description: "Comprehensive inspection of all major vehicle systems for peace of mind.",
      details:
        "Our thorough inspection covers brakes, steering, suspension, electrical systems, fluid levels, belts, hoses, and more to identify any potential issues.",
      icon: <Wrench className="h-6 w-6" />,
      price: "From $99.99",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/" className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We offer a comprehensive range of automotive services to keep your vehicle running at its best.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.details}</p>
              <p className="font-medium mt-4">{service.price}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/booking">Book This Service</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Service?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          If you don't see the specific service you need, or if you have questions about our offerings, please contact
          us for personalized assistance.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/booking">Book Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

