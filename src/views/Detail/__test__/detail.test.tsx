import { render, screen, act, fireEvent } from '@testing-library/react'
import Detail from 'views/Detail/Detail'
import * as React from 'react'
import mockWindowMatchMedia from 'hooks/useValueBreakpoint/__mocks__/mockWindowMatchMedia'
import mockWrapperLayout from 'layouts/__mocks__/mockWrapperLayout'
import { GET_POKEMON, UsePokemonByNameData } from 'data/usePokemonByName'

const POKEMON_NAME = 'anyPokemonName'

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      name: POKEMON_NAME,
    },
  }),
}))

jest.mock('react-confetti', () => {
  return () => <div />
})

mockWindowMatchMedia('lg')

function mockSuccessData(extraData?: UsePokemonByNameData) {
  return {
    request: {
      query: GET_POKEMON,
      variables: { name: POKEMON_NAME },
    },
    result: {
      data: {
        pokemon: {
          id: 1,
          name: POKEMON_NAME,
          sprites: {
            front_default: '/anyImage',
          },
          moves: [
            {
              move: {
                name: 'anyMove1',
              },
            },
            {
              move: {
                name: 'anyMoveOthers',
              },
            },
          ],
          types: [
            {
              type: {
                name: 'anyType1',
              },
            },
            {
              type: {
                name: 'anyTypeOthers',
              },
            },
          ],
        },
        ...extraData,
      },
    },
  }
}

describe('basic render', () => {
  afterEach(async () => {
    /*
     remove warning Can't perform a React state update on an unmounted component
     image component
     */
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
  })

  test('should render loading state initially', async () => {
    // arrange
    render(
      mockWrapperLayout(<Detail />, {
        mocks: [],
      }),
    )

    // assert
    screen.getByTestId('loading')
    expect(screen.queryByTestId('item')).toBeNull()
  })

  test('should render error when failed to fetch', async () => {
    // arrange
    const message = 'any error message'
    render(
      mockWrapperLayout(<Detail />, {
        mocks: [
          {
            request: mockSuccessData().request,
            error: new Error(message),
          },
        ],
      }),
    )

    // act
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // assert
    expect(screen.getByTestId('errorView')).toHaveTextContent(message)
  })

  test('should render data item properly', async () => {
    // arrange
    const mockData = mockSuccessData()
    render(
      mockWrapperLayout(<Detail />, {
        mocks: [mockData],
      }),
    )

    // act
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // assert
    const { pokemon } = mockData.result.data
    screen.getByText(pokemon.name)
    screen.getByText('anyType1, anyTypeOthers')
    screen.getByText('anyMove1, anyMoveOthers')
  })

  test('should show modal when click catch', async () => {
    // arrange
    const mockData = mockSuccessData()
    render(
      mockWrapperLayout(<Detail />, {
        mocks: [mockData],
      }),
    )

    // act
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
    fireEvent.click(screen.getByTestId('buttonCatch'))

    // assert
    await screen.findByTestId('modalPokemon')
  })

  test('should render not found result if pokemon name null', async () => {
    // arrange
    const mockData = mockSuccessData({
      pokemon: {
        id: null,
        moves: null,
        name: null,
        sprites: null,
        types: null,
      },
    })
    render(
      mockWrapperLayout(<Detail />, {
        mocks: [mockData],
      }),
    )

    // assert
    await screen.findByTestId('notFoundView')
  })
})
