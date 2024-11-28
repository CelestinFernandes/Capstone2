const express = require('express');
const {
    getMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie
} = require('../controllers/movieController');
const router = express.Router();

// Route to get all movies
router.get('/', getMovies);

// Route to get a single movie by ID
router.get('/:id', getMovieById);

// Route to add a new movie
router.post('/', addMovie);

// Route to update a movie by ID
router.put('/:id', updateMovie);

// Route to delete a movie by ID
router.delete('/:id', deleteMovie);

module.exports = router;
