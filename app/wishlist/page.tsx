'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getWishlist, removeFromWishlist, addToCart } from '@/lib/store'
import { Product } from '@/lib/data'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setWishlist(getWishlist())

    const handleUpdate = () => setWishlist(getWishlist())
    window.addEventListener('wishlistUpdated', handleUpdate)
    return () => window.removeEventListener('wishlistUpdated', handleUpdate)
  }, [])

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId)
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast.success('Added to cart')
  }

  if (!mounted) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">Save items you love for later.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlist.length} items)</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <Card key={product.id} className="group">
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-muted rounded-t-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold hover:text-primary truncate">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              <p className="font-bold mb-3">₹{product.price.toLocaleString('en-IN')}</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
