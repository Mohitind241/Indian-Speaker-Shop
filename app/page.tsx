import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { products, brands } from '@/lib/data'
import { ProductCard } from '@/components/product-card'

export default function HomePage() {
  const featuredProducts = products.slice(0, 4)
  const bestSellers = products.filter(p => p.rating >= 4.3).slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4">New Arrivals</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Premium Sound for Every Moment
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-lg">
                Discover India&apos;s finest collection of speakers from top brands like JBL, Sony, boAt, and Zebronics. 
                Experience audio excellence at unbeatable prices.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products?category=Party+Speakers">
                  <Button size="lg" variant="outline">
                    Party Speakers
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-square max-w-md mx-auto">
              <Image
                src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"
                alt="Premium Speaker"
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">1 Year Warranty</p>
                <p className="text-xs text-muted-foreground">On all products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Headphones className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Dedicated help</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Shop by Brand</h2>
            <Link href="/products" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.filter(b => b !== 'All').map((brand) => (
              <Link key={brand} href={`/products?brand=${brand}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-center">
                    <span className="text-xl font-bold">{brand}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <div className="p-8 md:p-12 lg:p-16">
              <Badge variant="secondary" className="mb-4">Limited Offer</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-lg">
                Get 20% Off on Party Speakers
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                Make your parties unforgettable with our premium party speakers. 
                Use code PARTY20 at checkout.
              </p>
              <Link href="/products?category=Party+Speakers">
                <Button variant="secondary" size="lg">
                  Shop Party Speakers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Best Sellers</h2>
            <Link href="/products" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-muted/50">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get the latest updates on new products, exclusive offers, and audio tips.
              </p>
              <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md border bg-background"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
