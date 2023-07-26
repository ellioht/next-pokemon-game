import { NextResponse } from "next/server";

interface Pokemon {
  name: string;
  sprites: { front_default: string };
}

export async function GET() {
  const randomIds = getRandomPokemonIds(2);
  console.log(randomIds);

  const timestamp = Date.now();
  const pokemonData = await Promise.all(
    randomIds.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}?timestamp=${timestamp}`, {next: { revalidate: 0 }}).then((res) => res.json())
    )
  );
  return NextResponse.json(pokemonData, { headers: { "Cache-Control": "no-cache" } });
}

function getRandomPokemonIds(count: number): number[] {
  const maxPokemonId = 898;
  const randomIds: number[] = [];

  while (randomIds.length < count) {
    const randomId = Math.floor(Math.random() * maxPokemonId) + 1;
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }

  return randomIds;
}
