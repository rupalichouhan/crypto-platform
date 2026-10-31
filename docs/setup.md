# Local Setup & Execution Guide — Zosh Trade (Windows 11)

This guide provides tested, step-by-step instructions to run **Zosh Trade** on Windows 11.

---

## 1. Prerequisites & Required Tools

Ensure the following tools are installed on your Windows 11 system:

| Tool | Recommended Version | Verification Command |
| :--- | :--- | :--- |
| **Java Development Kit (JDK)** | Java 17 or Java 21 (Temurin LTS recommended) | `java -version` |
| **Node.js & npm** | Node v20+ (Tested on v24.16.0), npm 10+ | `node -v; npm -v` |
| **MySQL Server** | MySQL 8.0+ or MySQL 9.3+ | `mysql --version` (or Windows Service `MySQL*`) |
| **Visual Studio Code** | Latest Release | `code -v` |
| **Git** | Latest Release | `git --version` |

> [!NOTE]
> Apache Maven is not required to be globally installed; the project includes the self-contained Maven Wrapper (`mvnw.cmd`).

---

## 2. Database Setup (MySQL)

1. Ensure the MySQL service is running:
   ```powershell
   Get-Service *mysql*
   ```
2. Open your MySQL client (Command Line, MySQL Workbench, or PowerShell):
   ```sql
   CREATE DATABASE IF NOT EXISTS yt_trading;
   ```
3. By default, the application connects to:
   - **Host**: `localhost:3306`
   - **Database**: `yt_trading`
   - **User**: `rupali` (or override via environment variable `SPRING_DATASOURCE_USERNAME`)
   - **Password**: `root` (or override via environment variable `SPRING_DATASOURCE_PASSWORD`)

If using the `root` MySQL user, either create a user `rupali` with password `root` or provide environment variables as explained below.

---

## 3. Environment Configuration

Copy the `.env.example` file to create a `.env` file if you wish to override default credentials:

```powershell
Copy-Item .env.example .env
```

To set environment variables in Windows 11 PowerShell for the current session:
```powershell
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your_actual_password"
```

---

## 4. Running the Backend (Spring Boot)

1. Open PowerShell and navigate to the `backend` directory:
   ```powershell
   cd "C:\Users\prade\OneDrive\Desktop\java full stack\backend"
   ```
2. Clean and compile the application:
   ```powershell
   .\mvnw.cmd clean test-compile
   ```
3. Run the backend application:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *The backend starts at `http://localhost:9229`.*

To verify the backend is active, open:
[http://localhost:9229/coins/top50](http://localhost:9229/coins/top50)

---

## 5. Running the Frontend (React + Vite)

1. Open a second PowerShell window and navigate to the `frontend` directory:
   ```powershell
   cd "C:\Users\prade\OneDrive\Desktop\java full stack\frontend"
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   *The frontend starts at `http://localhost:5173`.*

4. Open your browser and navigate to:
   [http://localhost:5173](http://localhost:5173)

---

## 6. Running Tests & Linting

### Frontend Verification
```powershell
cd "C:\Users\prade\OneDrive\Desktop\java full stack\frontend"
npm run lint    # Verifies ESLint rules
npm run build   # Validates production bundle creation
```

### Backend Verification
```powershell
cd "C:\Users\prade\OneDrive\Desktop\java full stack\backend"
.\mvnw.cmd test # Executes Spring Boot application context tests
```

---

## 7. Running from Visual Studio Code

1. Open the project root in VS Code:
   ```powershell
   cd "C:\Users\prade\OneDrive\Desktop\java full stack"
   code .
   ```
2. Press `Ctrl + Shift + D` (or open the **Run and Debug** view).
3. Select **"Spring Boot - TradingApplication"** and press `F5` to launch the backend in debug mode.
4. Launch the frontend in a terminal (`cd frontend; npm run dev`), then select **"Vite Frontend - Chrome"** in VS Code to attach the debugger.

---

## 8. Common Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `Access denied for user 'rupali'@'localhost'` | MySQL credentials in `application.properties` don't match your MySQL server. | Set `$env:SPRING_DATASOURCE_USERNAME="your_user"` and `$env:SPRING_DATASOURCE_PASSWORD="your_password"` in PowerShell before launching. |
| `Unknown database 'yt_trading'` | Database has not been created yet in MySQL. | Run `CREATE DATABASE yt_trading;` in your MySQL console. |
| `Port 9229 already in use` | A previous backend instance is still running. | Run `Get-Process -Id (Get-NetTCPConnection -LocalPort 9229).OwningProcess | Stop-Process -Force` |
| `Port 5173 already in use` | Vite picked port 5174. | Terminate previous node process or adjust frontend port. |
| CoinGecko HTTP 429 (Rate Limit) | CoinGecko public tier rate limit reached. | CoinGecko free tier allows ~10-30 calls/minute. Wait 60 seconds and refresh. |
