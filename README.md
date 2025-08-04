# 🍔 BitMeal - Full-Stack Food Delivery Application

BitMeal is a full-stack web application built with a **microservices architecture**, designed to deliver an efficient food ordering and delivery experience for users, restaurant admins, and delivery personnel. With a modern React frontend and Node.js backend, BitMeal emphasizes scalability, modularity, and performance.

---

## 📝 Project Overview

BitMeal streamlines food ordering for customers while offering robust management tools for restaurants. The app is designed using a microservices pattern with services communicating through an **API Gateway**, ensuring separation of concerns, scalability, and easy maintenance.

---

## 🚀 Key Features & Functionalities

### 👤 User Management & Authentication
- 🔒 **Secure Registration & Login**: Register with name, phone, email & password. Email-based OTP verification for account activation.
- 🔐 **Role-Based Access**: All new users start as `customer`. `delivery_personnel` and `restaurant_admin` roles are assigned manually in the DB.
- 🧑‍💼 **Profile Management**: Edit personal details and upload profile pictures via a user-friendly interface.
- 🖥️ **Multi-Role Sessions**: Seamless multi-role login across different tabs using `sessionStorage`.

### 🍽️ Restaurant & Menu Management (Admin)
- 🏪 **Restaurant CRUD**: Admins can create, view, edit, and delete restaurants.
- 📋 **Menu Item Management**: Full control to manage dishes with images and categorized lists.
- 💰 **Flexible Pricing**: Menu items support different prices for `Normal` and `Full` portions.

### 🛒 Customer Experience
- 🔍 **Restaurant Discovery**: Browse all public restaurants, searchable by name, menu item, or category.
- 📂 **Interactive Menu**: Sticky sidebar navigation and modals for adding to cart, choosing size, and setting quantities.
- 🛍️ **Persistent Cart**: Cart state is stored using `React Context` + `sessionStorage` to survive page refreshes.
- 📍 **Order Placement**: Pin location on the map and enter address for order placement.
- 📜 **Order History**: View list of past orders with item details and real-time status.

### 🛵 Delivery & Order Status
- 👷 **Delivery Personnel Management**: Admin panel to add, edit, or delete delivery personnel with vehicle info.
- 📦 **Order Assignment**: Orders can be confirmed and assigned to drivers through an intuitive modal.
- 🚚 **Driver UI**: Separate layout for drivers to view assignments and toggle online/offline status.
- 📍 **Simulated Real-Time Location**: Driver location auto-updates every 10 seconds and is stored in the DeliveryService DB.

---

## 🛠️ Technologies Used

### 🎨 Frontend
- ⚛️ **React** (via Vite)
- 💨 **Tailwind CSS** for fast styling
- 🌐 **React Router DOM** for routing
- 🌍 **Leaflet** + **React-Leaflet** for interactive maps
- 🧠 **React Context API** for global state management

### 🧪 Backend
- 🟢 **Node.js** with **Express.js**
- 🍃 **MongoDB** + **Mongoose**
- 🔐 **JWT** for authentication
- 🔌 **Microservices**:
  - `APIGateway`
  - `AuthService`
  - `UserService`
  - `RestaurantService`
  - `OrderService`
  - `DeliveryService`

### 🔧 Tools
- 📨 `nodemailer` (OTP emails)
- 🖼️ `multer` (image uploads)
- 🌐 `axios` (inter-service communication)
- 🔁 `express-http-proxy` (API Gateway routing)

---

## 📂 Project Structure

```plaintext
BitMeal/
├── README.md
├── Frontend/                        # 🌐 React frontend
│   ├── src/
│   │   ├── components/              # 🧩 Reusable UI components
│   │   ├── context/                 # 🧠 Global states
│   │   ├── pages/                   # 📄 Page views for all roles
│   │   ├── App.jsx                  # Main app routing logic
│   │   └── main.jsx
│   ├── public/
│   ├── tailwind.config.js
│   └── vite.config.js
├── Services/                        # ⚙️ Backend microservices
│   ├── APIGateway/                  # Gateway for routing requests
│   ├── AuthService/                 # Auth logic + OTP + JWT
│   ├── UserService/                 # User profile & role management
│   ├── RestaurantService/           # Restaurant & menu management
│   ├── OrderService/                # Order placement & tracking
│   └── DeliveryService/             # Delivery personnel management
```


✅ Roles Breakdown
| Role                   | Access Level & Abilities                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| 🧍 Customer             | Browse restaurants, place orders, view order history                                     |
| 🧑‍🍳 Restaurant Admin | Manage restaurants, menus, and incoming orders                                           |
| 🛵 Delivery Person    | View assigned deliveries, update live location, toggle availability                      |
| 👑 System Admin       | (Dev-only) Assign roles, manage drivers, monitor system via MongoDB or future dashboards |

## ✅ Roles Breakdown

| Role               | Access Level & Abilities                                                                 |
|--------------------|-------------------------------------------------------------------------------------------|
| 🧍 **Customer**         | Browse restaurants, place orders, view order history                                      |
| 🧑‍🍳 **Restaurant Admin** | Manage restaurants, menus, and incoming orders                                            |
| 🛵 **Delivery Person**  | View assigned deliveries, update live location, toggle availability                       |
| 👑 **System Admin**     | (Dev-only) Assign roles, manage drivers, monitor system via MongoDB or future dashboards |

---

## 💡 Future Enhancements

- 📲 **Push Notifications** for real-time order updates  
- 📈 **Admin Analytics Dashboard** for system insights  
- 💬 **In-app Messaging** between customer ↔️ restaurant ↔️ delivery  
- 📱 **PWA or Mobile App version** (React Native)  
- 🧪 **Unit + Integration Testing** using Jest, React Testing Library  

---

## 🙌 Contributing

Contributions, issues, and suggestions are welcome!  
Feel free to open a **Pull Request** or reach out if you'd like to improve **BitMeal**. 🍽️

---

## 📬 Contact

Made with ❤️ by **Shanuka Induran**

- 🔗 [LinkedIn](https://www.linkedin.com/in/shanuka-induran)  
- 💻 [GitHub](https://github.com/Shanuka095)

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).



