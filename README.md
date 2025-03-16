# Finance Management System

The **Finance Management System** is a web application built with **ReactJS** and **Spring Boot** to help individuals and businesses manage their finances efficiently. It offers tools for budget management, expense tracking, and spending analysis — all in a user-friendly interface.

## 🚀 Features

- **Budget Management:** Create, edit, and track multiple budgets. Set spending limits and monitor expenses.
- **Expense Tracking:** Log daily expenses, categorize them, and maintain transaction records.
- **Spending Analysis:** Visualize spending patterns with interactive charts and graphs for actionable insights.

## 🛠️ Technologies Used

### Frontend
- **React.js:** Dynamic and responsive UI library.
- **Material-UI:** Modern UI components following Google’s Material Design.
- **Chart.js:** Flexible charting library for interactive visualizations.

### Backend
- **Spring Boot:** Production-ready framework for building scalable backend services.
- **MySQL:** Relational database for storing and managing application data.
- **RESTful APIs:** Seamless communication between frontend and backend.

## 📘 Documentation

- **Architectural Diagrams:** Visual overview of the system's structure.
- **Class Diagrams:** Representation of classes and their relationships.
- **Domain Models:** Entity models and interactions.
- **System Sequence Diagrams:** Flow of operations.
- **Use Cases:** Functional descriptions from an end-user perspective.

## 🎯 Motivation

This project is designed to simplify personal and business finance management by providing an all-in-one solution for tracking and analyzing finances.

## ⚙️ Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js and npm:** [Download here](https://nodejs.org/)
- **Java Development Kit (JDK) 17 or higher:** [Download here](https://www.oracle.com/java/technologies/javase-downloads.html)
- **VS Code:** [Download here](https://code.visualstudio.com/)
- **MySQL & MySQL Workbench:** [Download here](https://dev.mysql.com/downloads/workbench/)

## 🔧 Installation

### Clone the Repository

```bash
git clone https://github.com/banty-source/finance-management-system.git
```

### Backend Setup (Spring Boot)

1. **Navigate to the backend folder:**

```bash
cd SpringBoot
```

2. **Update Database Configurations:** Edit `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/[your-database-name]
spring.datasource.username=[your-username]
spring.datasource.password=[your-password]
```

3. **Run the Backend Application:**

```bash
mvn spring-boot:run
```

The backend will run on `http://localhost:9000`.

### Frontend Setup (React)

1. **Navigate to the frontend folder:**

```bash
cd frontend
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Start the Frontend Application:**

```bash
npm start
```

The frontend will run on `http://localhost:3000`.

## ⚡ Access the Application

- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:9000`

Ensure both servers are running for full functionality!


## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

Got ideas or issues? Open a discussion or issue — let’s improve this system together! 🚀
