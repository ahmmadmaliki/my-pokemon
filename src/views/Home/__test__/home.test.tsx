import { render, screen, act, fireEvent } from '@testing-library/react'
import Home from 'views/Home/Home'
import * as React from 'react'
import mockWindowMatchMedia from 'hooks/useValueBreakpoint/__mocks__/mockWindowMatchMedia'
import mockWrapperLayout from 'layouts/__mocks__/mockWrapperLayout'
import { GET_POKEMONS } from 'data/usePokemons'

jest.mock('next/image', () => {
  return () => <div />
})

mockWindowMatchMedia('lg')

const TOTAL_FETCH_ITEM = 15

function mockSuccessData(extraData?: any) {
  return {
    request: {
      query: GET_POKEMONS,
      variables: { limit: TOTAL_FETCH_ITEM, offset: 0 },
    },
    result: {
      data: {
        pokemons: {
          ...extraData,
          results: Array(TOTAL_FETCH_ITEM).fill({
            image: '/anyUrlImage',
            name: 'Pokemon',
          }),
        },
      },
    },
  }
}

describe('basic render', () => {
  afterEach(async () => {
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
  })

  test('should render loading state initially', async () => {
    // arrange
    render(
      mockWrapperLayout(<Home />, {
        mocks: [],
      }),
    )

    // assert
    const els = screen.getAllByTestId('itemLoading')
    expect(els.length).toBe(TOTAL_FETCH_ITEM)
  })

  test('should hide load more button initially', async () => {
    // arrange
    render(
      mockWrapperLayout(<Home />, {
        mocks: [],
      }),
    )

    // assert
    const el = screen.queryByTestId('loadMore')
    expect(el).toBeNull()
  })

  test('should enabled load more button after load', async () => {
    // arrange
    render(
      mockWrapperLayout(<Home />, {
        mocks: [mockSuccessData()],
      }),
    )

    // act
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // assert
    const el = screen.getByTestId('loadMore')
    expect(el).toBeEnabled()
  })

  test('should hide load more button if next data is null', async () => {
    // arrange
    render(
      mockWrapperLayout(<Home />, {
        mocks: [
          mockSuccessData({
            next: null,
          }),
        ],
      }),
    )

    // act
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // assert
    const el = await screen.queryByTestId('loadMore')
    expect(el).toBeNull()
  })

  test('should render item after success load', async () => {
    // arrange
    render(
      mockWrapperLayout(<Home />, {
        mocks: [mockSuccessData()],
      }),
    )

    // act
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // assert
    const els = screen.getAllByTestId('itemPokemon')
    expect(els.length).toBe(TOTAL_FETCH_ITEM)
  })

  test('should render error view if fetch error', async () => {
    // arrange
    const errorMessage = 'any error message'
    render(
      mockWrapperLayout(<Home />, {
        mocks: [
          {
            request: {
              query: GET_POKEMONS,
              variables: { limit: TOTAL_FETCH_ITEM, offset: 0 },
            },
            error: new Error(errorMessage),
          },
        ],
      }),
    )

    // act
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // assert
    const el = screen.getByTestId('errorView')
    expect(el).toBeTruthy()
  })

  test('should show error notification when failed load on clicked button load more', async () => {
    // arrange
    render(
      mockWrapperLayout(<Home />, {
        mocks: [
          {
            request: {
              query: GET_POKEMONS,
              variables: { limit: TOTAL_FETCH_ITEM, offset: 0 },
            },
            result: mockSuccessData().result,
          },
        ],
      }),
    )

    // act
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    fireEvent.click(screen.getByTestId('loadMore'))

    const notificaiton = await screen.findByRole('alert')

    // assert
    expect(notificaiton).toHaveTextContent('Error')
  })
})
