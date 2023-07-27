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
  const [animateScore, setAnimateScore] = useState(false);

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
      handleIncrement(false);
      setPokemon(nextPokemon);
      setLoading(true);
      fetchPokemon("pokemon", setNextPokemon);
    } else {
      setCorrect("Wrong!");
      handleIncrement(true);
      setPokemon(nextPokemon);
      setLoading(true);
      fetchPokemon("pokemon", setNextPokemon);
    }
  };

  const handleIncrement = (reset: boolean) => {
    if (reset) {
      setScore(0);
    } else {
      setScore(score + 1);
      setAnimateScore(true);
      setTimeout(() => {
        setAnimateScore(false);
      }, 1000);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
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
            <div key={poke.name} className="poke-card">
              <button onClick={() => checkPokemon(poke.id)}>
                <h3 className="card-top">{poke.name}</h3>
                <img src={poke.sprites?.front_default} />
              </button>
            </div>
          ))
        )}
      </div>
      <h1 className={`text-4xl font-bold m-10 ${animateScore ? 'score-animation' : ''}`}>Score: {score}</h1>
    </main>
  );
}
