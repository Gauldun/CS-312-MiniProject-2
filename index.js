import express from "express";
import axios from "axios";
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Base URL for the OpenBreweryDB API
const API_URL = "https://api.openbrewerydb.org/v1/breweries";

// Displays initial home page 
app.get('/', (req, res) => {
    res.render('index', { breweries: null, error: null });
});

// POST route searching for breweries given filter input(s)
app.post('/search', async (req, res) => {
    // Get the search parameter
    const search_query = req.body.city;

    try {
        // Construct the API endpoint URL with the search parameter
        const endpoint = `${API_URL}?by_city=${search_query}&per_page=10`;

        // Make the API request using Axios
        const response = await axios.get(endpoint);
        const breweries = response.data; // The array of brewery objects

        // Render the page with the fetched data
        res.render('index', { 
            breweries: breweries, 
            error: null 
        });

        // Error Handling
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render('index', { 
            breweries: null, 
            error: "Could not fetch breweries. Please check your input and try again." 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}. Open http://localhost:${port}`);
});