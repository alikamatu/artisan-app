import BookingManagement from "@/_components/dashboard/bookings/booking-management-worker";

export default function WorkerBookingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <BookingManagement userRole="worker" userId="123" />
    </div>
  )
}