# 🧺 Shopping List App (Spring Boot + React)

Full-stack web application for managing shopping lists and items.  
Users can register, log in, and manage multiple lists and items.  
The app supports **guest mode**, where users can create lists locally before registration.

---

## 🚀 Tech Stack

**Backend:**
- Java 17
- Spring Boot 3 (Web, Security, JPA)
- PostgreSQL / MySQL
- MapStruct (Entity ↔ DTO)
- Lombok
- Maven

**Frontend:**
- React (Vite)
- React Router 7
- Bootstrap 5
- Custom `apiFetch` and `HttpRequestError` wrappers for communication with the backend
- LocalStorage fallback for guest mode

---

## ⚙️ Features

### 🔐 Authentication
- User registration and login via REST API
- Session-based authentication (Spring Security context)
- Duplicate email handling with custom exception

### 📝 Shopping Lists
- Create, edit, delete lists
- Load all lists for logged-in user
- Import guest lists after successful login

### 🛒 Items
- Add, update, delete items within lists
- Toggle items as completed (`tick`)
- Count total items per list

---

## 🧩 Architecture Overview

```text
backend/
 ├─ controller/         → REST endpoints (User, List, Items)
 ├─ service/            → Business logic
 ├─ mapper/             → DTO ↔ Entity mapping (MapStruct)
 ├─ repository/         → JPA repositories
 ├─ entity/             → Database entities
 ├─ dto/                → Transfer objects for API communication
 └─ exception/          → Custom exceptions + global handler

frontend/
 ├─ components/         → UI components (forms, modals, lists)
 ├─ pages/              → Page-level React views
 ├─ services/           → apiFetch(), authentication helpers
 ├─ context/            → Auth and list context providers
 └─ styles/             → Bootstrap-based styling
