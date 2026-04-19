# Use Java 17
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend-spring-boot /app

# Build app
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Run app
CMD ["java", "-jar", "target/*.jar"]