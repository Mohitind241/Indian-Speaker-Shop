'use client'

import { Product, CartItem, User, Order, Review } from './data'

// Auth helpers
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
  } else {
    localStorage.removeItem('currentUser')
  }
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem('users')
  return users ? JSON.parse(users) : []
}

export function addUser(user: User): void {
  const users = getUsers()
  users.push(user)
  localStorage.setItem('users', JSON.stringify(users))
}

// Cart helpers
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export function addToCart(product: Product, quantity: number = 1): void {
  const cart = getCart()
  const existingItem = cart.find(item => item.product.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ product, quantity })
  }
  
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cartUpdated'))
}

export function updateCartQuantity(productId: string, quantity: number): void {
  const cart = getCart()
  const item = cart.find(item => item.product.id === productId)
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cartUpdated'))
    }
  }
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter(item => item.product.id !== productId)
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cartUpdated'))
}

export function clearCart(): void {
  localStorage.removeItem('cart')
  window.dispatchEvent(new Event('cartUpdated'))
}

export function getCartTotal(): number {
  return getCart().reduce((total, item) => total + item.product.price * item.quantity, 0)
}

export function getCartCount(): number {
  return getCart().reduce((count, item) => count + item.quantity, 0)
}

// Wishlist helpers
export function getWishlist(): Product[] {
  if (typeof window === 'undefined') return []
  const wishlist = localStorage.getItem('wishlist')
  return wishlist ? JSON.parse(wishlist) : []
}

export function addToWishlist(product: Product): void {
  const wishlist = getWishlist()
  if (!wishlist.find(p => p.id === product.id)) {
    wishlist.push(product)
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
    window.dispatchEvent(new Event('wishlistUpdated'))
  }
}

export function removeFromWishlist(productId: string): void {
  const wishlist = getWishlist().filter(p => p.id !== productId)
  localStorage.setItem('wishlist', JSON.stringify(wishlist))
  window.dispatchEvent(new Event('wishlistUpdated'))
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some(p => p.id === productId)
}

// Orders helpers
export function getOrders(): Order[] {
  if (typeof window === 'undefined') return []
  const orders = localStorage.getItem('orders')
  return orders ? JSON.parse(orders) : []
}

export function addOrder(order: Omit<Order, 'id' | 'date'>): Order {
  const orders = getOrders()
  const newOrder: Order = {
    ...order,
    id: `ORD${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  }
  orders.push(newOrder)
  localStorage.setItem('orders', JSON.stringify(orders))
  return newOrder
}

export function getUserOrders(userId: string): Order[] {
  return getOrders().filter(order => order.userId === userId)
}

// Reviews helpers
export function getProductReviews(productId: string): Review[] {
  if (typeof window === 'undefined') return []
  const reviews = localStorage.getItem('reviews')
  const allReviews: Review[] = reviews ? JSON.parse(reviews) : []
  return allReviews.filter(r => r.productId === productId)
}

export function addReview(review: Omit<Review, 'id' | 'date'>): void {
  if (typeof window === 'undefined') return
  const reviews = localStorage.getItem('reviews')
  const allReviews: Review[] = reviews ? JSON.parse(reviews) : []
  allReviews.push({
    ...review,
    id: `REV${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  })
  localStorage.setItem('reviews', JSON.stringify(allReviews))
}
