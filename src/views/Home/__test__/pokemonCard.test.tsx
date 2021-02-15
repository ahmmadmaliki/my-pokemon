import { render, screen } from '@testing-library/react'
import mockWindowMatchMedia from 'hooks/useValueBreakpoint/__mocks__/mockWindowMatchMedia'
import PokemonCard from 'views/Home/PokemonCard'
import * as React from 'react'

jest.mock('next/image', () => {
  return () => <div />
})

describe('should render different layout between screen size', () => {
  afterEach(() => mockWindowMatchMedia('lg'))

  test('should render sm view', () => {
    // arrange
    mockWindowMatchMedia('sm')
    render(<PokemonCard name={'anyName'} image={'/anyImage'} />)

    // assert
    screen.getByTestId('cardPokemon')
    expect(screen.queryByTestId('listPokemon')).toBeNull()
  })

  test('should render xs view', () => {
    // arrange
    mockWindowMatchMedia('xs')
    render(<PokemonCard name={'anyName'} image={'/anyImage'} />)

    // assert
    screen.getByTestId('listPokemon')
    expect(screen.queryByTestId('cardPokemon')).toBeNull()
  })
})
