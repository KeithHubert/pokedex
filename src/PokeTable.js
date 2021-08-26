import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@material-ui/core"
import { useState } from "react"
import SearchBar from "material-ui-search-bar"
import { CSVLink } from "react-csv"

const PokeTable = ({ data }) => {
  const [allPokemon, setPokemon] = useState(data)
  const [searched, setSearched] = useState('')
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('order');

  //filters pokemon based on searched value
  async function requestSearch(searchedVal) {
    const filteredPokemon = data.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchedVal.toLowerCase())
    })
    setPokemon(filteredPokemon)
  }

  //resets pokemon when search is cancelled
  async function cancelSearch() {
    setSearched("");
    requestSearch(searched);
  }

  // handler for setting order and orderBy on header label click
  const handleRequestSort = (property) => {
    // bool to check if same property is selected and if sorting by ascending
    const isAsc = orderBy === property && order === 'asc';
    // switch order
    setOrder(isAsc ? 'desc' : 'asc');
    // set orderBy new property
    setOrderBy(property);
  };

  // gets order for descending sort, also used inversely for ascending
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  // returns descendingComparator, or inverse (-) if ascending
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // handles sorting of table, takes in array of data and comparator determined by getComparator
  function stableSort(array, comparator) {
    // give each array and index to to maintain order
    // https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      // if difference in value then order is returned in order
      if (order !== 0) return order;
      // but if the values are the same, return the item that first appeared in the array first
      return a[1] - b[1];
    });
    // return just the sorted values, remove the index from array
    return stabilizedThis.map((el) => el[0]);
  }

  const headers = [
    { id: 'order', label: 'Order', type: 'string', key: 'order' },
    { id: 'name', label: 'Name', type: 'string', key: 'species.name' },
    { id: 'sprite', label: 'Sprite', type: 'img', key: 'sprites.front_default' },
    { id: 'types', label: 'Types', key: 'types', type: 'array', subKey: 'type.name' }
  ];

  // required due to 'types' being an array and the number of types being unknown
  const buildCsvHeaders = () => {
    // start off with the most types a pokemon has being 1
    let mostTypes = 1
    // initialize types array with first type label and key
    let types = [{ label: 'Type 1', key: 'types[0].type.name' }]
    allPokemon.forEach(pokemon => {
      // go though each pokemon's types
      pokemon.types.forEach((type, i) => {
        // if there are more types for this pokemon than previous pokemon
        if (i + 1 > mostTypes) {
          // add a new type header and key
          types.push({ label: `Type ${i}`, key: `types[${i}].type.name` })
          // increment mostTypes
          mostTypes++
        }
      })
    })
    // new var as to not mutate original
    let newHeaders = headers
    // remove hard-coded 'types' obj
    newHeaders.length = headers.length - 1
    // return headers with our new type headers attached
    return newHeaders.concat(types)
  }

  //specifies csv name, headers, rows
  const csvInfo = {
    filename: 'Pokemon.csv',
    headers: buildCsvHeaders(),
    data: allPokemon
  }

  // returns either string, img, or list
  const getCellValue = (header, pokemon) => {
    let value = eval("pokemon." + header.key) || ''
    if (header.type === 'array') {
      return (
        <ul>
          {value.map(row => <li>{eval('row.' + header.subKey) || 'error'}</li>)}
        </ul>
      )
    } else if (header.type === 'img') {
      return <img src={value} alt='Sprite Not Available :(' />
    } else {
      return value
    }
  }

  return (
    <TableContainer component={Paper}>
      <CSVLink {...csvInfo}>
        <button style={{ color: 'black', backgroundColor: 'white', borderRadius: 5, float: 'left', width: 100, height: 50 }}>
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
            {headers.map(header => (
              <TableCell
                key={header.id}
                sortDirection={orderBy === header.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === header.id}
                  direction={orderBy === header.id ? order : 'asc'}
                  onClick={() => handleRequestSort(header.id)}
                >
                  {header.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(allPokemon, getComparator(order, orderBy)).map((pokemon, i) => (
            <TableRow key={i}>
              {headers.map((header) => (
                <TableCell key={header.id}>
                  {getCellValue(header, pokemon)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PokeTable
