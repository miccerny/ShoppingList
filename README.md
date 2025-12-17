- The current branch is "feature"

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


#### Adding Feature:
Add, update, delete photo or picture within items

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
```

## 📡 API Endpoints
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Log in user
GET	/api/me	Get current logged-in user
GET	/api/list	Get all lists for logged user
POST	/api/list	Create new list
PUT	/api/list/{id}	Update list
DELETE	/api/list/{id}	Delete list
GET	/api/list/{listId}/items	Get all items for a list
POST	/api/list/{listId}/items	Add item to a list
PUT	/api/list/{listId}/items/{id}	Update existing item
DELETE	/api/list/{listId}/items/{id}	Remove item


💾 ## Database Schema
users
 ├─ id (PK)
 ├─ email (unique)
 ├─ password

lists
 ├─ id (PK)
 ├─ name
 ├─ owner_id (FK → users.id)

items
 ├─ id (PK)
 ├─ name
 ├─ count
 ├─ tick
 ├─ list_id (FK → lists.id)

🧠 ## How to Run
# Backend
- mvn clean install
- mvn spring-boot:run

# Frontend
- npm install
- npm run dev


Default URLs:

Backend → http://localhost:8080

Frontend → http://localhost:5173


👤 Author

Michal Černý
Full-stack Java Developer in training
📍 Plzeň Region, Czechia
💼 [LinkedIn](https://www.linkedin.com/in/michal-%c4%8dern%c3%bd-b388b0128/)
