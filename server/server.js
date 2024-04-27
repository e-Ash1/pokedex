// /api/pokedex.js
const axios = require('axios');

module.exports = async (req, res) => {
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