FROM openjdk:17

WORKDIR /app

COPY backend-spring-boot /app

RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

CMD ["java", "-jar", "target/*.jar"]