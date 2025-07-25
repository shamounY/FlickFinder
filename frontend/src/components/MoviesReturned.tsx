import React from 'react'
import {
    Grid2, 
    Typography,
    Card,
    CardMedia,
    CardContent
} from '@mui/material'

type data = {
    movies: [];
    setMovieID: (id: number) => void;
    setIsSubmitted: (value: boolean) => void;
}

const MoviesReturned: React.FC<data> = ({ movies, setMovieID, setIsSubmitted }) => (
    <Grid2 
        container 
        spacing={3} 
        justifyContent="center" 
        style={{ minHeight: '80vh' }}
    >
        {movies.map(({ id, title, poster_url }:
            { id: number, title: string, poster_url: string}) => (
            <Grid2 
                
                key={id} 
                display="flex" 
                justifyContent="center"
            >
                <Card
                    sx={{
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: 300,
                    }}
                    onClick={() => {
                        setMovieID(+id)
                        setIsSubmitted(true)
                    }}
                    >
                        <CardMedia
                            component='img'
                            height='300'
                            image={poster_url}
                            alt={title}
                            sx={{
                                width: '200px', //fixed width
                                height: '300px', //fixed height
                                objectFit: 'cover', //ensures the image scales to fill the area without distortion
                                margin: '0 auto', //centers the image within the card
                            }}
                        />
                        <CardContent>
                        <Typography variant='h6' align="center">
                            {title}
                        </Typography>
                        </CardContent>
                    </Card>
            </Grid2>
        ))}
    </Grid2>
)

export default MoviesReturned;