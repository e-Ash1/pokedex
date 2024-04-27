import React, { useEffect, useState } from 'react';

function PokeDex() {
    const [pokedex, setPokedex] = useState([]);

    useEffect(() => {
        fetch('https://localhost:3001/api/pokedex')
            .then((response) => response.json())
            .then((data) => setPokedex(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div>
        <h1>Pokédex</h1>
        <div className="cards-container">
            {pokedex.map((pokemon) => (
                <div key={pokemon.id} className="card">
                    <div className="card-content">
                        <h2 className="card-title">{capitalize(pokemon.name)}</h2>
                        <img className="card-image" src={pokemon.img} alt={pokemon.name} />
                        <p className="card-info">Type: {pokemon.type}</p>
                        <p className="card-info">EXP: {pokemon.exp}</p>
                    </div>
                </div>
        ))}
        </div>
    </div>

    );
};

export default PokeDex;
