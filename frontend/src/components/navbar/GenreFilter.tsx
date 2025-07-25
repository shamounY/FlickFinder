import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Chip, Box } from '@mui/material'

const genreList = [
    'Documentary',
    'Short',
    'Comedy',
    'Sport',
    'Music',
    'Action',
    'History',
    'Horror',
    'Romance',
    'Fantasy',
    'Sci-Fi',
    'Drama',
    'Family',
    'Adventure',
    'Crime',
    'Western',
    'Animation',
    'Biography',
    'Thriller',
    'War',
    'Mystery',
    'Film-Noir',
    'Musical',
    'News',
    'Talk-Show',
    'Adult',
    'Reality-TV'
]

type GenreProps = {
    selectedGenres: string[];
    setSelectedGenres: (genres: string[]) => void;
}

const GenreFilter: React.FC<GenreProps> = ({ selectedGenres, setSelectedGenres }) => {
    const handleChange = (e: any) => {
        setSelectedGenres(e.target.value)
    }

    return (
        <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id='genre-select-label'>Genres</InputLabel>
            <Select
                labelId='genre-select-label'
                multiple
                value={selectedGenres}
                onChange={handleChange}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
                label="Genres"
            >
                {genreList.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                        {genre}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default GenreFilter;