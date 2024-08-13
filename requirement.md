# Event Booking System

## Project Overview
An Event Booking System designed as a microservices architecture to manage and automate the booking process for events like conferences, concerts, and workshops. The system allows users to browse events, book tickets, manage their bookings, and receive notifications.

## Microservices

### User Management Service
- **Responsibilities:** Handles user registration, authentication, and profile management.
- **Endpoints:**
    - POST /register
    - POST /login
    - GET /profile
    - PUT /profile

### Event Management Service
- **Responsibilities:** Manages event creation, updates, and deletions. Allows event organizers to list their events.
- **Endpoints:**
    - POST /events
    - GET /events
    - GET /events/{eventId}
    - PUT /events/{eventId}
    - DELETE /events/{eventId}

### Booking Service
- **Responsibilities:** Manages ticket booking, availability, and cancellations.
- **Endpoints:**
    - POST /bookings
    - GET /bookings
    - GET /bookings/{bookingId}
    - DELETE /bookings/{bookingId}

### Payment Service
- **Responsibilities:** Handles payment processing and refunds for bookings.
- **Endpoints:**
    - POST /payments
    - GET /payments/{paymentId}
    - POST /refunds

### Notification Service
- **Responsibilities:** Sends notifications to users for booking confirmations, reminders, and updates.
- **Endpoints:**
    - POST /notifications
    - GET /notifications/{userId}

### Review and Rating Service
- **Responsibilities:** Allows users to leave reviews and ratings for events they attended.
- **Endpoints:**
    - POST /reviews
    - GET /reviews/{eventId}
    - GET /reviews/user/{userId}

## Database Structure

- **User Management Service:** Users (userId, username, email, password, profileInfo)
- **Event Management Service:** Events (eventId, title, description, date, location, organizerId, availability)
- **Booking Service:** Bookings (bookingId, userId, eventId, status, bookingDate)
- **Payment Service:** Payments (paymentId, bookingId, userId, amount, status, paymentDate)
- **Notification Service:** Notifications (notificationId, userId, message, date)
- **Review and Rating Service:** Reviews (reviewId, userId, eventId, rating, comment, date)

## Inter-service Communication

- **Synchronous Communication:** HTTP/REST for real-time requests (e.g., booking a ticket).
- **Asynchronous Communication:** Message queues (e.g., RabbitMQ or Kafka) for notifications and updates.

## Technology Stack

- **Backend:** Django or Node.js/Express for each microservice.
- **Database:** PostgreSQL for relational data, Redis for caching.
- **Reverse Proxy:** Nginx for request routing and load balancing.
- **Authentication:** JWT for secure user authentication.
- **Message Broker:** RabbitMQ or Apache Kafka for event-driven communication.
- **Deployment:** Docker compose for container orchestration.
- **Monitoring:** Prometheus, loki and Grafana for monitoring and alerting.

## Scenarios and User Stories

### User Registration and Login
- As a user, I want to register an account, so I can use the event booking system.
- As a user, I want to log in to my account, so I can access my profile and bookings.

### Event Browsing and Booking
- As a user, I want to browse available events, so I can find ones I'm interested in.
- As a user, I want to book a ticket for an event, so I can attend it.

### Payment Processing
- As a user, I want to pay for my booking, so I can confirm my ticket.
- As a user, I want to receive a refund if I cancel my booking, so I can get my money back.

### Notifications
- As a user, I want to receive notifications about my bookings, so I stay informed.

### Review and Rating
- As a user, I want to leave a review for an event, so others can know my experience.
- As a user, I want to see reviews for an event, so I can decide whether to attend.

## Project Phases

### Phase 1: Basic Features
- Implement User Management, Event Management, and Booking Services.
- Set up the database and Nginx.
- Develop front-end for basic user interactions.

### Phase 2: Advanced Features
- Add Payment Service and Notification Service.
- Integrate message broker for asynchronous communication.
- Enhance security with JWT authentication.

### Phase 3: Optimization and Scaling
- Optimize services for performance.
- Implement caching with Redis.
- Deploy using Docker compose.
- Set up monitoring and logging.

### Phase 4: Review and Rating System
- Implement Review and Rating Service.
- Integrate reviews into the event detail page.
- Allow users to view and leave reviews.

This project idea covers a comprehensive set of features, modularized into microservices, allowing for scalability, maintainability, and independent development and deployment.
