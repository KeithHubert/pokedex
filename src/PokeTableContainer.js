import { useState, useEffect } from "react";
import axios from 'axios'
import PokeTable from "./PokeTable";

const PokeTableContainer = () => {
  const [pokeData, setPokeData] = useState([])
  const [loading, setLoading] = useState(false)

  // when pokeData changes, if data is longer than 0 data has loaded set loading to false
  useEffect(() => {
    pokeData.length > 0 && setLoading(false)
  }, [pokeData]);

  // first get request, gets all pokemon data
  async function getData() {
    setLoading(true)
    const result = await axios({
      method: 'get',
      url: 'https://pokeapi.co/api/v2/pokemon/?limit=151&offset=151',
    })
    console.log('result', result)
    return mapWrapper(result.data.results)
  }

  // Similar to componentDidMount and componentDidUpdate:
  // when component mounts => get data
  useEffect(() => {
    getData()
  }, []);

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

  return (
    <>
      {loading
        ? (
          <h1>Loading...</h1>
        ) : (
          <PokeTable
            data={pokeData}
          />
        )}
    </>
  )
}

export default PokeTableContainer
