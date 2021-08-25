import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core"
import { useState } from "react"
import SearchBar from "material-ui-search-bar"
import { CSVLink } from "react-csv"

const PokeTable = ({ data }) => {
  const [pokemon, setPokemon] = useState(data)
  const [searched, setSearched] = useState("")
  const [sortName, setSortName] = useState('dec')
  const [sortNum, setSortNum] = useState('dec')

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

  async function alphabSort(){
    if (sortName == 'dec'){
      let a = pokemon.sort(function(a, b){
        if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
        if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1 }
        return 0
      })
      setPokemon(a)
      setSortName('acd')
    }
    else{
      let a = pokemon.sort(function(a, b){
        if(a.name.toLowerCase() < b.name.toLowerCase()) { return 1 }
        if(a.name.toLowerCase() > b.name.toLowerCase()) { return -1 }
        return 0
      })
      setPokemon(a)
      setSortName('dec')
    }
  }

  async function numbSort(){
    if (sortNum == 'dec'){
      let a = pokemon.sort(function(a, b){
        if(a.order < b.order) { return -1 }
        if(a.order > b.order) { return 1 }
        return 0
      })
      setPokemon(a)
      setSortNum('acd')
    }
    else{
      let a = pokemon.sort(function(a, b){
        if(a.order < b.order) { return 1 }
        if(a.order > b.order) { return -1 }
        return 0
      })
      setPokemon(a)
      setSortNum('dec')
    }
  }

  //specifies csv name, headers, rows
  const csvInfo = {
    filename: 'Pokemon.csv',
    headers: [
      {label: 'Order', key: 'order'},
      {label: 'Pokemon', key: 'species.name'},
      {label: 'Sprite', key: 'sprites.front_default'},
      {label: 'Type 1', key: 'types[0].type.name'},
      {label: 'Type 2', key: 'types[1].type.name'},
    ],
    data: pokemon
  }

  return (
    <TableContainer component={Paper}>
      <CSVLink {...csvInfo}>
        <button style={{color: 'black', backgroundColor: 'white', borderRadius: 5, float: 'left', width: 100, height: 50}}>
          Export as CSV
        </button>
      </CSVLink>
      <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order
              <button onClick = {() => numbSort()} 
                style = {{color: 'black', backgroundColor: 'white', borderRadius: 5}}>
                sort
              </button>
            </TableCell>
            <TableCell>Name
              <button onClick = {() => alphabSort()} 
                style = {{color: 'black', backgroundColor: 'white', borderRadius: 5}}>
                sort
              </button>
            </TableCell>
            <TableCell>Sprite</TableCell>
            <TableCell>Types</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pokemon.map((pokemon) => (
            <TableRow key={pokemon.name}>
              <TableCell>
                {pokemon.order}
              </TableCell>
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
