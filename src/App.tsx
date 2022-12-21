import { useState, useEffect } from "react";
import "./App.css";
import styled from "@emotion/styled";
import { Button } from "@mui/material";

interface Pokemon {
  id: number;
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };
  type: string[];
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    "Sp. Attack": number;
    "Sp. Defense": number;
    Speed: number;
  };
}

interface PokemonName {
  english: string;
  japanese: string;
  chinese: string;
  french: string;
}

interface PokemonBase {
  HP: number;
  Attack: number;
  Defense: number;
  "Sp. Attack": number;
  "Sp. Defense": number;
  Speed: number;
}

const PokemonRow = (props: {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
}): JSX.Element => {
  return (
    <tr>
      <td>{props.pokemon.name.english}</td>
      <td>{props.pokemon.type.join(", ")}</td>
      <td>
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.onSelect(props.pokemon)}
        >
          Select!
        </Button>
      </td>
    </tr>
  );
};

const PokemonInfo = (props: {
  name: PokemonName;
  base: PokemonBase;
}): JSX.Element => {
  return (
    <div>
      <h1>{props.name.english}</h1>

      {props.base && (
        <table>
          {Object.keys(props.base).map((key: string) => {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{props.base[key as keyof PokemonBase]}</td>
              </tr>
            );
          })}
        </table>
      )}
    </div>
  );
};

const Title = styled.h1`
  text-align: center;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  grid-column-gap: 1rem;
`;

const Container = styled.div`
  margin: auto;
  width: 800px;
  padding-top: 1rem;
`;

const Input = styled.input`
  width: 100%;
  font-size: x-large;
  padding: 0.2rem;
`;

function App() {
  const [filter, filterSet] = useState("");
  const [selectedItem, selectedItemSet] = useState<Pokemon>();
  const [pokemon, pokemonSet] = useState<Pokemon[]>();

  useEffect(() => {
    fetch("http://localhost:3000/starting-react/pokemon.json")
      .then((resp) => resp.json())
      .then((data) => pokemonSet(data));
  }, []);

  return (
    <Container>
      <Title className="title">Pokemon Search</Title>
      <Input
        type="text"
        value={filter}
        onChange={(evt) => {
          filterSet(evt.target.value);
        }}
      />
      <TwoColumnLayout>
        <table width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {pokemon &&
              pokemon
                .filter((pokemon: Pokemon) =>
                  pokemon.name.english
                    .toLowerCase()
                    .includes(filter.toLowerCase())
                )
                .slice(0, 20)
                .map((pokemon: Pokemon): JSX.Element => {
                  return (
                    <PokemonRow
                      pokemon={pokemon}
                      onSelect={(pokemon: Pokemon) => selectedItemSet(pokemon)}
                      key={pokemon.id}
                    />
                  );
                })}
          </tbody>
        </table>
        {selectedItem && (
          <div>
            <PokemonInfo name={selectedItem.name} base={selectedItem.base} />
          </div>
        )}
      </TwoColumnLayout>
    </Container>
  );
}

export default App;
