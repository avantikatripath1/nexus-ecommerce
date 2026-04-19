# Hybrid Backend Documentation

## Why Node.js (Express) for Live Preview?
The AI Studio environment is optimized for a **Unified Full-Stack Runtime** based on Node.js. This allows us to:
1. Provide an **instant, interactive preview** in your browser.
2. Maintain a sub-second hot-reload cycle for both Frontend and Backend.
3. Keep the entire applet responsive without needing a full Java Virtual Machine (JVM) initialization on every code change.

## The "Real" Spring Boot Backend
While the preview runs on Node.js (which acts as a mock/simulator of your final API), I have implemented the **Complete Spring Boot 3 Source Code** in the `/backend-spring-boot` directory for your official project submission and local production use.

### Features Implemented in Spring Boot:
- **Maven Structure**: Ready to be opened in IntelliJ IDEA or VS Code.
- **REST APIs**: Mirrored logic for Products and Auth.
- **JPA & Hibernate**: Full MySQL integration schema.
- **Spring Security**: JWT-based protection (groundwork).

### How to use the Spring Boot backend locally:
1. Open the `/backend-spring-boot` folder in VS Code or IntelliJ.
2. Ensure you have **JDK 17+** and **MySQL** installed.
3. Update `src/main/resources/application.properties` with your MySQL credentials.
4. Run the application using `./mvnw spring-boot:run` (or the IDE play button).

The Frontend remains fully compatible with both backends by simply changing the `BASE_URL` in `src/services/api.ts`.
