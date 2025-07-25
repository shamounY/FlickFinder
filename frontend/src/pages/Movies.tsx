import React, { useState } from 'react'
import { getMovies } from '../queries'
import { useQuery } from '@apollo/client'
import Movie from '../components/Movie'
import GenreFilter from '../components/navbar/GenreFilter'
import MoviesReturned from '../components/MoviesReturned'
import { usePaginatedQuery } from '../hooks/usePaginatedQuery'
import TextField from "@mui/material/TextField";
import { searchMovie } from '../queries'
import {
    Container,
    CircularProgress,
    Box,
    Pagination,
    Button,
} from '@mui/material'

const Movies: React.FC = () => {
    const [movieToSearch, setMovieToSearch] = useState('')
    const [isSearchSubmitted, setIsSearchSubmitted] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
    const [movieID, setMovieID] = useState<number>(0);

    console.log('isSubmitted:', isSubmitted);
    console.log('movieID:', movieID);

    const { loading, error, data, currentPage, totalPages, handlePageChangeMui } = 
        usePaginatedQuery(searchMovie, 'movie', { "movieTitle": movieToSearch }, isSearchSubmitted === false
    ); 

    const { loading: paginationLoading, error: paginationError, data: paginationData, currentPage: currentPage1, totalPages: totalPages1, handlePageChangeMui: handle1 } = 
        usePaginatedQuery(getMovies, 'movies', { "genres": selectedGenres }, isSearchSubmitted);

        if (paginationLoading || loading) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }
        if (paginationError) {
            console.log("in this error")
            return <p>Error: {paginationError.message}</p>
        }


    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (movieToSearch != '') {
            setIsSearchSubmitted(true)
        }
    }

    const handleChange = (e: any) => {
        setMovieToSearch(e.target.value)
    }

    if (data?.movie.totalCount === 1) {
        return (
            <Movie movieID={+data.movie.movies[0].id}
            onClose={() => {
                setMovieID(0);
                setIsSubmitted(false);
            }}/>
        )
    }
    else if (data?.movie.totalCount > 1){
        return (
            <Container>
                <MoviesReturned movies={data.movie.movies} setMovieID={setMovieID} setIsSubmitted={setIsSubmitted} />
            </Container>
        )
    }

    return (
        <div>
            {!isSubmitted ? (
                <div>
                    <Box display="flex" alignItems="center" >
                        <form onSubmit={handleSubmit}>
                            <Box display="flex" alignItems="center">
                                <TextField 
                                    id="outlined-basic"
                                    size="small"
                                    label="Search Movie"
                                    variant="outlined"
                                    value={movieToSearch}
                                    onChange={handleChange}
                                />
                                <Button
                                    type="submit" 
                                    size="small" 
                                    variant="contained" 
                                    color="primary"
                                    sx={{ ml: 2, width: 20 }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </form>
                        <GenreFilter
                            selectedGenres={selectedGenres}
                            setSelectedGenres={setSelectedGenres}
                        />
                    </Box>
                    <Container>
                        <MoviesReturned movies={paginationData.movies.movies} setMovieID={setMovieID} setIsSubmitted={setIsSubmitted} />
                        
                        <Box my={4} display="flex" justifyContent="center">
                            <Pagination
                                page={currentPage1}
                                count={totalPages1}
                                onChange={handle1}
                            />
                        </Box>
                    </Container>
                </div>
            ) : 
                movieID ? ( 
                    <Movie 
                        movieID={movieID}
                        onClose={() => {
                            setMovieID(0);
                            setIsSubmitted(false);
                        }}
                    />
                ) : (
        
                    <div>Movie Not Found</div>
                )
        }
        </div>
    )
}

export default Movies