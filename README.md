# Café Employee Manager — Frontend

A React single-page application for managing café locations and their employees.

**Live Demo**: [Try It Out](`https://cafe-frontend-cwte.onrender.com/`)

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React + Vite |
| UI Components | Ant Design |
| Data Tables | AG Grid Community |
| Data Fetching | TanStack React Query |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| Date Handling | Day.js |

---

## Pages

- **Cafes** — list all cafes with search and location filter (by region or area)
- **Add / Edit Cafe** — create a new cafe or update an existing one
- **Employees** — list all employees with search
- **Add / Edit Employee** — create a new employee or update an existing one

---

## Local Setup

### Prerequisites
- Node.js 22+
- Backend API running locally (see backend README)

### 1. Clone and install dependencies
```bash
git clone <your-repo-url>
cd platform-frontend
npm install
```

### 2. Configure environment
Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:4000
```

### 3. Start the development server
```bash
npm run dev
```
App runs at `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Docker (Full Stack)

Runs frontend, backend, and PostgreSQL together:

```bash
cd platform-frontend
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:4000 |

To stop:
```bash
docker-compose down
```

To stop and wipe the database:
```bash
docker-compose down -v
```
