### **Detailed Solution for Configuring Keycloak with SSL Using a Self-Signed Certificate for "localhost" to Work with Spring Boot**

### **Step 1: Generate a Self-Signed SSL Certificate for "localhost"**

1. **Generate a Private Key and a Self-Signed SSL Certificate:**

   Go to project folder `/src/main/docker` and use the command below to generate a private key and a self-signed certificate. This command creates a certificate valid for the domain "localhost" and adds "localhost" as a "Subject Alternative Name (SAN)":

   ```bash
   openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"
   ```

   - **`x509`**: Generates an X.509 certificate.
   - **`newkey rsa:2048`**: Creates a new 2048-bit RSA key.
   - **`nodes`**: Does not encrypt the private key.
   - **`keyout key.pem`**: Saves the private key in the file `key.pem`.
   - **`out cert.pem`**: Saves the certificate in the file `cert.pem`.
   - **`days 365`**: The certificate is valid for 365 days.
   - **`subj "/CN=localhost"`**: Sets "localhost" as the Common Name (CN).
   - **`addext "subjectAltName=DNS:localhost"`**: Adds "localhost" as a SAN in the certificate.

### **Step 2: Configure Keycloak to Use the SSL Certificate**

1. **Edit the Keycloak Configuration File (`keycloak.yml`):**

   Add or update the `keycloak.yml` file like the following configurations:

   ```yaml
   # This configuration is intended for development purpose, it's **your** responsibility to harden it for production
   services:
     keycloak:
       image: quay.io/keycloak/keycloak:25.0.5
       command: 'start-dev --import-realm'
       volumes:
         - ./keycloak-realm-config:/opt/keycloak/data/import
         - ./cert.pem:/etc/x509/https/tls.crt
         - ./key.pem:/etc/x509/https/tls.key
       environment:
         - KC_DB=dev-file
         - KEYCLOAK_ADMIN=admin
         - KEYCLOAK_ADMIN_PASSWORD=admin
         - KC_FEATURES=scripts
         - KC_HTTP_PORT=9080
         - KC_HTTPS_PORT=9443
         - KC_HTTPS_CERTIFICATE_FILE=/etc/x509/https/tls.crt
         - KC_HTTPS_CERTIFICATE_KEY_FILE=/etc/x509/https/tls.key
       # If you want to expose these ports outside your dev PC,
       # remove the "127.0.0.1:" prefix
       ports:
         - '127.0.0.1:9080:9080'
         - '127.0.0.1:9443:9443'
   ```

   - **`volumes`**: Mounts the `cert.pem` and `key.pem` files into the Docker container for Keycloak to use.
   - **`environment`**:
     - **`KC_HTTPS_CERTIFICATE_FILE`**: Specifies the path to the SSL certificate inside the container.
     - **`KC_HTTPS_CERTIFICATE_KEY_FILE`**: Specifies the path to the SSL private key inside the container.

2. **Restart Keycloak with the Updated Configurations:**

   If using `docker-compose`, run the following commands to restart Keycloak:

   ```bash
   docker compose -f src/main/docker/keycloak.yml down
   docker compose -f src/main/docker/keycloak.yml up -d
   ```

   This command tears down the existing container and recreates it with the new SSL certificate settings.

### **Step 3: Verify the Certificate in the Browser**

1. **Access Keycloak Using HTTPS:**
   - Open your browser and navigate to: `https://localhost:9443`
   - You should see Keycloak running over HTTPS. There might be a security warning due to the self-signed certificate. You can accept the risk to continue.

### **Step 4: Configure the JVM Truststore to Trust the Certificate**

1. **Add the Certificate to the JVM Truststore:**

   Use `keytool` to add the certificate to the JVM truststore (`which keytool` to find the full path and replace it in the command below):

   ```bash
   sudo keytool -importcert -alias localhost -file cert.pem -cacerts -storepass changeit -noprompt
   ```

   - **`importcert`**: Imports the certificate into the truststore.
   - **`alias localhost`**: Assigns the alias "localhost" to the certificate.
   - **`file cert.pem`**: Specifies the path to the certificate file.
   - **`cacerts`**: Uses the default JVM truststore.
   - **`storepass changeit`**: The default password for the JVM truststore.
   - **`noprompt`**: Skips the confirmation prompt.

2. **Restart the JVM or Application:**

   Restart any JVM-based application that needs to communicate with Keycloak to ensure it picks up the updated truststore.

### **Step 5: Configure the Spring Boot Application to Use HTTPS**

1. **Update the Application's `application.yml` File:**

   Configure your Spring Boot application to use Keycloak with HTTPS:

   ```yaml
   spring:
     security:
       oauth2:
         client:
           provider:
             oidc:
               issuer-uri: https://localhost:9443/realms/jhipster
           registration:
             oidc:
               client-id: web_app
               client-secret: web_app
               scope: openid,profile,email
   ```

   - **`issuer-uri`**: Specifies the issuer's URI as the HTTPS address of Keycloak.

### **Step 6: Test the Configuration**

1. **Test the Application and Keycloak Integration:**
   - Run your Spring Boot application and check if it successfully authenticates and authorizes with Keycloak using the configured SSL.
   - Review the logs to ensure there are no SSL-related errors.

### **Conclusion**

By following these steps, you have successfully configured Keycloak to use SSL with a self-signed certificate and correctly integrated your Spring Boot application to communicate with Keycloak over HTTPS. This setup enhances communication security and is suitable for local development and testing environments.
