export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Mall {
  id: string;
  name: string;
  totalSlots: number;
  availableSlots: number;
  revenue: number;
  image: string;
}

export interface ParkingSlot {
  _id: string;
  mall: string;
  price: number;
  slotNumber: string;
  isBooked: boolean;
  date: string;
  time: string;
}

export interface Mall {
  _id: string;
  mall: string;
}