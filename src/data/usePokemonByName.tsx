import { gql, QueryHookOptions, useQuery } from '@apollo/client'

export const GET_POKEMON = gql`
  query pokemon($name: String!) {
    pokemon(name: $name) {
      id
      name
      sprites {
        front_default
      }
      moves {
        move {
          name
        }
      }
      types {
        type {
          name
        }
      }
    }
  }
`

export interface UsePokemonByNameData {
  pokemon: {
    id: number
    name: string
    sprites: {
      front_default
    }
    moves: {
      move: {
        name: string
      }
    }[]
    types: {
      type: {
        name: string
      }
    }[]
  }
}

interface UsePokemonByNameVariables {
  name: string
}

function usePokemonByName(
  options: QueryHookOptions<UsePokemonByNameData, UsePokemonByNameVariables>,
) {
  return useQuery<UsePokemonByNameData, UsePokemonByNameVariables>(
    GET_POKEMON,
    options,
  )
}

export default usePokemonByName
