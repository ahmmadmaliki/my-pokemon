import SuccessResult from 'views/Detail/CatchModal/partials/SuccessResult'
import { screen, render, act } from '@testing-library/react'

jest.mock('react-confetti', () => {
  // eslint-disable-next-line react/prop-types
  return ({ numberOfPieces, ...restProps }) => (
    <div
      data-testid={'confetti'}
      // @ts-ignore
      numberofpieces={numberOfPieces}
      {...restProps}
    />
  )
})

describe('basic render', () => {
  test('should show confetti and hide after 3s', async () => {
    // arrange
    jest.useFakeTimers()
    render(<SuccessResult />)
    const initConfetti = await screen.findByTestId('confetti')
    expect(initConfetti.getAttribute('numberofpieces')).toEqual('200')

    // act
    act(() => jest.advanceTimersByTime(3000))

    // assert
    expect(initConfetti.getAttribute('numberofpieces')).toEqual('0')
  })
})
