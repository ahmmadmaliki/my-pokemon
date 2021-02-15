import { act, render, screen } from '@testing-library/react'
import CatchModal from 'views/Detail/CatchModal/CatchModal'
import catchPokemon from 'helpers/catchPokemon'
import mockWindowMatchMedia from 'hooks/useValueBreakpoint/__mocks__/mockWindowMatchMedia'

jest.mock('react-confetti', () => {
  return () => <div />
})

jest.mock('helpers/catchPokemon')
const mockCatchPokemon = (catchPokemon as unknown) as jest.Mock<
  ReturnType<typeof catchPokemon>
>

mockWindowMatchMedia('lg')

const initialTitle = 'Catching Pokemon...'
describe('basic render', () => {
  afterEach(() => mockCatchPokemon.mockReset())

  test('should have title Catching Pokemon initially', async () => {
    // arrange
    const { rerender } = render(<CatchModal />)
    expect(screen.queryByText(initialTitle)).toBeNull()

    // act
    rerender(<CatchModal visible />)

    // assert
    await screen.getByText(initialTitle)
  })

  test('should have running Gacha every visible', () => {
    // arrange
    jest.useFakeTimers()
    const { rerender } = render(<CatchModal />)

    // assert
    expect(screen.queryByText(initialTitle)).toBeNull()

    rerender(<CatchModal visible />)
    screen.getByText(initialTitle)
    act(() => jest.runAllTimers()) // run gacha to finish so title will changed to result title

    rerender(<CatchModal />)
    expect(screen.queryByText(initialTitle)).toBeNull()

    rerender(<CatchModal visible />)
  })

  test('should only show loading while catching pokemon', async () => {
    // arrange
    jest.useFakeTimers()
    render(<CatchModal visible />)

    // act
    mockCatchPokemon.mockReturnValue(false)
    await screen.findByTestId('loading')
    act(() => jest.runAllTimers())

    // assert
    expect(screen.queryByTestId('loading')).toBeNull()
  })

  test('should show result failed if pokemon failed to catch', async () => {
    // arrange
    jest.useFakeTimers()
    const { rerender } = render(<CatchModal visible />)

    // act
    mockCatchPokemon.mockReturnValue(false)
    act(() => jest.runAllTimers())

    // assert
    await screen.findByTestId('failedResult')

    // act
    rerender(<CatchModal />)
    rerender(<CatchModal visible />)
    mockCatchPokemon.mockReturnValue(true)
    act(() => jest.runAllTimers())

    // assert
    expect(screen.queryByTestId('failedResult')).toBeNull()
  })

  test('should show result success if pokemon success to catch', async () => {
    // arrange
    jest.useFakeTimers()
    const { rerender } = render(<CatchModal visible />)

    // act
    mockCatchPokemon.mockReturnValue(true)
    act(() => jest.runAllTimers())

    // assert
    await screen.findByTestId('successResult')

    // act
    rerender(<CatchModal />)
    rerender(<CatchModal visible />)
    mockCatchPokemon.mockReturnValue(false)
    act(() => jest.runAllTimers())

    // assert
    expect(screen.queryByTestId('successResult')).toBeNull()
  })
})
