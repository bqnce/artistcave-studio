export type TabType = 'bookings' | 'profile'

export interface BookingData {
  id: string
  date: string
  serviceName: string
  price?: number
  status?: string
}

export interface UserDashboardProps {
  userName: string;
  userEmail: string;
  userPhone: string;
  upcomingBookings: BookingData[];
  pastBookings: BookingData[];
}