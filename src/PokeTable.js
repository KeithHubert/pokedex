import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"

const PokeTable = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Sprite</TableCell>
            <TableCell>Types</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((pokemon) => (
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
