const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;


const pokeDex = [];

app.use(cors());

async function catchPokemon() {
    try {
        const pokemon = ['charmander', 'squirtle', 'metapod', 'butterfree', 'pikachu', 'jigglypuff', 'gengar', 'eevee'];
        const requests = pokemon.map(poke => axios.get(`https://pokeapi.co/api/v2/pokemon/${poke}`));
        const responses = await Promise.all(requests);

        responses.forEach(response => {
            const id = response.data.id;
            const properties = {
                id: id,
                name: response.data.name,
                img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                type: response.data.types[0].type.name,
                exp: response.data.base_experience,
            };
            pokeDex.push(properties);
        });
    } catch (error) {
        console.error(error);
    }
};


(async () => {
    await catchPokemon(); 

    app.get('/api/pokedex', (req, res) => {
        res.json(pokeDex);
    });
    

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();
