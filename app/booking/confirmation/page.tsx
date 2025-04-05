import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Thank you for booking your service appointment with AutoCare Service Center. We have received your booking
              request.
            </p>
            <p className="mb-4">
              A confirmation email has been sent to your email address with all the details of your appointment.
            </p>
            <div className="bg-muted p-4 rounded-lg text-left mb-4">
              <p className="font-medium">What happens next?</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Our team will review your booking</li>
                <li>You'll receive a confirmation call</li>
                <li>Bring your vehicle at the scheduled time</li>
                <li>We'll notify you when the service is complete</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">View My Bookings</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

