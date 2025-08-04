# 🍽️ BitMeal – Full-Stack Food Delivery Platform

Welcome to **BitMeal**, a full-stack food delivery web application built using a modern **microservices architecture**. This platform bridges the gap between hungry customers and local restaurants — offering a seamless experience to browse menus, place orders, and track deliveries in real-time. Built with scalability and modularity in mind, BitMeal separates concerns through dedicated services for authentication, restaurant and menu management, order processing, and delivery logistics.

---

## 🚀 Technologies Used

**Frontend**:  
- ⚛️ React  
- ⚡ Vite  
- 🎨 Tailwind CSS  

**Backend**:  
- 🛠️ Node.js + Express.js  

**Database**:  
- 🍃 MongoDB (via Mongoose)

**Architecture**:  
- 🔀 Microservices with API Gateway (using `express-http-proxy`)  

**Security**:  
- 🔐 JWT (JSON Web Tokens) – Role-based Access Control  

**Validation**:  
- ✅ Joi for data validation  

**File Uploads**:  
- 📁 Multer for handling image uploads  

**Mapping / Location Services**:  
- 🗺️ Leaflet + React-Leaflet  

---

## ✨ Key Features & Modules

### 👥 User Management & Authentication

- 📝 **User Registration**  
  Sign up with name, email, phone number (🇱🇰 SL format), and secure password.

- 📧 **OTP Verification**  
  Activate accounts via OTP sent to email.

- 🔐 **JWT Authentication**  
  Secure multi-role login support for:
  - Customer  
  - Restaurant Admin  
  - Delivery Personnel

- 🧠 **Multi-Role Sessions**  
  Prevent token conflicts across tabs via `sessionStorage`.

- 👤 **User Profiles**  
  View and edit profile details including name, contact, address & profile picture.

---

### 🍽️ Restaurant & Menu Management (for Admins)

- 🏢 **Restaurant CRUD**  
  Admins manage their own restaurant info & images.

- 📋 **Menu Management**  
  - Add/update/delete items  
  - Each item includes category, normal price, and extra price for full portion.

- 🧠 **Dynamic Categories**  
  Categories are selected from a predefined list and dynamically grouped in the UI.

---

### 🛍️ Customer Experience

- 🔍 **Browse Restaurants**  
  Customers can search and filter restaurants or specific menu items.

- 🧾 **Interactive Menu**  
  Menus are grouped by category with side navigation for fast access.

- 🛒 **Shopping Cart System**  
  Built with React Context + `sessionStorage` for persistence across refreshes.

- 📍 **Checkout with Map**  
  Select delivery location using an interactive map before placing an order.

---

### 📦 Order Management

- 📥 **Order Placement**  
  Orders are saved in the `OrderService` with details like items, total, and location.

- 🧾 **Order Dashboard (Admin)**  
  View & update order statuses: `pending`, `confirmed`, `preparing`, etc.

- 🕘 **Order History (Customer)**  
  Track all past and active orders with item breakdown and status.

---

### 🛵 Delivery Service Integration

- 👨‍🔧 **Delivery Personnel Management**  
  Admins can add/edit/delete delivery driver profiles with vehicle info.

- 🚚 **Order Assignment**  
  Assign orders to available delivery drivers; system updates driver and order statuses accordingly.

- 👷 **Dedicated Driver UI**  
  - Separate login and dashboard for delivery personnel.  
  - Toggle availability between `available` and `offline`.

- 🛰️ **Simulated Real-Time Tracking**  
  Driver dashboard periodically sends simulated location updates to backend — foundation for real-time delivery tracking.

---

## 📌 Project Highlights

- 🔄 Full Microservices-Based System  
- 🧩 Scalable and Modular Codebase  
- 🧪 Role-Safe JWT Authentication  
- 🗃️ Clean UI/UX with Tailwind & React  
- 🗺️ Interactive Maps for Real-World Delivery Flow  

---

## 📸 Screenshots / Demo (Coming Soon)

Stay tuned for deployment links, screenshots, and demo video! 🎥

---

## 📚 Future Improvements

- ✅ Real GPS integration for delivery tracking  
- 🔔 Push notifications for order updates  
- 📊 Admin dashboards with analytics  
- 📱 Mobile responsive PWA experience  

---

Feel free to ⭐ the repo and contribute if you like it!

> Made with ❤️ by [Shanuka](https://github.com/Shanuka095)
