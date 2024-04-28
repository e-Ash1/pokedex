const axios = require('axios');

async function lambdaHandler(event, context) {
    // Allowed origins can include specific URLs or patterns
    const allowedOrigins = [
        'https://pokedex-five-roan.vercel.app',
        /\.pokedex-five-roan\.vercel\.app$/,   // Regex to cover all subdomains dynamically
        'https://pokedex-ng8k9wa47-emads-projects-35759fe6.vercel.app' // Include other known dynamic URLs if necessary
    ];

    // Determine if the request origin is in the allowed list
    const requestOrigin = event.headers.origin;
    const isAllowedOrigin = allowedOrigins.some(origin => 
        typeof origin === 'string' ? origin === requestOrigin : origin.test(requestOrigin)
    );

    // Setup CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowedOrigin ? requestOrigin : 'https://yourfallbackorigin.com',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle OPTIONS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers,
            body: ''
        };
    }

    // Handle GET requests
    if (event.httpMethod === 'GET') {
        try {
            const responses = await Promise.all(
                event.queryStringParameters.pokemon.map(poke => 
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

    // Response for unsupported HTTP methods
    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' })
    };
}

module.exports = { handler: lambdaHandler };
