import React from 'react';
import useDataFetch from '../hooks/useDataFetch';

function PokeDex() {
    const { data: pokedex, loading, error } = useDataFetch(`/api/pokedex`);

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Pokédex</h1>
            <div className="cards-container">
                {pokedex && pokedex.map((pokemon) => (
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
