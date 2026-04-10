import { User, UserRole, Turf, Booking } from '@/types/index';
import bananiImg from '@/assets/images/banani.png';
import bashundharaImg from '@/assets/images/bashundhara.png';
import dhanmondiImg from '@/assets/images/dhanmondi.png';
import farmgateImg from '@/assets/images/farmgate.png';
import gulshanImg from '@/assets/images/gulshan.png';
import mirpurImg from '@/assets/images/mirpur.png';
import mohammadpurImg from '@/assets/images/mohammadpur.png';
import motijheelImg from '@/assets/images/motijheel.png';
import shahbagImg from '@/assets/images/shahbag.png';
import uttaraImg from '@/assets/images/uttara.png';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Mr Karim',
    email: 'user@example.com',
    role: UserRole.USER,
    password: 'password123'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@example.com',
    role: UserRole.MANAGER,
    password: 'password123'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    password: 'password123'
  }
];

export const INITIAL_TURFS: Turf[] = [
  {
    id: 't1',
    name: 'Mirpur Arena Turf',
    location: 'Mirpur',
    sport: 'Football',
    pricePerHour: 1200,
    description: 'A spacious turf suitable for both 5-a-side Football and Cricket matches. Features excellent floodlights.',
    images: [mirpurImg],
    managerId: '2',
    amenities: ['Parking', 'Water', 'Gallery'],
    coordinates: { lat: 23.8042, lng: 90.3673 }
  },
  {
    id: 't2',
    name: 'Dhanmondi Sports Hub',
    location: 'Dhanmondi',
    sport: 'Football',
    pricePerHour: 1800,
    description: 'Premier training facility located in the heart of Dhanmondi. Ideal for professional training sessions.',
    images: [dhanmondiImg],
    managerId: '2',
    amenities: ['Locker Room', 'Showers', 'Cafe'],
    coordinates: { lat: 23.7461, lng: 90.3742 }
  },
  {
    id: 't3',
    name: 'Banani Premier Turf',
    location: 'Banani',
    sport: 'Football',
    pricePerHour: 1600,
    description: 'High-end turf with FIFA grade grass. Perfect for corporate tournaments and competitive cricket.',
    images: [bananiImg],
    managerId: '2',
    amenities: ['VIP Lounge', 'Parking', 'Pro Shop'],
    coordinates: { lat: 23.7940, lng: 90.4043 }
  },
  {
    id: 't4',
    name: 'Gulshan Elite Arena',
    location: 'Gulshan',
    sport: 'Football',
    pricePerHour: 2000,
    description: 'Luxury sports arena for professional matches. Offers top-tier amenities and privacy.',
    images: [gulshanImg],
    managerId: '99',
    amenities: ['AC Dugouts', 'Live Screening', 'Premium Showers'],
    coordinates: { lat: 23.7925, lng: 90.4162 }
  },
  {
    id: 't5',
    name: 'Motijheel Central Turf',
    location: 'Motijheel',
    sport: 'Football',
    pricePerHour: 2000,
    description: 'Located in the business district, great for after-work cricket and football games.',
    images: [motijheelImg],
    managerId: '2',
    amenities: ['Parking', 'First Aid', 'Refreshments'],
    coordinates: { lat: 23.7330, lng: 90.4172 }
  },
  {
    id: 't6',
    name: 'Shyamoli Play Zone',
    location: 'Shyamoli',
    sport: 'Football',
    pricePerHour: 1500,
    description: 'A cozy but well-maintained turf focused on youth training and casual games.',
    images: [bashundharaImg],
    managerId: '99',
    amenities: ['Water', 'Equipment Rental'],
    coordinates: { lat: 23.8191, lng: 90.4526 }
  },
  {
    id: 't7',
    name: 'Mohammadpur Turf Complex',
    location: 'Mohammadpur',
    sport: 'Football',
    pricePerHour: 1600,
    description: 'Large complex supporting multiple sports. Popular for local cricket leagues.',
    images: [mohammadpurImg],
    managerId: '2',
    amenities: ['Parking', 'Prayer Room', 'Water'],
    coordinates: { lat: 23.7595, lng: 90.3603 }
  },
  {
    id: 't8',
    name: 'Uttara North Arena',
    location: 'Uttara',
    sport: 'Football',
    pricePerHour: 1600,
    description: 'Modern facility in Uttara Sector 4. Features a smooth surface ideal for fast-paced football.',
    images: [uttaraImg],
    managerId: '2',
    amenities: ['Changing Rooms', 'Food Court', 'Wifi'],
    coordinates: { lat: 23.8759, lng: 90.3795 }
  },
  {
    id: 't9',
    name: 'Farmgate Sports Arena',
    location: 'Farmgate',
    sport: 'Football',
    pricePerHour: 1700,
    description: 'Centrally located arena accessible from all parts of the city. Great for regular training.',
    images: [farmgateImg],
    managerId: '99',
    amenities: ['Water', 'Seating Area'],
    coordinates: { lat: 23.7561, lng: 90.3872 }
  },
  {
    id: 't10',
    name: 'Shahbag City Turf',
    location: 'Shahbag',
    sport: 'Football',
    pricePerHour: 1900,
    description: 'Vibrant atmosphere near the university area. Excellent for student tournaments.',
    images: [shahbagImg],
    managerId: '2',
    amenities: ['Student Discount', 'Water', 'Locker'],
    coordinates: { lat: 23.7389, lng: 90.3945 }
  }
];

// Start with empty bookings for real-world usage
export const INITIAL_BOOKINGS: Booking[] = [];