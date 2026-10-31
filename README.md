# Zosh Trade — Crypto Trading & Portfolio Platform

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Vite](https://img.shields.io/badge/Vite-7.0.2-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-9.3-orange.svg)](https://www.mysql.com/)

A modern, full-stack cryptocurrency trading and portfolio management application. **Zosh Trade** combines real-time crypto asset tracking, live market price charts, order execution (Buy/Sell), wallet balance management, user-to-user transfers, and two-factor authentication security into an intuitive, high-performance web experience.

---

## Features

- **Live Market Feeds**: Top 50 cryptocurrency rankings, price fluctuation analysis, and search powered by the CoinGecko API.
- **Interactive Price Charts**: Candlestick and line price charts via ApexCharts with multi-period filters (1D, 1W, 1M, 1Y).
- **Trading & Order Management**: Buy and sell cryptocurrencies with instant wallet balance settlement and portfolio holding tracking.
- **Wallet & P2P Transfers**: Multi-currency wallet balance, deposit via Stripe / Razorpay gateways, and peer-to-peer wallet transfers.
- **Watchlist & Bookmarks**: Save favorite coins to your personal watchlist for fast access.
- **Robust Security**: Stateless JWT authentication, role-based authorization, and optional email-based Two-Factor Authentication (2FA).
- **AI Demo Assistant**: Embedded interactive floating chatbot assistant widget.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4 + Radix UI Primitives + Lucide Icons
- **State Management**: Redux + Redux Thunk + React Redux
- **Data Visualizations**: ApexCharts (`react-apexcharts`)
- **HTTP Client**: Axios with automatic Bearer JWT interceptor

### Backend
- **Framework**: Spring Boot 3.5.3 (Java 17/21)
- **Security**: Spring Security 6 (Stateless JWT, BCrypt, 2FA OTP)
- **Data Persistence**: Spring Data JPA & Hibernate
- **Database**: MySQL 8+ / 9+
- **Integrations**: CoinGecko REST API, Stripe SDK, Razorpay SDK, JavaMail

---

## Project Structure

```text
java full stack/
├── backend/            # Spring Boot 3 Java application
│   ├── src/main/java/  # Controllers, Services, Models, Security & Config
│   ├── pom.xml         # Maven project dependencies
│   └── mvnw.cmd        # Maven wrapper for Windows
├── frontend/           # React 19 + Vite frontend application
│   ├── src/            # Components, Pages, Redux State, and Styles
│   ├── package.json    # Frontend dependencies and npm scripts
│   └── vite.config.js  # Vite build configuration
├── docs/               # Detailed documentation
│   ├── FSD.md          # Functional Specification Document
│   ├── project-structure.md # Complete component & directory guide
│   └── setup.md        # Step-by-step local setup guide
├── .vscode/            # Visual Studio Code launch & debug targets
├── .env.example        # Environment variable template
└── README.md           # This project guide
```

---

## Quick Start (Windows 11)

### 1. Prerequisites
- **JDK 17 or 21** (`java -version`)
- **Node.js 20+** & **npm** (`node -v; npm -v`)
- **MySQL 8.0+** running on `localhost:3306`

### 2. Database Initialization
Create the database in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS yt_trading;
```

### 3. Start the Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The backend server runs at `http://localhost:9229`.

### 4. Start the Frontend
In a new terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## Running Tests & Quality Checks

- **Backend Context & JPA Tests**:
  ```powershell
  cd backend
  .\mvnw.cmd test
  ```
- **Frontend Linting & Build**:
  ```powershell
  cd frontend
  npm run lint
  npm run build
  ```

---

## Documentation

For full details, refer to the documentation in the `/docs` folder:
- [Functional Specification Document (FSD)](docs/FSD.md)
- [Project Structure & Architecture Map](docs/project-structure.md)
- [Complete Setup & Troubleshooting Guide](docs/setup.md)
