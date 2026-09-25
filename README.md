# API Tester Frontend

A React-based web interface for the **API Tester** application.

The frontend provides a user-friendly interface for authenticating users, creating and executing API requests, viewing responses, managing environments, organizing requests into collections, and reviewing API execution history.

The frontend communicates with a **Spring Boot REST API backend**.

---

## 🚀 Features

### 🔐 Authentication

The application provides user authentication through the backend API.

Features include:

* User login
* JWT token handling
* Authentication state management
* Protected application routes
* Logout functionality

The authentication token is stored on the client side and included when communicating with protected backend endpoints.

---

### 📊 Dashboard

The dashboard provides access to the main features of the API testing application.

From the dashboard, users can access areas such as:

* API request execution
* Request history
* Collections
* Environments

---

### 🧪 API Request Execution

The frontend provides an interface for creating and executing HTTP API requests.

Supported HTTP methods include:

* GET
* POST
* PUT
* DELETE
* PATCH

Request configuration supports:

* Request URL
* Query parameters
* Headers
* Request body
* Authentication
* Environment selection

The configured request is sent to the Spring Boot backend, which performs the API execution and returns the response.

---

### 🔑 Authentication Options

The API request interface supports authentication options provided by the backend, including:

* No Authentication
* Bearer Token
* Basic Authentication
* API Key

Authentication information is sent to the backend as part of the API execution request.

---

### 🌍 Environments

The frontend allows users to work with reusable environments.

Environment variables can be used in API requests.

Example:

```text
{{baseUrl}}/users/{{userId}}
```

This allows values such as URLs, IDs, and other configuration values to be reused across requests.

---

### 📋 Request History

The frontend provides a history view for previously executed API requests.

History information can include:

* HTTP method
* Request URL
* Status code
* Response time
* Request details
* Response details

The history interface also provides filtering functionality to help users find requests.

---

### 📁 Collections

The frontend provides functionality for organizing API requests into collections.

A collection can contain multiple requests, making it easier to organize related APIs.

Collection items can be used to store individual API requests within a collection.

---

### 📥 Response Viewer

After an API request is executed, the frontend displays the response returned by the backend.

Response information can include:

* HTTP status
* Response headers
* Response body
* Response time
* Response size

This allows users to inspect the result of an API request directly from the application.

---

## 🛠️ Technology Stack

| Technology   | Purpose                           |
| ------------ | --------------------------------- |
| React        | Frontend UI                       |
| JavaScript   | Programming language              |
| Vite         | Development server and build tool |
| Tailwind CSS | Styling                           |
| React Router | Client-side routing               |
| Context API  | Authentication state management   |
| REST APIs    | Communication with backend        |

---

## 🏗️ Application Architecture

The frontend communicates with the Spring Boot backend using REST APIs.

```text
┌─────────────────────────┐
│      React Frontend     │
│                         │
│  Login                  │
│  Dashboard              │
│  API Request Builder    │
│  Response Viewer        │
│  History                │
│  Collections            │
│  Environments           │
└────────────┬────────────┘
             │
             │ HTTP / REST
             │
             ▼
┌─────────────────────────┐
│   Spring Boot Backend   │
│                         │
│  Authentication         │
│  API Execution          │
│  History                │
│  Collections            │
│  Environments           │
└────────────┬────────────┘
             │
             ▼
       ┌───────────┐
       │   MySQL   │
       └───────────┘
```

---

## 📁 Project Structure

The frontend is organized using React components, pages, context, and supporting files.

```text
api-tester-frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   └── Reusable UI components
│   │
│   ├── context/
│   │   └── Authentication context
│   │
│   ├── pages/
│   │   ├── Login
│   │   ├── Dashboard
│   │   ├── History
│   │   ├── Collections
│   │   └── Environments
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── index.html
```

---

## 🔐 Authentication Flow

The frontend uses JWT authentication provided by the Spring Boot backend.

The general authentication flow is:

```text
User
  ↓
Login Page
  ↓
Login Request
  ↓
Spring Boot Backend
  ↓
JWT Token
  ↓
Frontend Authentication Context
  ↓
Authenticated Application
```

For protected API requests:

```text
React Frontend
      ↓
JWT Token
      ↓
Spring Boot Security
      ↓
Authenticated Request
```

The authentication state is managed using React Context.

---

## 🔄 API Request Flow

When the user executes an API request:

```text
User
 ↓
Request Builder
 ↓
Select Method
 ↓
Enter URL
 ↓
Add Query Params / Headers / Body
 ↓
Select Authentication
 ↓
Select Environment
 ↓
Execute
 ↓
Spring Boot Backend
 ↓
External API
 ↓
Response
 ↓
Response Viewer
```

---

## 🌐 Backend Integration

The frontend communicates with the API Tester backend through REST endpoints.

Main backend API areas include:

```text
/api/auth
/api/environments
/api/api-execution
/api/history
/api/collections
/api/collection-items
```

The backend is responsible for:

* Authentication
* JWT validation
* API request execution
* Request validation
* Environment processing
* History storage
* Collection management
* Database operations

The frontend is responsible for providing the user interface and communicating with these backend APIs.

---

## ⚙️ Prerequisites

Before running the frontend, install:

* Node.js
* npm
* Git

Verify Node.js:

```bash
node -v
```

Verify npm:

```bash
npm -v
```

The Spring Boot backend should also be running for the frontend's API functionality to work correctly.

---

## ▶️ Running the Frontend Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd api-tester-frontend
```

---

### 2. Install Dependencies

Run:

```bash
npm install
```

---

### 3. Start the Development Server

Run:

```bash
npm run dev
```

Vite will start the development server.

The frontend can then be opened using the URL shown in the terminal.

---

## 🏗️ Build for Production

Create a production build using:

```bash
npm run build
```

The generated production files are placed in the Vite build output directory.

---

## 👀 Preview Production Build

After creating the production build, it can be previewed locally using:

```bash
npm run preview
```

---

## 🎨 Styling

The application uses **Tailwind CSS** for styling.

Tailwind utility classes are used to build:

* Layouts
* Forms
* Buttons
* Navigation
* Request interfaces
* Response displays
* Tables
* Filters
* Responsive UI elements

---

## 🧭 Routing

The application uses React Router for client-side navigation.

Routes are used to navigate between areas such as:

```text
/login
/dashboard
/history
/collections
/environments
```

Protected routes require the user to be authenticated.

---

## 🧠 State Management

The application uses React's built-in state management features.

Important concepts used include:

* `useState`
* `useEffect`
* `useContext`
* React Context
* React Router hooks

Authentication state is managed through an authentication context.

This allows different parts of the application to access the current authentication state without passing authentication data through every component manually.

---

## 🔒 Protected Routes

Authenticated application pages are protected from unauthenticated access.

The application checks the authentication state before allowing access to protected routes.

If the user is not authenticated, they are redirected to the login page.

---

## 📱 Responsive Interface

The frontend uses Tailwind CSS utility classes to create a responsive interface that can adapt to different screen sizes.

---

## 🔗 Related Backend

The frontend depends on the API Tester Spring Boot backend.

The backend repository contains:

* REST APIs
* JWT authentication
* API execution
* MySQL persistence
* Environment management
* History management
* Collections
* Docker configuration
* Prometheus metrics

---

## 🎯 Project Goals

The main goals of the frontend are:

* Build a practical React application
* Learn React fundamentals
* Practice component-based UI development
* Work with REST APIs
* Implement JWT-based authentication
* Practice React Router
* Learn React Context
* Build reusable UI components
* Create an API request interface
* Display API responses
* Manage request history
* Work with collections and environments
* Integrate a React frontend with a Spring Boot backend

---

## 🗺️ Future Improvements

Possible future improvements include:

* Import/export API requests
* Improved request and response visualization
* Additional request configuration options
* More advanced collection management
* Additional UI improvements
* Improved error messages
* Additional frontend tests
* Production deployment
* Frontend containerization

---

## 👨‍💻 Author

**Naveena P.K.**

Software Developer

This project was created as a hands-on full-stack project to learn and demonstrate modern Java backend development, React frontend development, REST APIs, Spring Security, JWT authentication, testing, Docker, and application monitoring.
