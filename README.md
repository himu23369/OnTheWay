# OnTheWay Logistics Platform

This platform manages logistics operations efficiently, handling high traffic and scaling to meet global demand.

## Project Structure
- **user-frontend**: User interface for booking and tracking deliveries.
- **admin-frontend**: Admin panel for managing operations and drivers.
- **associate-frontend**: Frontend for delivery associates to manage deliveries.
- **backend**: API handling core platform logic and data management.

## How to Run

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd Sockets
   ```

2. **Install Dependencies:**
   Navigate into each folder and install the dependencies:

 - For Frontend: 
   ```bash
   cd user-frontend
   npm install
   ```
   Do this for `admin-frontend` and `associate-frontend`.
   
 - For Backend Service: 
   ```bash
   cd backend
   npm install
   ```

3. **Setup the Environment Variables**
   For secure and flexible configuration, the backend requires a .env file. You must create this file in the backend directory and include the following environment variables:
   ```bash
   # MongoDB connection string
   MONGO_CONNECTION_STRING=mongodb://<your-mongo-db-uri>

   # Secret key for JWT or other encryption needs
   SECRET_KEY=your_secret_key

   # Port for backend service
   PORT=5050
   ```
   
4. **Run the Project:**
   To run each service:
   ```bash
   npm run dev
   ```
   Do this for `user-frontend`, `admin-frontend`, `backend`, and `associate-frontend`.

## Architecture Overview
- **Microservices**: Independent modules for user, driver, booking, and tracking.
- **MongoDB**: Stores user, driver, and booking data.
- **Redis**: Caching layer for frequently accessed data (e.g., real-time GPS).
- **WebSockets**: Real-time updates between users and drivers.
- **Kafka**: Manages high-frequency events like job assignments.

## Scalability
- **Kubernetes**: Horizontal scaling for handling 10,000 requests per second.
- **Load Balancing**: AWS ELB and NGINX for traffic distribution.
- **Real-Time Data Handling**: Geospatial indexing and caching for fast responses.

---

Designed to handle large-scale logistics efficiently with modularity and scalability in mind.
