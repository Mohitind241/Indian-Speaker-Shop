// Mock data for the Indian Speaker Shop

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
  description: string
  features: string[]
  inStock: boolean
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  isAdmin: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
  address: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'JBL Flip 6',
    brand: 'JBL',
    price: 11999,
    originalPrice: 14999,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'Bluetooth Speakers',
    rating: 4.5,
    reviews: 2340,
    description: 'Portable Bluetooth speaker with powerful sound and IP67 waterproof rating.',
    features: ['12 Hours Playtime', 'IP67 Waterproof', 'PartyBoost', 'USB-C Charging'],
    inStock: true
  },
  {
    id: '2',
    name: 'Sony SRS-XB43',
    brand: 'Sony',
    price: 16990,
    originalPrice: 19990,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop',
    category: 'Bluetooth Speakers',
    rating: 4.3,
    reviews: 1856,
    description: 'Extra Bass wireless speaker with 24-hour battery life and party lights.',
    features: ['24 Hours Battery', 'Extra Bass', 'Party Lights', 'Dust & Water Resistant'],
    inStock: true
  },
  {
    id: '3',
    name: 'boAt Stone 1400',
    brand: 'boAt',
    price: 3999,
    originalPrice: 6990,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=400&fit=crop',
    category: 'Bluetooth Speakers',
    rating: 4.1,
    reviews: 5670,
    description: '30W Bluetooth speaker with rugged IPX5 water resistant design.',
    features: ['30W Output', 'IPX5 Water Resistant', '7 Hours Playtime', 'TWS Feature'],
    inStock: true
  },
  {
    id: '4',
    name: 'Zebronics Zeb-Monster',
    brand: 'Zebronics',
    price: 2499,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: 'Bluetooth Speakers',
    rating: 3.9,
    reviews: 3420,
    description: 'Portable tower speaker with RGB lights and karaoke function.',
    features: ['RGB Lights', 'Karaoke Support', 'FM Radio', 'USB/SD Card'],
    inStock: true
  },
  {
    id: '5',
    name: 'JBL Bar 5.1',
    brand: 'JBL',
    price: 49990,
    originalPrice: 59990,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    category: 'Soundbars',
    rating: 4.6,
    reviews: 890,
    description: '5.1 Channel soundbar with wireless subwoofer and detachable speakers.',
    features: ['550W Output', 'Wireless Subwoofer', 'Detachable Speakers', 'Dolby Digital'],
    inStock: true
  },
  {
    id: '6',
    name: 'Sony HT-S40R',
    brand: 'Sony',
    price: 34990,
    originalPrice: 39990,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
    category: 'Soundbars',
    rating: 4.4,
    reviews: 1230,
    description: '5.1ch Home Cinema Soundbar System with wireless rear speakers.',
    features: ['600W Output', 'Wireless Rear Speakers', 'Bluetooth', 'HDMI ARC'],
    inStock: true
  },
  {
    id: '7',
    name: 'boAt Aavante Bar 1700D',
    brand: 'boAt',
    price: 8999,
    originalPrice: 12990,
    image: 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=400&h=400&fit=crop',
    category: 'Soundbars',
    rating: 4.0,
    reviews: 4560,
    description: '120W soundbar with wired subwoofer and multiple connectivity options.',
    features: ['120W Output', 'Wired Subwoofer', 'Bluetooth 5.0', 'Remote Control'],
    inStock: true
  },
  {
    id: '8',
    name: 'Zebronics Juke Bar 9700',
    brand: 'Zebronics',
    price: 6999,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop',
    category: 'Soundbars',
    rating: 3.8,
    reviews: 2890,
    description: '450W soundbar with wireless subwoofer and LED display.',
    features: ['450W Output', 'Wireless Subwoofer', 'LED Display', 'Wall Mountable'],
    inStock: false
  },
  {
    id: '9',
    name: 'JBL PartyBox 310',
    brand: 'JBL',
    price: 42999,
    originalPrice: 49999,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    category: 'Party Speakers',
    rating: 4.7,
    reviews: 670,
    description: 'Portable party speaker with dazzling lights and powerful JBL Pro Sound.',
    features: ['240W Output', 'Light Show', '18 Hours Battery', 'Mic & Guitar Input'],
    inStock: true
  },
  {
    id: '10',
    name: 'Sony MHC-V73D',
    brand: 'Sony',
    price: 54990,
    originalPrice: 64990,
    image: 'https://images.unsplash.com/photo-1516223725307-6f76b9182f7c?w=400&h=400&fit=crop',
    category: 'Party Speakers',
    rating: 4.5,
    reviews: 456,
    description: 'High Power Party Speaker with 360 degree sound and karaoke.',
    features: ['360 Sound', 'Karaoke', 'Guitar Input', 'Party Lights'],
    inStock: true
  },
  {
    id: '11',
    name: 'boAt PartyPal 200',
    brand: 'boAt',
    price: 12999,
    originalPrice: 17999,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    category: 'Party Speakers',
    rating: 4.2,
    reviews: 2340,
    description: '120W party speaker with wireless mic and RGB lights.',
    features: ['120W Output', 'Wireless Mic', 'RGB Lights', 'TWS Mode'],
    inStock: true
  },
  {
    id: '12',
    name: 'Zebronics Zeb-Moving Monster',
    brand: 'Zebronics',
    price: 7999,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: 'Party Speakers',
    rating: 3.7,
    reviews: 1890,
    description: 'Trolley speaker with wireless mic, FM radio and recording.',
    features: ['60W Output', 'Trolley Design', 'Wireless Mic', 'Recording'],
    inStock: true
  }
]

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@speakershop.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@test.com',
    password: 'user123',
    isAdmin: false
  }
]

export const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: '2',
    userName: 'Rahul S.',
    rating: 5,
    comment: 'Amazing sound quality! Best portable speaker I have ever used.',
    date: '2024-01-15'
  },
  {
    id: '2',
    productId: '1',
    userId: '3',
    userName: 'Priya M.',
    rating: 4,
    comment: 'Great speaker, but a bit expensive. Battery life is excellent.',
    date: '2024-01-10'
  },
  {
    id: '3',
    productId: '3',
    userId: '4',
    userName: 'Amit K.',
    rating: 5,
    comment: 'Best value for money! boAt never disappoints.',
    date: '2024-01-08'
  }
]

export const categories = [
  'All',
  'Bluetooth Speakers',
  'Soundbars',
  'Party Speakers'
]

export const brands = ['All', 'JBL', 'Sony', 'boAt', 'Zebronics']
