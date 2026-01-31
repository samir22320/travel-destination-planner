# Travel Destination Planner

Travel Destination Planner is a full-stack web application that allows admins to manage travel destinations and users to explore and save destinations they want to visit.

--- 

## Project Structure

travel-destination-planner
│
├── backend → Spring Boot application (REST APIs)
├── frontend → Angular application (UI)


---

## Tech Stack

### Backend
- Java 21
- Spring Boot 3
- Spring Security (JWT Authentication)
- Spring Data JPA
- REST Countries API
- Maven

### Frontend
- Angular 16+
- TypeScript
- Angular CLI
- HTML / CSS

---

## Features

### Admin Features
- Admin authentication
- Fetch country suggestions from an external travel API
- Add and remove destinations
- Approve destinations before exposing them to users

### User Features
- User authentication
- View approved destinations
- Search destinations
- Pagination on destination list
- Mark destinations as **Want to Visit**
- View personal want-to-visit list

---

## How to Run the Project

### 1️⃣ Backend

```bash
cd backend
mvn spring-boot:run
Backend will run on:

http://localhost:8080


### 2️⃣ Frontend
cd frontend
npm install
ng serve
Frontend will run on:

http://localhost:4200
Authentication & Security
JWT-based stateless authentication

Role-based access control (ADMIN / USER)

Secured REST APIs

CORS enabled for Angular frontend

External Integrations
REST Countries API is used to fetch country and destination suggestions dynamically.

Notes
Bulk add destinations feature was not implemented 

Backend and frontend are completely decoupled and communicate via REST APIs.

Author
Samir Ahmed
Associate Software Engineer Candidate
