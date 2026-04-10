# CampusConnect Architecture

CampusConnect is a microservices-based web application.

## Services

- Auth Service → Port 3001
- Event Service → Port 3002
- Registration Service → Port 3003
- Frontend → Port 5173

## Flow

Frontend communicates with each backend service using REST APIs.
Each service is independently deployable.