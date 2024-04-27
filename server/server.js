const axios = require('axios');
const cors = require('cors');

const corsHandler = cors({
    origin: true,
    credentials: true
});

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

module.exports = async (req, res) => {
    
    runMiddleware(req, res, corsHandler);
    
    const pokemon = ['charmander', 'squirtle', 'metapod', 'butterfree', 'pikachu', 'jigglypuff', 'gengar', 'eevee'];
    const requests = pokemon.map(poke => axios.get(`https://pokeapi.co/api/v2/pokemon/${poke}`));
    try {
        const responses = await Promise.all(requests);
        const pokeDex = responses.map(response => {
            const id = response.data.id;
            return {
                id: id,
                name: response.data.name,
                img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                type: response.data.types[0].type.name,
                exp: response.data.base_experience,
            };
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(pokeDex);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch Pokemon' });
    }
};