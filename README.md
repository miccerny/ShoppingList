- The current branch is "main"

# 🧺 Shopping List App (Spring Boot + React)

Full-stack web application for managing shopping lists and items with user authentication, ownership protection, and image support.

The application supports both guest mode (local storage) and authenticated mode (server persistence).

The project is designed as a realistic showcase of a modern Java + React stack, including security, DTO mapping, and REST API design.

---

## 🌍 Live Demo (Production)
 ### The application is deployed and running in a production environment:
  - #### Frontend (Netlify):
    https://sholist.netlify.app
  - #### Backend (Render):
    Deployed as a Spring Boot REST API with session-based authentication
 ### The production setup reflects a real-world deployment:
 - Separate frontend and backend hosting
 - CORS configuration
 - Session handling via HTTP cookies
 - Cold-start behavior on free-tier backend hosting

## 🚀 Tech Stack

**Backend:**
- Java 17
- Spring Boot 3 (Web, Security, JPA)
- Spring Security (session-based authentication)
- PostgreSQL / MySQL
- MapStruct (Entity ↔ DTO)
- Lombok
- Maven

**Frontend:**
- React (Vite)
- React Router 7
- Bootstrap 5
- Custom `apiFetch` wrapper with centralized error handling
- `HttpRequestError` for HTTP-level errors
- LocalStorage fallback for guest mode

---

## ⚙️ Features

### 🔐 Authentication
- User registration and login via REST API
- Session-based authentication (Spring Security context)
- Duplicate email handling with custom exception
- Protected endpoints for authenticated users
- Ownership validation (users can access and modify only their own lists and items)
- Custom exceptions for authentication and authorization errors
- Duplicate email handling during registration

### 📝 Shopping Lists
- Create, edit, delete lists
- Load all lists belonging to the logged-in user
- Guest lists stored in LocalStorage
- Automatic import of guest lists after successful login

### 🛒 Items
- Add, update, delete items within lists
- Toggle items as completed (`tick`)
- Item quantity `count`
- Backend validation of item ownership via list owner
- Total item count per list

### 🖼️ Item Images
- Upload image for an item
- Update or remove an existing image
- Images stored on the server filesystem
- Image metadata stored in database
- Secure image access via REST endpoint
- Images are accessible only to the owning user
- Image URLs dynamically resolved in DTO layer

---

## 🧩 Architecture Overview

```text
backend/

 ├─ controller/         → REST endpoints (User, List, Items, Images)
 ├─ service/            → Business logic & ownership checks
 ├─ mapper/             → DTO ↔ Entity mapping (MapStruct)
 ├─ repository/         → JPA repositories
 ├─ entity/             → Database entities
 ├─ dto/                → Transfer objects for API communication
 ├─ security/           → Spring Security configuration
 └─ exception/          → Custom exceptions + global handler

frontend/
 ├─ components/         → UI components (forms, modals, lists)
 ├─ pages/              → Page-level React views (Lists, Items, Auth)
 ├─ services/           → apiFetch(), authentication helpers
 ├─ context/            → Auth and list context providers
 └─ styles/             → Bootstrap-based styling
```

## 📡 API Endpoints
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Log in user
POST /api/logout Log out user
GET	/api/me	Get current logged-in user
GET	/api/list	Get all lists for logged user
POST	/api/list	Create new list
PUT	/api/list/{id}	Update list
DELETE	/api/list/{id}	Delete list
GET	/api/list/{listId}/items	Get all items for a list
POST	/api/list/{listId}/items	Add item to a list
PUT	/api/list/{listId}/items/{id}	Update existing item and image
DELETE	/api/list/{listId}/items/{id}	Remove item
GET /api/imagesP{imageId} Load item image
DELETE /api/images/{imageId} Delete item image


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
 
images
 ├─ id (PK)
 ├─ stored_name
 ├─ original_name
 ├─ content_type
 ├─ item_id (FK → items.id)

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
