import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core"
import SearchBar from "material-ui-search-bar";
import { useState } from "react";

const PokeTable = ({ data }) => {
  const [pokemon, setPokemon] = useState(data)
  const [searched, setSearched] = useState("")

  //filters pokemon based on searched value
  async function requestSearch(searchedVal){
    const filteredPokemon = data.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchedVal.toLowerCase())
    })
    setPokemon(filteredPokemon)
  }

  //resets pokemon when search is cancelled
  async function cancelSearch(){
    setSearched("");
    requestSearch(searched);
  }

  return (
    <TableContainer component={Paper}>
      <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Sprite</TableCell>
            <TableCell>Types</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pokemon.map((pokemon) => (
            <TableRow key={pokemon.name}>
              <TableCell component="th" scope="pokemon">
                {pokemon.species.name}
              </TableCell>
              <TableCell>
                <img src={pokemon.sprites.front_default} alt='Sprite Not Available :(' />
              </TableCell>
              <TableCell>
                <ul>
                  {pokemon.types.map(type => (
                    <li>{type.type.name}</li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PokeTable
