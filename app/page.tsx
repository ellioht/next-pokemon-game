"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface PokemonData {
  name: string;
  sprites: { front_default: string }
  id: number;
}

export default function Home() {
  const [pokemon, setPokemon] = useState<PokemonData[]>([]);
  const [score, setScore] = useState<number>(0);
  const [correct, setCorrect] = useState<string>('');


  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      const response = await fetch('/api/getpokemon', {
        next: { revalidate: 10 },
      });
      const data = await response.json();
      console.log(data.pokemon);
      console.log(data.ids);
      setPokemon(data.pokemon);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };

  const checkPokemon = (id: number) => {
    // check if id is the lowest id in pokemon array
    if (id === Math.min(...pokemon.map((poke) => poke.id))) {
      setCorrect('Correct!');
      setScore(score + 1);
      fetchPokemon();
    } else {
      setCorrect('Wrong!');
      setScore(0);
      fetchPokemon();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold m-10">Guess which Pokémon came first!</h1>
        <p className={`mb-8 ${correct === 'Correct!' ? 'text-green-500' : 'text-red-500'}`}>{correct}</p>
        <div className="flex gap-5">
          {pokemon.map((poke) => (
            <div key={poke.name}>
              <button 
                className="poke-card"
                onClick={() => checkPokemon(poke.id)}
                >
              <h3>{poke.name}</h3>
              <img src={poke.sprites?.front_default} alt={poke.name} />
              </button>
            </div>
          ))}
        </div>
        <h1 className="text-4xl font-bold m-10">Score: {score}</h1>
    </main>
  );
}
