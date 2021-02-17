import { render, screen, waitFor } from '@testing-library/react'
import mockWindowMatchMedia from 'hooks/useValueBreakpoint/__mocks__/mockWindowMatchMedia'
import PokemonCard from 'components/PokemonCard/index'
import * as React from 'react'
import userEvent from '@testing-library/user-event'

jest.mock('next/image', () => {
  return () => <div />
})

jest.mock('hooks/useStoragePokemon/useStoragePokemon')

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

  test('should render xs view with nickname', async () => {
    // arrange
    mockWindowMatchMedia('xs')
    const nickname = 'anyNickname'
    const name = 'anyName'
    const image = '/anyImage'
    render(<PokemonCard nickname={nickname} name={name} image={image} />)

    // assert
    await screen.findByTestId('listPokemon')
    await screen.findByText(nickname)
    await screen.findByText(name)
  })

  test('should render sm view with nickname', async () => {
    // arrange
    mockWindowMatchMedia('sm')
    const nickname = 'anyNickname'
    const name = 'anyName'
    const image = '/anyImage'
    render(<PokemonCard nickname={nickname} name={name} image={image} />)

    // assert
    await screen.findByTestId('cardPokemon')
    await screen.findByText(nickname)
    await screen.findByText(name)
  })

  test('should only show button release when passing prop nickname in sm view', async () => {
    // arrange
    mockWindowMatchMedia('sm')
    const nickname = 'anyNickname'
    const name = 'anyName'
    const image = '/anyImage'
    const { rerender } = render(<PokemonCard name={name} image={image} />)

    // assert
    expect(screen.queryByTestId('buttonRelease')).toBeNull()

    rerender(<PokemonCard nickname={nickname} name={name} image={image} />)
    await screen.findByTestId('buttonRelease')
  })

  test('should only show button release when passing prop nickname in xs view', async () => {
    // arrange
    mockWindowMatchMedia('xs')
    const nickname = 'anyNickname'
    const name = 'anyName'
    const image = '/anyImage'
    const { rerender } = render(<PokemonCard name={name} image={image} />)

    // assert
    expect(screen.queryByTestId('buttonRelease')).toBeNull()

    rerender(<PokemonCard nickname={nickname} name={name} image={image} />)
    await screen.findByTestId('buttonRelease')
  })

  test('should show confirm modal when click release button', async () => {
    // arrange
    const nickname = 'anyNickname'
    const name = 'anyName'
    const image = '/anyImage'
    render(<PokemonCard nickname={nickname} name={name} image={image} />)

    userEvent.click(screen.getByTestId('buttonRelease'))

    // assert
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toHaveTextContent(
        'Do you want to release',
      ),
    )
  })
})
