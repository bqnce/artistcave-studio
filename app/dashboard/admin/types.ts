export type TabType = 'overview' | 'bookings' | 'guests' | 'services' | 'schedules'

export interface Service { 
  id: string
  name: string
  durationMins: number
  price: number
  description: string | null 
}

export interface TodayBooking { 
  id: string
  time: string
  guestName: string
  guestPhone: string
  serviceName: string
  price: number 
}

export interface UpcomingBooking { 
  id: string
  date: string
  time: string
  guestName: string
  serviceName: string
  price: number 
}

// --- ÚJ TÍPUSOK A VENDÉGEKHEZ ---
export interface UserBooking {
  id: string;
  date: string;
  status: string;
  serviceName: string;
  price: number;
}

export interface UserData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  appointments: UserBooking[];
}

export interface AdminDashboardProps {
  userName: string
  initialServices: Service[]
  todayRevenue: number
  todayCount: number
  todayBookings: TodayBooking[]
  allUpcomingBookings: UpcomingBooking[]
  cancelledBookings: UpcomingBooking[]
  users: UserData[] // <-- ÚJ PROP
}