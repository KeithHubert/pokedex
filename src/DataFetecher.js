import { Button } from "@material-ui/core";
import axios from 'axios'
import { useState } from "react";

const DataFetcher = () => {
  const [pokeData, setPokeData] = useState({})

  // first get request, gets all pokemon data
  async function getData() {
    const result = await axios({
      method: 'get',
      url: 'https://pokeapi.co/api/v2/pokemon/?limit=151&offset=151',
    })
    return mapWrapper(result.data.results)
  }

  // wrapper for the second part of the fetch to get information on a specific pokemon
  // required so that it waits until all requests are made before returning results
  async function mapWrapper(allPokemon) {
    const promiseArray = allPokemon.map(pokemon => {
      return getPokemonData(pokemon.url)
    })
    const ArrayOfResults = await Promise.all(promiseArray);
    console.log(ArrayOfResults);
    setPokeData(ArrayOfResults)
  }

  // second get request to get individual pokemon records
  async function getPokemonData(url) {
    const result = await axios({
      method: 'get',
      url: url,
    })
    return result.data
  }


  const first10Values = pokeData.length > 0 
    ? pokeData.slice(0, 1)
    : pokeData

//  const shortData = pokeData?.slice(0, 1) || {}
  return (
    <>
      <Button variant='contained' onClick={() => getData()}>
        Click to fetch
      </Button>
      {first10Values.length > 0 &&
      <p style={{fontSize: '12px', backgroundColor: 'white', color: 'black'}}>
        {JSON.stringify(first10Values)}
      </p>
}
    </>
  )
}

export default DataFetcher
