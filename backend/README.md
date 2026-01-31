# Travel Destination Planner Backend

This is the backend service for the Travel Destination Planner application, built using Spring Boot.  
It provides REST APIs for authentication, destination management, and user interactions.

---

## Tech Stack

- Java 21
- Spring Boot 3
- Spring Security (JWT Authentication)
- Spring Data JPA
- REST Countries External API
- MySQL (configurable)
- Maven

---

## Architecture Overview

The backend follows a layered architecture:

- **Controller Layer**: REST APIs
- **Service Layer**: Business logic
- **Repository Layer**: Database access
- **Security Layer**: JWT-based authentication & authorization
- **DTO & Mapper Layer**: Clean request/response handling
- **Global Exception Handling**

---

## Security & Authentication

- JWT-based stateless authentication
- Role-based authorization (ADMIN / USER)
- Passwords encrypted using BCrypt
- CORS enabled for Angular frontend (`http://localhost:4200`)

### Public Endpoints
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh


### Secured Endpoints
- `/api/admin/**` → ADMIN only
- `/api/user/**` → USER / ADMIN

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|------|---------|------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT token |
| POST | /api/auth/refresh | Refresh access token |

---

### Admin – Destinations Management
| Method | Endpoint | Description |
|------|---------|------------|
| GET | /api/admin/destinations/suggestions?name= | Fetch country suggestions from REST Countries API |
| POST | /api/admin/destinations | Add destination to internal DB |
| DELETE | /api/admin/destinations?countryName= | Delete destination |

---

### User – Destinations
| Method | Endpoint | Description |
|------|---------|------------|
| GET | /api/user/destinations | List approved destinations (pagination + search) |

Query Params:
page (default = 0)
size (default = 10)
search (optional)


---

### Want To Visit Feature
| Method | Endpoint | Description |
|------|---------|------------|
| POST | /api/user/want-to-visit/{destinationId} | Mark destination as "Want to Visit" |
| DELETE | /api/user/want-to-visit/{destinationId} | Remove destination |
| GET | /api/user/want-to-visit | Get user's list |

---

## External API Integration

- Uses **REST Countries API** to fetch country suggestions
- Data is mapped and filtered before saving to internal database

---

## Error Handling

- Centralized exception handling using `@ControllerAdvice`
- Custom exceptions:
    - ResourceNotFoundException
    - DuplicateResourceException
    - ExternalApiException
    - BusinessException

---

## How to Run the Application

1. Clone the repository
2. Navigate to backend directory
   cd backend

3. Build and run
   mvn spring-boot:run

4. Backend will start on
   http://localhost:8080

---

## Author

Samir Ahmed  
Associate Software Engineer Candidate