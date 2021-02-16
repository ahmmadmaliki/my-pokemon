import catchPokemon from 'helpers/catchPokemon'

describe('basic function', () => {
  test('should return true if value from Math.random >= 0.5', () => {
    global.Math.random = () => 0.5
    expect(catchPokemon()).toBe(true)
  })

  test('should return true if value from Math.random < 0.5', () => {
    global.Math.random = () => 0.49
    expect(catchPokemon()).toBe(false)
  })
})
