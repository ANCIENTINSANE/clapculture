# CLAPCULTURE — Complete Website Page Structure

## 1. Customer / Public Website

### 1. `/`

**Homepage**

Sections:

* Announcement bar
* Header/navigation
* Cinematic hero
* Featured collections
* Shop by category
* New arrivals
* Trending products
* Limited drops
* Editorial/Tollywood culture section
* Promotional bento sections
* Instagram/social section
* Newsletter
* Footer

---

### 2. `/shop`

**All Products**

Features:

* Product grid
* Category filtering
* Price filtering
* Size filtering
* Search
* Sort by:

  * Newest
  * Popular
  * Price low → high
  * Price high → low
* Product badges
* Wishlist
* Quick view / quick add

---

### 3. `/collections`

**Collections**

Bento-style collection discovery.

Examples:

* New Drop
* Tollywood Collection
* T-Shirts
* Oversized Tees
* Hoodies
* Accessories
* Limited Edition
* Best Sellers

---

### 4. `/collections/[slug]`

**Collection Products**

Example:

`/collections/tollywood`

Contains:

* Collection hero
* Collection description
* Product grid
* Filters
* Sort
* Pagination/infinite scroll

---

### 5. `/category/[slug]`

**Category Page**

Examples:

* `/category/t-shirts`
* `/category/hoodies`
* `/category/accessories`
* `/category/caps`

Same product-discovery experience as collections.

---

### 6. `/product/[slug]`

**Product Details**

This is one of the most important pages.

Include:

* Large product gallery
* Product images
* Product name
* Price
* Discount/offer
* Available sizes
* Size guide
* Color variants if applicable
* Quantity
* Stock availability
* Add to Cart
* Buy Now
* Wishlist
* Product description
* Material details
* Fit information
* Shipping information
* Return information
* Related products

Mobile should have a sticky:

**ADD TO CART**

button.

---

### 7. `/search`

**Search Results**

Search:

> "black oversized t-shirt"

Show:

* Search input
* Suggested searches
* Results
* Filters
* Sorting
* Empty-state experience

---

### 8. `/cart`

**Shopping Cart**

Show:

* Product
* Image
* Size
* Quantity
* Price
* Remove
* Subtotal

Also:

**FREE SHIPPING PROGRESS**

Example:

> ₹350 more for free shipping

CTA:

**PROCEED TO CHECKOUT**

---

### 9. `/checkout`

**Customer Details**

Since you're not doing automated payment processing initially, keep checkout simple.

Fields:

### Customer

* Full name
* Mobile number
* Email

### Delivery Address

* Address
* Apartment/House
* City
* State
* Pincode

### Order Summary

* Products
* Sizes
* Quantities
* Subtotal
* Shipping
* Total

CTA:

**CONTINUE TO PAYMENT**

---

### 10. `/payment/[orderId]`

**Payment / UPI QR Page**

This is a critical custom page.

Show:

**ORDER #CLAP10245**

**TOTAL ₹1,398**

Then:

### Scan & Pay

Display the CLAPCULTURE UPI QR.

Also show:

**UPI ID: clapculture@upi**

Then:

### After Payment

Upload:

**Payment Screenshot**

and enter:

**Transaction ID / UTR**

Fields:

* Screenshot upload
* Transaction ID
* Optional payment name

CTA:

**SUBMIT PAYMENT**

Status:

> Payment verification pending.

---

### 11. `/order-success/[orderId]`

**Order Submitted**

Example:

> **ORDER RECEIVED.**

Your order has been successfully submitted.

**Order ID: #CLAP10245**

Payment status:

`VERIFICATION PENDING`

Show:

* Order summary
* Amount
* Customer email
* Delivery address
* Payment status

CTA:

**TRACK ORDER**

And:

**Continue Shopping**

---

### 12. `/track-order`

**Track Order**

Customer enters:

* Order ID
* Mobile number / email

Show status timeline:

```text
ORDER PLACED
      ↓
PAYMENT SUBMITTED
      ↓
PAYMENT VERIFIED
      ↓
ORDER CONFIRMED
      ↓
PACKED
      ↓
SHIPPED
      ↓
DELIVERED
```

---

### 13. `/order/[orderId]`

**Order Details / Tracking**

Show:

* Order ID
* Date
* Products
* Sizes
* Amount
* Payment status
* Order status
* Shipping details
* Tracking number if available

---

# 2. Brand / Information Pages

### 14. `/about`

**About CLAPCULTURE**

Editorial brand-story page.

---

### 15. `/contact`

**Contact Us**

Include:

* Contact form
* Email
* WhatsApp
* Social links
* FAQ link

---

### 16. `/faq`

**Frequently Asked Questions**

Categories:

* Orders
* Payments
* Shipping
* Returns
* Sizes
* Products

---

### 17. `/shipping`

**Shipping Policy**

---

### 18. `/returns`

**Returns & Refunds**

---

### 19. `/privacy`

**Privacy Policy**

---

### 20. `/terms`

**Terms & Conditions**

---

### 21. `/refund-policy`

**Refund Policy**

---

# 3. Authentication

For the customer side, I recommend **guest checkout** initially.

You don't need to force users to create accounts.

However, the architecture can support accounts later.

### Customer Auth

If enabled later:

* `/login`
* `/register`
* `/forgot-password`
* `/account`
* `/account/orders`
* `/account/profile`

For Phase 1, these can be skipped.

---

# 4. Admin Console

Create a completely separate admin application.

Use:

```text
/admin/login
```

The admin interface should NOT look like the customer website.

It should be a clean professional dashboard.

---

# 5. Admin Authentication

### 22. `/admin/login`

Admin login.

Fields:

* Email
* Password

Optional:

* Remember me
* Forgot password

After successful login:

`/admin/dashboard`

Protect every `/admin/*` route with authentication.

---

# 6. Admin Dashboard

### 23. `/admin/dashboard`

Main overview.

Cards:

```text
TOTAL ORDERS
₹ TOTAL SALES
PENDING PAYMENTS
CONFIRMED ORDERS
SHIPPED
DELIVERED
```

Charts:

* Orders over time
* Revenue
* Popular products
* Order status distribution

Quick actions:

* View pending payments
* Add product
* View new orders

---

# 7. Orders

### 24. `/admin/orders`

Main order management.

Table:

| Order     | Customer | Amount | Payment  | Status    | Date  | Action |
| --------- | -------- | ------ | -------- | --------- | ----- | ------ |
| #CLAP1024 | Rahul    | ₹1,398 | Pending  | Pending   | Today | View   |
| #CLAP1023 | Priya    | ₹699   | Verified | Confirmed | Today | View   |

Filters:

* All
* Payment Pending
* Payment Submitted
* Payment Verified
* Confirmed
* Processing
* Shipped
* Delivered
* Cancelled

Search:

* Order ID
* Name
* Phone
* Email

---

# 8. Order Details Admin

### 25. `/admin/orders/[orderId]`

This is probably the **most important admin page**.

Show:

## Customer

* Name
* Phone
* Email

## Delivery

* Full address
* City
* State
* Pincode

## Products

* Product
* Image
* Size
* Quantity
* Price

## Payment

* Amount
* Payment screenshot
* Transaction ID
* Payment date
* Payment status

Admin actions:

### VERIFY PAYMENT

### REJECT PAYMENT

### CONFIRM ORDER

### MARK AS PACKED

### MARK AS SHIPPED

### MARK AS DELIVERED

### CANCEL ORDER

---

# 9. WhatsApp Confirmation

Inside the order details page:

### CUSTOMER COMMUNICATION

Buttons:

**SEND WHATSAPP CONFIRMATION**

**SEND EMAIL CONFIRMATION**

When WhatsApp is clicked, open WhatsApp with a pre-filled message.

Example:

> Hi Rahul, your CLAPCULTURE order #CLAP10245 has been confirmed.
> Amount: ₹1,398
> Thank you for shopping with CLAPCULTURE.

The admin simply clicks **Send** in WhatsApp.

This avoids needing WhatsApp Business API initially.

---

# 10. Products

### 26. `/admin/products`

Product management.

Table:

* Product image
* Product name
* Category
* Price
* Stock
* Status
* Created date
* Actions

Actions:

* Edit
* Duplicate
* Delete
* Disable
* Preview

---

# 11. Add Product

### 27. `/admin/products/new`

Fields:

### Basic

* Product name
* Slug
* Description
* Category
* Collection

### Pricing

* Price
* Compare-at price
* Discount

### Inventory

* SKU
* Stock quantity
* Low-stock threshold

### Variants

* Size
* Color
* Variant-specific stock

### Media

* Main image
* Gallery images
* Product video

### Marketing

* New arrival
* Best seller
* Trending
* Limited drop

CTA:

**PUBLISH PRODUCT**

---

# 12. Edit Product

### 28. `/admin/products/[productId]/edit`

Same product form with:

* Update
* Delete
* Preview
* Inventory management

---

# 13. Categories

### 29. `/admin/categories`

Manage:

* T-Shirts
* Hoodies
* Accessories
* Caps
* Bags
* etc.

Actions:

* Create
* Edit
* Delete
* Reorder

---

# 14. Collections

### 30. `/admin/collections`

Manage collections:

* New Drop
* Tollywood Collection
* Limited Edition
* Summer Collection
* Best Sellers

Each collection can have:

* Name
* Description
* Hero image
* Products
* Display order
* Active/inactive

---

# 15. Homepage CMS

### 31. `/admin/homepage`

This is worth having because the homepage is highly visual.

Admin can manage:

### Hero

* Hero image/video
* Heading
* Subheading
* CTA
* Link

### Featured Collections

* Select collections

### New Arrivals

* Select products

### Limited Drop

* Image
* Product/collection
* CTA

### Promotional Bento

* Images
* Text
* Links

### Instagram/Culture section

* Images
* Links

This means the developer doesn't have to change code whenever the client wants to change homepage content.

---

# 16. Media Library

### 32. `/admin/media`

Upload/manage:

* Product images
* Hero images
* Videos
* Collection banners
* Promotional graphics

Features:

* Upload
* Preview
* Delete
* Copy URL
* Search

---

# 17. Customers

### 33. `/admin/customers`

Show customers generated from orders.

Columns:

* Name
* Phone
* Email
* Orders
* Total spent
* Last order

Customer detail:

* Order history
* Contact information
* Addresses

---

# 18. Inventory

### 34. `/admin/inventory`

Inventory overview.

Example:

```text
PRODUCT             SIZE     STOCK

Super Tee           S        12
Super Tee           M        04
Super Tee           L        00
Super Tee           XL       17
```

Highlight:

* In stock
* Low stock
* Out of stock

---

# 19. Discounts

### 35. `/admin/discounts`

Optional but useful.

Admin can create:

* Coupon code
* Percentage discount
* Flat discount
* Minimum order
* Expiry
* Usage limit

Example:

`CLAP20`

---

# 20. Settings

### 36. `/admin/settings`

Sections:

### Store

* Store name
* Logo
* Email
* Phone
* Address

### Payment

* UPI ID
* QR code
* Payment instructions

### Shipping

* Shipping fee
* Free shipping threshold

### Notifications

* Confirmation email
* Payment submitted email
* Order confirmed email

### Social

* Instagram
* YouTube
* WhatsApp

---

# 21. Admin Profile

### 37. `/admin/profile`

Admin:

* Name
* Email
* Password
* Profile settings

---

# 22. Admin Notifications

### 38. `/admin/notifications`

Examples:

> 🔔 New order #CLAP10245

> 💳 Payment screenshot submitted for #CLAP10245

> ⚠️ Product "Super Tee" is low on stock.

---

# 23. Admin Audit Log

### 39. `/admin/activity`

Track:

* Admin login
* Product created
* Product updated
* Payment verified
* Order status changed
* Product deleted
* Settings changed

Useful even if there's only one admin today.

---

# 24. Error / Utility Pages

Also create:

### 40. `/404`

Custom CLAPCULTURE 404 page.

Example:

> **404 — LOST IN THE CULTURE**

---

### 41. `/maintenance`

Optional maintenance page.

---

# Complete Page Count

## Customer-facing

**21 pages/routes**

```text
1.  Homepage
2.  Shop
3.  Collections
4.  Collection Details
5.  Category
6.  Product Details
7.  Search
8.  Cart
9.  Checkout
10. Payment
11. Order Success
12. Track Order
13. Order Details
14. About
15. Contact
16. FAQ
17. Shipping
18. Returns
19. Privacy
20. Terms
21. Refund Policy
```

## Admin

**18 pages/routes**

```text
22. Admin Login
23. Dashboard
24. Orders
25. Order Details
26. Products
27. Add Product
28. Edit Product
29. Categories
30. Collections
31. Homepage CMS
32. Media Library
33. Customers
34. Inventory
35. Discounts
36. Settings
37. Admin Profile
38. Notifications
39. Activity/Audit Log
```

## Utility

```text
40. 404
41. Maintenance
```

### **Total: ~41 routes/screens**

---

# Core Order Flow

This is what I'd specifically tell Antigravity to implement:

```text
CUSTOMER
   │
   ▼
Homepage
   │
   ▼
Browse Products
   │
   ▼
Product Details
   │
   ▼
Select Size + Quantity
   │
   ▼
Add to Cart
   │
   ▼
Checkout
   │
   ▼
Create Order
   │
   ▼
Generate Order ID
   │
   ▼
UPI QR Payment
   │
   ▼
Upload Payment Screenshot
   │
   ▼
Enter Transaction ID
   │
   ▼
Payment Submitted
   │
   ▼
ADMIN
   │
   ▼
Admin sees pending payment
   │
   ▼
Reviews Screenshot + Transaction ID
   │
   ├── Reject → Payment Failed
   │
   └── Verify
          │
          ▼
     Order Confirmed
          │
          ├── Email Confirmation
          │
          └── WhatsApp Pre-filled Message
                         │
                         ▼
                    Admin Sends
```

## Order Statuses

Keep these statuses separate:

### Payment Status

```text
PENDING
SUBMITTED
VERIFIED
REJECTED
```

### Order Status

```text
PLACED
CONFIRMED
PROCESSING
PACKED
SHIPPED
DELIVERED
CANCELLED
```

That separation will make the backend much cleaner.

---

# Important: Don't Overbuild Phase 1

For this particular CLAPCULTURE project, I **would not build** these initially:

* Customer loyalty system
* Reviews system
* Complex customer accounts
* Automated payment gateway reconciliation
* WhatsApp Business API
* Advanced recommendation engine
* Multi-vendor system
* Multi-admin RBAC
* Complex analytics
* AI chatbot

The initial product should be:

**Premium storefront + cart + simple checkout + QR payment + screenshot/UTR verification + admin order management + email/WhatsApp confirmation.**

That is enough to launch.

### Recommended technical structure

```text
CLAPCULTURE
│
├── Customer Web
│   ├── Homepage
│   ├── Shop
│   ├── Collections
│   ├── Products
│   ├── Cart
│   ├── Checkout
│   ├── Payment
│   └── Order Tracking
│
├── Admin Console
│   ├── Login
│   ├── Dashboard
│   ├── Orders
│   ├── Products
│   ├── Collections
│   ├── Homepage CMS
│   ├── Inventory
│   ├── Customers
│   └── Settings
│
└── Backend
    ├── Authentication
    ├── Products
    ├── Categories
    ├── Collections
    ├── Cart
    ├── Orders
    ├── Payments
    ├── File Storage
    ├── Email
    └── Notifications
```
