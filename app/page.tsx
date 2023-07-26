"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface PokemonData {
  name: string;
  sprites: { front_default: string };
  id: number;
}

export default function Home() {
  const [pokemon, setPokemon] = useState<PokemonData[]>([]);
  const [nextPokemon, setNextPokemon] = useState<PokemonData[]>([]);

  const [score, setScore] = useState<number>(0);
  const [correct, setCorrect] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPokemon("pokemon", setPokemon);
    fetchPokemon("pokemon", setNextPokemon);
  }, []);

  const fetchPokemon = async (
    type: string,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const response = await fetch("/api/getpokemon");
      const data = await response.json();
      setLoading(false);
      setState(data[type]);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const checkPokemon = (id: number) => {
    // check if id is the lowest id in pokemon array
    if (id === Math.min(...pokemon.map((poke) => poke.id))) {
      setCorrect("Correct!");
      setScore(score + 1);
      setPokemon(nextPokemon);
      setLoading(true);
      fetchPokemon("pokemon", setNextPokemon);
    } else {
      setCorrect("Wrong!");
      setScore(0);
      setPokemon(nextPokemon);
      setLoading(true);
      fetchPokemon("pokemon", setNextPokemon);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold m-10">Guess which Pokémon came first!</h1>
      <p className={`mb-8 ${correct === "Correct!" ? "text-green-500" : "text-red-500"}`}>
        {correct}
      </p>
      <div className="flex gap-5">
        {loading ? (
          <p className="text-blue-500">Loading...</p>
        ) : (
          pokemon &&
          pokemon.map((poke) => (
            <div key={poke.name}>
              <button className="poke-card" onClick={() => checkPokemon(poke.id)}>
                <h3>{poke.name}</h3>
                <img src={poke.sprites?.front_default} alt={poke.name} />
              </button>
            </div>
          ))
        )}
      </div>
      <h1 className="text-4xl font-bold m-10">Score: {score}</h1>
    </main>
  );
}
