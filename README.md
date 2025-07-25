# Flick Finder 🎬

A modern movie discovery web application built with React, TypeScript, and GraphQL. Browse, search, and discover movies with detailed information including cast, directors, ratings, and more.

## Features

- 🔍 **Search Movies**: Find movies by title with real-time search
- 🎭 **Browse by Genre**: Filter movies by different genres
- 📅 **Filter by Year**: Discover movies from specific years
- 📄 **Pagination**: Navigate through large movie collections efficiently
- 🎯 **Detailed Movie Info**: View comprehensive movie details including:
  - IMDb ratings
  - Release year and duration
  - Plot descriptions
  - Cast and directors
  - Movie posters
- 📱 **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

### Frontend
- **React 18** - Modern React with TypeScript
- **TypeScript** - Type-safe JavaScript
- **Apollo Client** - GraphQL client for efficient data fetching
- **Material-UI** - Beautiful React components
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **SCSS** - Enhanced CSS with variables and mixins

### Backend
- **Node.js** - JavaScript runtime
- **Apollo Server** - GraphQL server implementation
- **TypeScript** - Type-safe backend development
- **SQLite** - Lightweight database with better-sqlite3
- **GraphQL** - Query language for APIs

### Database
- **SQLite** - Local database with movie data
- **Python** - Data processing and database setup scripts

## Project Structure

```
flick-finder/
├── backend/                 # GraphQL API server
│   ├── index.ts            # Apollo Server setup and resolvers
│   ├── package.json        # Backend dependencies
│   ├── termproject.db      # SQLite database
│   └── tsconfig.json       # TypeScript configuration
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── navbar/     # Navigation components
│   │   │   ├── Movie.tsx   # Movie display component
│   │   │   └── MoviesReturned.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx    # Homepage
│   │   │   └── Movies.tsx  # Movies listing page
│   │   ├── hooks/          # Custom React hooks
│   │   ├── queries.ts      # GraphQL queries
│   │   └── App.tsx         # Main application component
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
└── setupTables.py          # Database initialization script
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Python 3.x (for database setup)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd flick-finder
```

### 2. Setup Database
```bash
# Install Python dependencies (if needed)
pip install pandas sqlite3

# Run database setup script
python setupTables.py
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend Server
```bash
cd backend
npx ts-node index.ts
```
The GraphQL server will start on `http://localhost:4000`

### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The React application will start on `http://localhost:5173`

## GraphQL API

The backend provides a GraphQL API with the following main queries:

### Queries
- `movies(genres: [String], year: Int, offset: Int!, limit: Int!)` - Get paginated movies with optional filters
- `movie(title: String!)` - Search movies by title
- `movieFromID(id: Int!)` - Get detailed movie information by ID
- `actorsForMovie(id: Int!)` - Get actors for a specific movie
- `directorsForMovie(id: Int!)` - Get directors for a specific movie
- `movieCount` - Get total number of movies in database

### Example Query
```graphql
query {
  movies(limit: 10, offset: 0) {
    totalCount
    movies {
      id
      title
      year
      rating
      poster_url
    }
  }
}
```

## Database Schema

The SQLite database includes the following main tables:
- `movies` - Movie information (title, year, rating, description, etc.)
- `people` - Actors and directors
- `genres` - Movie genres
- `movie_actors` - Many-to-many relationship between movies and actors
- `movie_directors` - Many-to-many relationship between movies and directors
- `movie_genres` - Many-to-many relationship between movies and genres
