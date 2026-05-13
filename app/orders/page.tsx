'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getUserOrders, getCurrentUser } from '@/lib/store'
import { Order } from '@/lib/data'
import { Package, ArrowRight } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setOrders(getUserOrders(user.id).reverse())
  }, [router])

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

  if (!mounted) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
        <Link href="/products" aria-label="Browse products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(order.status)} px-2 py-1 rounded`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(order.date)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Items:</p>
                  <ul className="text-sm space-y-1">
                    {order.items.map((item) => (
                      <li key={item.product.id} className="flex justify-between">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>{formatCurrency(item.product.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address:</p>
                    <p className="text-sm">{order.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold">{formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link href={`/orders/${order.id}`} aria-label={`View details for order ${order.id}`}>
                    <Button variant="ghost" className="flex items-center gap-2">
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
