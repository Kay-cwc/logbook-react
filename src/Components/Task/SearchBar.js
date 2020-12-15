import React from 'react'
import { Grid, Search } from 'semantic-ui-react'
import API from "../../Helpers/API";

const initialState = {
  loading: false,
  results: [],
  value: '',
}

const header = {
  Authorization: 'TOKEN ' + localStorage.getItem('LOGBOOK_AUTH_TOKEN')
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

const SearchBar = (props) => {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }
      API.get('api/user/search/?field=' + data.value, { headers: header })
      .then( res => {
        let results = res.data.data
        results.forEach( item => {
          item.title = item.alias
          item.description = item.email
        });
        dispatch({ type: 'FINISH_SEARCH', results: results })
      })
      .catch( err => {
        console.log(err.response)
      })
    }, 1000)
  }, [])

  const handleSelection = React.useCallback((e, data) => {
    props.selectUser(data.result)
    dispatch({ type: 'CLEAN_QUERY'})
  })

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Grid>
      <Grid.Column width={6}>
        <Search
          loading={loading}
          onResultSelect={handleSelection}
          onSearchChange={handleSearchChange}
          results={results}
          value={value}
        />
      </Grid.Column>
    </Grid>
  )
}

export default SearchBar
