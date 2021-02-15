import { gql, QueryHookOptions, QueryResult, useQuery } from '@apollo/client'

export const GET_POKEMONS = gql`
  query pokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      next
      previous
      results {
        name
        image
      }
    }
  }
`

type UsePokemonsData = {
  pokemons: {
    next: string
    previous: string
    status: string
    results: {
      name: string
      image: string
    }[]
  }
}

type UsePokemonsVariables = {
  limit?: number
  offset?: number
}

type UsePokemonsOptions = QueryHookOptions<
  UsePokemonsData,
  UsePokemonsVariables
>

function usePokemons(
  options: UsePokemonsOptions,
): QueryResult<UsePokemonsData, UsePokemonsVariables> {
  const { variables, ...restOptions } = { ...options }

  const result = useQuery<UsePokemonsData, UsePokemonsVariables>(GET_POKEMONS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: 15,
      offset: 0,
      ...variables,
    },
    ...restOptions,
  })

  return {
    ...result,
    // @ts-ignore
    fetchMore: (arg) => {
      return result.fetchMore({
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEntries = fetchMoreResult.pokemons.results
          return {
            pokemons: {
              ...fetchMoreResult.pokemons,
              results: [...previousResult.pokemons.results, ...newEntries],
            },
          }
        },
        ...arg,
      })
    },
  }
}

export default usePokemons
