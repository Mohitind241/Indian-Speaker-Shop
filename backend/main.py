from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import json

# Initialize FastAPI app
app = FastAPI(
    title="SoundBazaar API",
    description="Indian Speaker Shop Backend API",
    version="1.0.0"
)

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security configuration
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# ============== In-Memory Database ==============
# In production, replace with actual database (PostgreSQL, MongoDB, etc.)

users_db = {
    "admin@speakershop.com": {
        "id": "1",
        "email": "admin@speakershop.com",
        "name": "Admin User",
        "password": pwd_context.hash("admin123"),
        "role": "admin",
        "phone": "9876543210",
        "address": "Mumbai, Maharashtra"
    },
    "user@test.com": {
        "id": "2",
        "email": "user@test.com",
        "name": "Test User",
        "password": pwd_context.hash("user123"),
        "role": "user",
        "phone": "9876543211",
        "address": "Delhi, India"
    }
}

products_db = [
    {
        "id": "1",
        "name": "JBL Flip 6",
        "brand": "JBL",
        "category": "Bluetooth Speaker",
        "price": 12999,
        "originalPrice": 14999,
        "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        "rating": 4.5,
        "reviews": 1250,
        "description": "Portable Bluetooth speaker with powerful sound and IP67 waterproof rating.",
        "features": ["IP67 Waterproof", "12 Hours Playtime", "PartyBoost", "USB-C Charging"],
        "inStock": True
    },
    {
        "id": "2",
        "name": "Sony SRS-XB43",
        "brand": "Sony",
        "category": "Bluetooth Speaker",
        "price": 16990,
        "originalPrice": 18990,
        "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400",
        "rating": 4.6,
        "reviews": 890,
        "description": "Extra bass wireless speaker with 24 hours battery life.",
        "features": ["Extra Bass", "24 Hours Battery", "IP67 Rating", "Party Connect"],
        "inStock": True
    },
    {
        "id": "3",
        "name": "boAt Stone 1400",
        "brand": "boAt",
        "category": "Bluetooth Speaker",
        "price": 3999,
        "originalPrice": 5999,
        "image": "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400",
        "rating": 4.2,
        "reviews": 3450,
        "description": "30W HD sound with RGB LEDs and TWS feature.",
        "features": ["30W Output", "RGB LEDs", "TWS Feature", "IPX5 Rating"],
        "inStock": True
    },
    {
        "id": "4",
        "name": "Zebronics Zeb-Monster",
        "brand": "Zebronics",
        "category": "Party Speaker",
        "price": 2999,
        "originalPrice": 3999,
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        "rating": 4.0,
        "reviews": 2100,
        "description": "Party speaker with wireless mic and LED lights.",
        "features": ["Wireless Mic", "LED Lights", "FM Radio", "USB/SD Support"],
        "inStock": True
    },
    {
        "id": "5",
        "name": "JBL Bar 5.1",
        "brand": "JBL",
        "category": "Soundbar",
        "price": 49990,
        "originalPrice": 59990,
        "image": "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400",
        "rating": 4.7,
        "reviews": 560,
        "description": "5.1 channel soundbar with wireless subwoofer and surround speakers.",
        "features": ["550W Output", "Wireless Subwoofer", "Detachable Speakers", "4K Pass-through"],
        "inStock": True
    },
    {
        "id": "6",
        "name": "Sony HT-S40R",
        "brand": "Sony",
        "category": "Home Theater",
        "price": 29990,
        "originalPrice": 34990,
        "image": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
        "rating": 4.5,
        "reviews": 780,
        "description": "5.1ch home theater system with wireless rear speakers.",
        "features": ["600W Output", "Wireless Rear Speakers", "Bluetooth", "USB Input"],
        "inStock": True
    },
    {
        "id": "7",
        "name": "boAt Aavante Bar 1190",
        "brand": "boAt",
        "category": "Soundbar",
        "price": 8999,
        "originalPrice": 11999,
        "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400",
        "rating": 4.3,
        "reviews": 1890,
        "description": "2.2 channel soundbar with dual subwoofers.",
        "features": ["100W Output", "Dual Subwoofers", "Bluetooth 5.0", "Multiple Modes"],
        "inStock": True
    },
    {
        "id": "8",
        "name": "JBL PartyBox 310",
        "brand": "JBL",
        "category": "Party Speaker",
        "price": 39999,
        "originalPrice": 44999,
        "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        "rating": 4.8,
        "reviews": 450,
        "description": "Powerful party speaker with dynamic light show.",
        "features": ["240W Output", "18 Hours Playtime", "IPX4 Splash Proof", "Guitar Input"],
        "inStock": True
    }
]

carts_db = {}  # user_email -> [cart_items]
orders_db = {}  # user_email -> [orders]
wishlists_db = {}  # user_email -> [product_ids]
reviews_db = {}  # product_id -> [reviews]

# ============== Pydantic Models ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class CartItem(BaseModel):
    product_id: str
    quantity: int

class OrderCreate(BaseModel):
    items: list[CartItem]
    shipping_address: str
    phone: str
    payment_method: str = "COD"

class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    comment: str

# ============== Helper Functions ==============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = users_db.get(email)
    if user is None:
        raise credentials_exception
    return user

# ============== API Routes ==============

# Health check
@app.get("/")
def root():
    return {"message": "SoundBazaar API is running", "version": "1.0.0"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# ============== Auth Routes ==============

@app.post("/api/auth/signup", response_model=Token)
def signup(user: UserCreate):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(len(users_db) + 1)
    users_db[user.email] = {
        "id": user_id,
        "email": user.email,
        "name": user.name,
        "password": get_password_hash(user.password),
        "role": "user",
        "phone": user.phone,
        "address": ""
    }
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    user_data = users_db[user.email]
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user_data["id"],
            email=user_data["email"],
            name=user_data["name"],
            role=user_data["role"],
            phone=user_data.get("phone"),
            address=user_data.get("address")
        )
    }

@app.post("/api/auth/login", response_model=Token)
def login(user: UserLogin):
    db_user = users_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=db_user["id"],
            email=db_user["email"],
            name=db_user["name"],
            role=db_user["role"],
            phone=db_user.get("phone"),
            address=db_user.get("address")
        )
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        name=current_user["name"],
        role=current_user["role"],
        phone=current_user.get("phone"),
        address=current_user.get("address")
    )

# ============== Products Routes ==============

@app.get("/api/products")
def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    search: Optional[str] = None
):
    filtered = products_db.copy()
    
    if category:
        filtered = [p for p in filtered if p["category"].lower() == category.lower()]
    if brand:
        filtered = [p for p in filtered if p["brand"].lower() == brand.lower()]
    if min_price:
        filtered = [p for p in filtered if p["price"] >= min_price]
    if max_price:
        filtered = [p for p in filtered if p["price"] <= max_price]
    if search:
        search_lower = search.lower()
        filtered = [p for p in filtered if search_lower in p["name"].lower() or search_lower in p["brand"].lower()]
    
    return {"products": filtered, "total": len(filtered)}

@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    product = next((p for p in products_db if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_reviews = reviews_db.get(product_id, [])
    return {**product, "product_reviews": product_reviews}

@app.get("/api/products/featured")
def get_featured_products():
    # Return top 4 products by rating
    featured = sorted(products_db, key=lambda x: x["rating"], reverse=True)[:4]
    return {"products": featured}

# ============== Cart Routes ==============

@app.get("/api/cart")
def get_cart(current_user: dict = Depends(get_current_user)):
    cart_items = carts_db.get(current_user["email"], [])
    
    # Enrich with product details
    enriched = []
    total = 0
    for item in cart_items:
        product = next((p for p in products_db if p["id"] == item["product_id"]), None)
        if product:
            enriched.append({**product, "quantity": item["quantity"]})
            total += product["price"] * item["quantity"]
    
    return {"items": enriched, "total": total}

@app.post("/api/cart/add")
def add_to_cart(item: CartItem, current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    if email not in carts_db:
        carts_db[email] = []
    
    # Check if product exists
    existing = next((i for i in carts_db[email] if i["product_id"] == item.product_id), None)
    if existing:
        existing["quantity"] += item.quantity
    else:
        carts_db[email].append({"product_id": item.product_id, "quantity": item.quantity})
    
    return {"message": "Added to cart", "cart": carts_db[email]}

@app.put("/api/cart/update")
def update_cart(item: CartItem, current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    if email not in carts_db:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    existing = next((i for i in carts_db[email] if i["product_id"] == item.product_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Item not in cart")
    
    if item.quantity <= 0:
        carts_db[email] = [i for i in carts_db[email] if i["product_id"] != item.product_id]
    else:
        existing["quantity"] = item.quantity
    
    return {"message": "Cart updated", "cart": carts_db[email]}

@app.delete("/api/cart/{product_id}")
def remove_from_cart(product_id: str, current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    if email in carts_db:
        carts_db[email] = [i for i in carts_db[email] if i["product_id"] != product_id]
    return {"message": "Removed from cart"}

@app.delete("/api/cart")
def clear_cart(current_user: dict = Depends(get_current_user)):
    carts_db[current_user["email"]] = []
    return {"message": "Cart cleared"}

# ============== Wishlist Routes ==============

@app.get("/api/wishlist")
def get_wishlist(current_user: dict = Depends(get_current_user)):
    product_ids = wishlists_db.get(current_user["email"], [])
    products = [p for p in products_db if p["id"] in product_ids]
    return {"items": products}

@app.post("/api/wishlist/{product_id}")
def add_to_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    if email not in wishlists_db:
        wishlists_db[email] = []
    
    if product_id not in wishlists_db[email]:
        wishlists_db[email].append(product_id)
    
    return {"message": "Added to wishlist"}

@app.delete("/api/wishlist/{product_id}")
def remove_from_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    if email in wishlists_db:
        wishlists_db[email] = [id for id in wishlists_db[email] if id != product_id]
    return {"message": "Removed from wishlist"}

# ============== Orders Routes ==============

@app.get("/api/orders")
def get_orders(current_user: dict = Depends(get_current_user)):
    user_orders = orders_db.get(current_user["email"], [])
    return {"orders": user_orders}

@app.post("/api/orders")
def create_order(order: OrderCreate, current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    
    # Calculate total
    total = 0
    order_items = []
    for item in order.items:
        product = next((p for p in products_db if p["id"] == item.product_id), None)
        if product:
            order_items.append({
                "product": product,
                "quantity": item.quantity,
                "subtotal": product["price"] * item.quantity
            })
            total += product["price"] * item.quantity
    
    new_order = {
        "id": f"ORD{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "items": order_items,
        "total": total,
        "shipping_address": order.shipping_address,
        "phone": order.phone,
        "payment_method": order.payment_method,
        "status": "confirmed",
        "created_at": datetime.now().isoformat()
    }
    
    if email not in orders_db:
        orders_db[email] = []
    orders_db[email].append(new_order)
    
    # Clear cart after order
    carts_db[email] = []
    
    return {"message": "Order placed successfully", "order": new_order}

@app.get("/api/orders/{order_id}")
def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    user_orders = orders_db.get(current_user["email"], [])
    order = next((o for o in user_orders if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ============== Reviews Routes ==============

@app.get("/api/reviews/{product_id}")
def get_reviews(product_id: str):
    return {"reviews": reviews_db.get(product_id, [])}

@app.post("/api/reviews")
def create_review(review: ReviewCreate, current_user: dict = Depends(get_current_user)):
    if review.product_id not in reviews_db:
        reviews_db[review.product_id] = []
    
    new_review = {
        "id": str(len(reviews_db[review.product_id]) + 1),
        "user_name": current_user["name"],
        "rating": review.rating,
        "comment": review.comment,
        "created_at": datetime.now().isoformat()
    }
    
    reviews_db[review.product_id].append(new_review)
    return {"message": "Review added", "review": new_review}

# ============== Admin Routes ==============

@app.get("/api/admin/stats")
def get_admin_stats(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_orders = sum(len(orders) for orders in orders_db.values())
    total_revenue = sum(
        order["total"] 
        for orders in orders_db.values() 
        for order in orders
    )
    
    return {
        "total_products": len(products_db),
        "total_users": len(users_db),
        "total_orders": total_orders,
        "total_revenue": total_revenue
    }

@app.get("/api/admin/orders")
def get_all_orders(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    all_orders = []
    for email, orders in orders_db.items():
        for order in orders:
            all_orders.append({**order, "user_email": email})
    
    return {"orders": all_orders}

@app.get("/api/admin/users")
def get_all_users(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = [
        {"id": u["id"], "email": u["email"], "name": u["name"], "role": u["role"]}
        for u in users_db.values()
    ]
    return {"users": users}

# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
