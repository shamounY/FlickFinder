import React from 'react'
import { Button, Typography, Box, CircularProgress, Grid } from '@mui/material'
import { useQuery } from '@apollo/client'
import { searchMovieFromID, searchActorsForMovie, searchDirectorsForMovie } from '../queries'

type MovieProps = {
    movieID: number;
    onClose: () => void;
}

const Movie: React.FC<MovieProps> = ({ movieID, onClose }) => {
    // Fetch movie details
    const movieResult = useQuery(searchMovieFromID, {
        variables: { movieID }
    })

    // Fetch actors for the movie
    const actorsResult = useQuery(searchActorsForMovie, {
        variables: { movieID }
    })

    // Fetch directors for the movie
    const directorsResult = useQuery(searchDirectorsForMovie, {
        variables: { movieID }
    })

    const movie = movieResult.data?.movieFromID
    const actors = actorsResult.data?.actorsForMovie
    const directors = directorsResult.data?.directorsForMovie

    if (movieResult.loading || actorsResult.loading || directorsResult.loading) return <CircularProgress />;
    if (movieResult.error || actorsResult.error || directorsResult.error) {
        console.error("GraphQL error:", movieResult.error || actorsResult.error || directorsResult.error);
        return <div>Error loading movie.</div>;
    }

    if (!movie) {
        return (
            <div>
                <h1>Movie not found.</h1>
                <Button variant='outlined' onClick={onClose}>
                    Back
                </Button>
            </div>
        )
    }

    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" gutterBottom>{movie.title}</Typography>
            <Typography variant="h5" color="textSecondary" gutterBottom>{movie.year}</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img src={movie.poster_url} alt={movie.title} height="300" />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1" paragraph>{movie.description}</Typography>
                <Typography variant="body2" color="textSecondary">
                    Duration: {movie.duration} | Rating: {movie.rating}
                </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
                Actors:
            </Typography>
            <Grid container spacing={2}>
                {actors?.map(actor => (
                    <Grid item key={actor.id} xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', padding: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Typography variant="body1">{actor.name}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
                Directors:
            </Typography>
            <Grid container spacing={2}>
                {directors?.map((director, index) => (
                    <Grid item key={index} xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', padding: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Typography variant="body1">{director.name}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Button variant="outlined" onClick={onClose} sx={{ marginTop: 3 }}>
                Back
            </Button>
        </Box>
    )
}

export default Movie
