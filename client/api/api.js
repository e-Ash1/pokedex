const axios = require('axios');

async function lambdaHandler(event, context) {
    // Setup CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
    };

    // Main handler logic for GET requests
    if (event.httpMethod === 'GET') {
        const pokemon = ['charmander', 'squirtle', 'metapod', 'butterfree', 'pikachu', 'jigglypuff', 'gengar', 'eevee'];
        try {
            const responses = await Promise.all(
                pokemon.map(poke => 
                    axios.get(`https://pokeapi.co/api/v2/pokemon/${poke}`)
                )
            );
            const pokeDex = responses.map(response => ({
                id: response.data.id,
                name: response.data.name,
                img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${response.data.id}.png`,
                type: response.data.types[0].type.name,
                exp: response.data.base_experience
            }));
            return {
                statusCode: 200,
                headers, 
                body: JSON.stringify(pokeDex)
            };
        } catch (error) {
            console.error("Error fetching data:", error);
            return {
                statusCode: 500,
                headers, 
                body: JSON.stringify({ error: 'Failed to fetch Pokemon' })
            };
        }
    }

    // Handles any edge cases for HTTP methods not supported
    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' })
    };
}

module.exports = { handler: lambdaHandler };
