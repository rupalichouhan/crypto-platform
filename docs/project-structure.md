# Project Structure & Architecture Guide — Zosh Trade

This document outlines the organized, production-ready directory layout of **Zosh Trade**.

---

## 1. Top-Level Directory Layout

```text
java full stack/                                <- Project Root (Git Repository)
├── .github/                                    <- GitHub automation and workflow metadata
├── .vscode/                                    <- VS Code launch and development configurations
│   ├── launch.json                             <- Debug configurations for Spring Boot & Chrome
│   └── settings.json                           <- Workspace editor and dictionary settings
├── backend/                                    <- Spring Boot 3 Java Backend
├── frontend/                                   <- React 19 + Vite + Tailwind CSS Frontend
├── docs/                                       <- Architecture, FSD, and setup guides
│   ├── FSD.md                                  <- Functional Specification Document
│   ├── project-structure.md                    <- This directory map
│   └── setup.md                                <- Step-by-step Windows 11 installation guide
├── .env.example                                <- Environment variable reference template
├── .gitignore                                  <- Root Git exclusions for both Java and Node
└── README.md                                   <- Main project overview and quickstart
```

---

## 2. Backend (`/backend`)

The backend is built with Spring Boot 3.5.x and Java 17/21, utilizing Maven for dependency resolution and build automation.

```text
backend/
├── .mvn/                                       <- Maven Wrapper binaries and configuration
├── src/
│   ├── main/
│   │   ├── java/com/zosh/
│   │   │   ├── TradingApplication.java         <- Spring Boot Application main entry point
│   │   │   ├── config/                         <- Security, JWT filters, and CORS configs
│   │   │   │   ├── AppConfig.java              <- SecurityFilterChain, stateless sessions, CORS
│   │   │   │   ├── JwtConstant.java            <- JWT headers and secret keys
│   │   │   │   ├── JwtProvider.java            <- Token generation and claims extraction
│   │   │   │   └── JwtTokenValidation.java     <- OncePerRequestFilter for Bearer token validation
│   │   │   ├── controller/                     <- REST API Controllers
│   │   │   │   ├── AuthController.java         <- /auth/signup, /auth/signin, 2FA endpoints
│   │   │   │   ├── CoinController.java         <- /coins (CoinGecko REST proxy)
│   │   │   │   ├── OrderController.java        <- /api/orders (Buy, Sell, execution)
│   │   │   │   ├── PaymentController.java      <- /api/payment (Stripe & Razorpay orders)
│   │   │   │   ├── PaymentDetailsController.java<- /api/payment-details (Bank info)
│   │   │   │   ├── UserController.java         <- /api/users (Profile, reset password)
│   │   │   │   ├── WalletController.java       <- /api/wallet (Balance, deposit, transfer)
│   │   │   │   ├── WatchlistController.java    <- /api/watchlist (User saved coins)
│   │   │   │   ├── WithdrawalController.java   <- /api/withdrawal (Withdrawal requests)
│   │   │   │   └── AssetController.java        <- /api/asset (Portfolio holdings)
│   │   │   ├── domain/                         <- Enums for business status and types
│   │   │   ├── model/                          <- JPA Entities mapped to MySQL tables
│   │   │   ├── repository/                     <- Spring Data JPA Repositories
│   │   │   ├── request/ & response/            <- DTOs for client request/response bodies
│   │   │   ├── service/                        <- Business logic interfaces & implementations
│   │   │   └── utils/                          <- Helper utilities (e.g. OTP generation)
│   │   └── resources/
│   │       └── application.properties          <- Datasource, port, and gateway configuration
│   └── test/
│       └── java/com/zosh/                      <- Spring Boot context and integration tests
├── mvnw & mvnw.cmd                             <- Cross-platform Maven Wrappers
└── pom.xml                                     <- Maven project descriptor and dependencies
```

---

## 3. Frontend (`/frontend`)

The frontend is a single-page application built on React 19, Vite, and Tailwind CSS v4.

```text
frontend/
├── public/                                     <- Static public assets (Vite logo, etc.)
├── src/
│   ├── assets/                                 <- Icons, SVGs, and visual resources
│   ├── components/ui/                          <- Reusable UI design system (Radix + Tailwind)
│   │   ├── avatar.jsx, badge.jsx, button.jsx
│   │   ├── card.jsx, dialog.jsx, form.jsx
│   │   ├── input.jsx, label.jsx, pagination.jsx
│   │   ├── sheet.jsx, switch.jsx, table.jsx
│   │   └── radio-group.jsx
│   ├── config/
│   │   └── api.js                              <- Axios instance with automatic JWT interceptor
│   ├── lib/
│   │   └── utils.js                            <- Class merging utilities (`clsx`, `tailwind-merge`)
│   ├── page/                                   <- High-level views and screen containers
│   │   ├── Activity/                           <- User trade and transaction history
│   │   ├── Admin/                              <- Administrative controls
│   │   ├── Auth/                               <- Sign In, Sign Up, and Forgot Password views
│   │   ├── Home/                               <- Market dashboard, AssetTable, StockChart, Chatbot
│   │   ├── Navbar/                             <- Top header and responsive mobile Sidebar
│   │   ├── PaymentDetails/                     <- Bank account information entry form
│   │   ├── Portfolio/                          <- Held crypto assets and performance metrics
│   │   ├── Profile/                            <- Account information and 2FA settings
│   │   ├── Search/                             <- Crypto search interface
│   │   ├── StockDetails/                       <- Detailed chart, metrics, and Buy/Sell modal
│   │   ├── Wallet/                             <- Balance view, top-up modal, and transfer form
│   │   ├── Watchlist/                          <- User-bookmarked coin table
│   │   └── Withdrawal/                         <- Withdrawal history and payout request form
│   ├── State/                                  <- Redux Store, Action creators, and Reducers
│   │   ├── Asset/, Auth/, Coin/, Order/
│   │   ├── Wallet/, Watchlist/, Withdrawal/
│   │   └── Store.js                            <- Configured Redux root store with redux-thunk
│   ├── Utils/
│   │   └── existInWatchlist.js                 <- Helper to check coin presence in user's watchlist
│   ├── App.jsx                                 <- Route definitions and Auth gatekeeper
│   ├── index.css                               <- Tailwind CSS v4 styles and color variables
│   └── main.jsx                                <- React DOM entry point wrapping Redux Provider
├── index.html                                  <- Single Page Application HTML root
├── package.json                                <- Dependencies and build scripts
└── vite.config.js                              <- Vite build & Tailwind plugin config
```

---

## 4. Key Configuration Files

| File | Purpose |
| :--- | :--- |
| `backend/src/main/resources/application.properties` | Configures port `9229`, MySQL connection URL (`jdbc:mysql://localhost:3306/yt_trading`), and credential overrides. |
| `frontend/src/config/api.js` | Configures Axios baseURL (`http://localhost:9229`) and attaches the `Bearer <token>` on all requests. |
| `.vscode/launch.json` | Pre-configured debugging targets for both backend (`TradingApplication`) and frontend Chrome session. |
| `.env.example` | Template for environment variable overrides. |
| `.gitignore` | Project-wide Git ignore protecting build directories, dependencies, and local keys. |
