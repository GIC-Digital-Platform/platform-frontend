# Café Digital Platform - Frontend

React frontend for the Café Employee Manager.

## Tech Stack

- **Framework**: React 18 + Vite
- **Data Fetching**: TanStack Query v5
- **Table**: AG Grid Community
- **UI Components**: Ant Design 5
- **Styling**: Tailwind CSS
- **Date Handling**: Day.js
- **HTTP Client**: Axios
- **Routing**: React Router v6

## Pages

| Route                  | Description                        |
|------------------------|------------------------------------|
| `/cafes`               | List of cafes with location filter |
| `/cafes/new`           | Add new cafe form                  |
| `/cafes/edit/:id`      | Edit existing cafe form            |
| `/employees`           | List of employees                  |
| `/employees/new`       | Add new employee form              |
| `/employees/edit/:id`  | Edit existing employee form        |

## Prerequisites

- Node.js 22+
- Backend API running at `http://localhost:4000`

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
# Edit VITE_API_URL if your backend is not on port 4000
```

### 3. Start the dev server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Build for Production
```bash
npm run build
npm run preview  # preview the production build locally
```

## Docker

```bash
docker build -t cafe-frontend .
docker run -p 3000:80 cafe-frontend
```

Or use the full-stack docker-compose from this directory:
```bash
docker-compose up --build
```

## Key Features

- **AG Grid** tables with pagination (10 rows/page), sortable columns, text filters
- **TanStack Query** for server-state management with automatic cache invalidation
- **Unsaved changes warning** — navigating away from a dirty form shows a confirmation modal
- **Delete confirmation** — all deletes prompt the user before proceeding
- **Clickable employee counts** in the cafes table navigate to the filtered employees page
- **Logo upload** with 2MB size validation and image-type enforcement
- **SG phone validation** (starts with 8 or 9, exactly 8 digits)
- **Reusable `AppTextInput`** component used across all forms
