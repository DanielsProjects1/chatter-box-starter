$env:KEYCLOAK_ISSUER_URI="http://127.0.0.1:8080/realms/chatterbox"
$env:DATABASE_URL="jdbc:postgresql://127.0.0.1:5432/chatterbox"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="replace-me"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6379"
$env:GIPHY_API_KEY="replace-me"

.\mvnw spring-boot:run