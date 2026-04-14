# BookProject

This project is a web application for book management, with an Angular frontend and a json-server backend.

## Prerequisites

- **Node.js** (version 12 or higher)
- **npm** (Node.js package manager)

## Installing Node.js

### Windows

1. Visit the official website: https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the instructions
4. To verify the installation, open Command Prompt and run:
   ```
   node --version
   npm --version
   ```

### Linux

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install nodejs npm
```

#### Fedora
```bash
sudo dnf install nodejs npm
```

#### Arch Linux
```bash
sudo pacman -S nodejs npm
```

To verify the installation:
```bash
node --version
npm --version
```

---

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bookProject
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Running the Project

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   npm start
   ```

The backend will be available at: **http://localhost:3000**

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and go to: **http://localhost:4200**

---

## Available Scripts

### Backend
- `npm start` - Starts the json-server

### Frontend
- `npm start` - Starts the development server (ng serve)
- `npm run build` - Builds the project for production
- `npm test` - Runs unit tests
- `npm run lint` - Runs code linting

---

## Project Structure

```
bookProject/
├── backend/          # Node.js server with json-server
│   ├── db.json       # API data
│   ├── server.js     # Server configuration
│   └── package.json  # Backend dependencies
│
└── frontend/         # Angular application
    ├── src/          # Source code
    └── package.json  # Frontend dependencies
```

---

## Notes

- The frontend consumes the backend API on port 3000
- Make sure to start the backend before the frontend
- The `db.json` file contains the initial application data