const { ApolloServer } = require('@apollo/server');
const { gql } = require('graphql-tag');
const { startStandaloneServer } = require('@apollo/server/standalone')
const  db = require('better-sqlite3')('termproject.db', { readonly:true, fileMustExist: true})

const typeDefs = gql`
    type Movie {
        id: ID!
        imdb_url: String!
        poster_url: String!
        title: String!
        year: Int!
        duration: String!
        rating: Float!
        description: String!
    }

    type Actor {
        id: ID!
        name: String!
    }

    type Director {
        name: String!
    }   

    type MovieCount {
        Count: Int!
    }

    type MoviesResult {
        totalCount: Int!
        movies: [Movie!]!
    }

    type Query {
        movieCount: MovieCount!
        movie(title: String!): MoviesResult!
        movieFromID(id: Int!): Movie!
        movies(genres: [String], year: Int, offset: Int!, limit: Int!): MoviesResult!
        actorsForMovie(id: Int!): [Actor!]!  # New query to fetch actors for a movie
        directorsForMovie(id: Int!): [Director!]! # Add this new query
    }
`

const resolvers = {
    Query: {
        movieCount: () => {
            const count = db.prepare('SELECT count(*) as count FROM movies').get().count
            return { Count: count }
        },

        movie: (_: unknown, args: { title: string }) => {

            const totalCount = db.prepare("SELECT COUNT(*) AS count FROM movies WHERE movies.title LIKE ?").get(`%${args.title}%`).count;
            const movies = db.prepare("SELECT movies.id, movies.title, movies.poster_url FROM movies WHERE UPPER(movies.title) LIKE UPPER(?)").all(`%${args.title}%`);

            return { totalCount, movies }
        },

        movieFromID: (_: unknown, args: { id: number }) => {
            const movie = db.prepare("SELECT * FROM movies WHERE movies.id = ?").get(args.id);
            return movie
        },

        movies: (_: unknown, { genres, year, offset, limit }: { genres: [string], year: number, offset: number; limit: number }) => {
            let filterQuery = '';
            let dataQuery = `SELECT movies.id, movies.title, movies.poster_url FROM movies`;
            let totalQuery = `SELECT COUNT(*) as total FROM ( ${dataQuery}`;

            if (genres && genres.length > 0) {
                const genreList = genres.map(genre => `'${genre}'`).join(", ");
                const genreFilter = `
                    JOIN movie_genre ON movies.id = movie_genre.movie_id
                    JOIN genres ON movie_genre.genre_id = genres.id
                    WHERE genres.name IN (${genreList})
                    GROUP BY movies.id
                    HAVING COUNT(DISTINCT genres.name) = ${genres.length}
                `;
                filterQuery += genreFilter;
            } else {
                filterQuery += ' WHERE 1=1';
            }

            if (year) filterQuery += ` AND movies.year = ${year}`;

            totalQuery += `${filterQuery} ) AS subquery`;
            dataQuery += `${filterQuery} LIMIT ? OFFSET ?`;

            const totalCount = db.prepare(totalQuery).get().total;
            const movies = db.prepare(dataQuery).all(limit, offset);

            return { totalCount, movies };
        }, 
        actorsForMovie: (_: unknown, args: { id: number }) => {
            const actors = db.prepare(`
                SELECT people.id, people.name
                FROM movies
                JOIN stars_in ON stars_in.movie_id = movies.id
                JOIN people ON stars_in.person_id = people.id
                WHERE movies.id = ?
            `).all(args.id);

            return actors;
        },

        directorsForMovie: (_: unknown, { id } : { id: any }) => {
            const directors = db.prepare(`
                SELECT people.name 
                FROM movies
                JOIN director_for ON director_for.movie_id = movies.id
                JOIN people ON director_for.director_id = people.id
                WHERE movies.id = ?
                LIMIT 30
            `).all(id);

            return directors;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }: { url: string }) => {
    console.log(`Server ready at ${url}`)
})