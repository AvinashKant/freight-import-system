# Freight import system
A Node.js backend API to upload .xlsx and .csv freight data, validate, store in PostgreSQL database, and retrieve data with pagination and error handling.

## Features

-   **Freight page**
    -   User can see previous uploaded CSV Data.
    -   User can upload CSV.
    -   User can map CSV column to database column.
    -   User can save CSV data into Database.
-   **APS**
    -   API to retrieve previous uploaded CSV Data
    -   API to save CSV data into Database

## Requirements

-   Node v20.19.0
-   PostgreSQL Data 17

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- pg-promise
- multer (for file uploads)
- exceljs (for .xlsx parsing)
- fast-csv (for .csv parsing)
- Joi (for data validation)
- Jest + Supertest (for testing)

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/freight-import-system.git
    cd freight-import-system
    ```

2.  **Create PostgreSQL Database:**

    ```bash
        CREATE TABLE freight_rates (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            origin_country VARCHAR(255),
            destination_country VARCHAR(255),
            container_type VARCHAR(255),
            carrier VARCHAR(255),
            freight_rate NUMERIC(10, 2),
            created_at timestamp DEFAULT 'now()',
        );
    ```

3.  **Environment Variables:**

    ```bash
    cp backend\.env.example .env
    cp frontend\.env.example .env
    update .env values with with PostgreSQL url and API endpoint frontend 
    ```

4.  **Install Dependencies:**

    ```bash
    npm install
    ```

5.  **Run:**

    ```bash
    npm run dev
    ```
6.  **Test Cases:**

    ```bash
    cd backend
    npm run test
    ```
    ```bash
    cd frontend
    npm run test
    ```

## API Reference

### 1. Get all data (paginated)

-   **Endpoint:** `GET /api/freight`
-   **Description:** Retrieves a paginated list of data.
-   **Parameters:**
    -   `page` (integer, required): The page number for pagination.
    -   `pageSize` (integer, optional): The number of data per page.
-   **Response:** JSON with paginated user data.

### 3. Save CSV

-   **Endpoint:** `POST /api/freight`
-   **Description:** Creates a new data.
-   **Parameters:**
    -   `origin_country` (string, required).
    -   `destination_country` (string, required).
    -   `container_type` (string, required).
    -   `carrier` (string, required).
    -   `freight_rate` (Number, required).
-   **Response:** success response.

# Note
- Check postman collection for details