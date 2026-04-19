FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy ONLY backend
COPY backend-spring-boot .

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build project
RUN mvn clean package -DskipTests

# Run correct jar (auto-detect)
CMD ["sh", "-c", "java -jar $(ls target/*.jar)"]