import { gql } from '@apollo/client'

export const getMovies = gql`
    query getMovies($genres: [String], $year: Int, $offset: Int!, $limit: Int!) {
        movies(genres: $genres, year: $year, offset: $offset, limit: $limit) {
            totalCount
            movies {
                id
                poster_url
                title
            }
        }
    }
`

export const searchMovie = gql`
    query searchMovie($movieTitle: String!) {
        movie(title: $movieTitle) {
            totalCount
            movies{
                id
                poster_url
                title
            }
        }
    }
`

export const searchMovieFromID = gql`
    query searchMovieFromID($movieID: Int!) {
        movieFromID(id: $movieID) {
            imdb_url
            poster_url
            title
            year
            duration
            rating
            description
        }
    }
`

export const searchActorsForMovie = gql`
    query searchActorsForMovie($movieID: Int!) {
        actorsForMovie(id: $movieID) {
            id
            name
        }
    }
`

export const searchDirectorsForMovie = gql`
    query searchDirectorsForMovie($movieID: Int!) {
        directorsForMovie(id: $movieID) {
            name
        }
    }
`