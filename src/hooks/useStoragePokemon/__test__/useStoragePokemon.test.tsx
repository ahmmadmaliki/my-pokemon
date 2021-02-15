import useStoragePokemon from 'hooks/useStoragePokemon/useStoragePokemon'
import { renderHook, act } from '@testing-library/react-hooks'

const mockGetItem = jest.fn()
const mockSetItem = jest.fn()
Storage.prototype.getItem = mockGetItem
Storage.prototype.setItem = mockSetItem

describe('basic function', () => {
  afterEach(() => {
    mockGetItem.mockReset()
    mockSetItem.mockReset()
  })

  test('should add given data to the list', () => {
    // arrange
    const { result } = renderHook(() => useStoragePokemon('anyKey'))
    const data = {
      nickname: 'anyNickname',
      name: 'anyName',
      image: 'anyImageUrl',
    }

    // act
    act(() => result.current.add(data))

    // assert
    expect(result.current.data).toContainEqual(data)
  })

  test('should remove given nickname from the list', () => {
    // arrange
    const { result } = renderHook(() => useStoragePokemon('anyKey'))
    const data = {
      nickname: 'anyNickname',
      name: 'anyName',
      image: 'anyImageUrl',
    }

    // act
    act(() => result.current.add(data))
    act(() => result.current.remove('anyNickname'))

    // assert
    expect(result.current.data).not.toContainEqual(data)
  })

  test('should count owned pokemon initially', () => {
    // arrange
    const name = 'anyName'
    mockGetItem.mockReturnValue(
      JSON.stringify([
        {
          nickname: 'anyNickname',
          name,
          image: 'anyImageUrl',
        },
      ]),
    )
    const { result } = renderHook(() => useStoragePokemon('anyKey'))

    // assert
    expect(result.current.countOwned(name)).toEqual(1)
  })

  test('should increment count owned when added pokemon', () => {
    // arrange
    const name = 'anyName'
    const { result } = renderHook(() => useStoragePokemon('anyKey'))

    // act
    expect(result.current.countOwned(name)).toEqual(0)
    act(() =>
      result.current.add({
        nickname: 'anyNickname',
        name,
        image: 'anyImageUrl',
      }),
    )

    // assert
    expect(result.current.mapOwned.get(name)).toEqual(1)
  })

  test('should decrement count owned when remove/release pokemon', () => {
    // arrange
    const nickname = 'anyNickname'
    mockGetItem.mockReturnValue(
      JSON.stringify([
        {
          nickname,
          name: 'anyName',
          image: 'anyImageUrl',
        },
      ]),
    )
    const { result } = renderHook(() => useStoragePokemon('anyKey'))

    act(() => result.current.remove(nickname))

    // assert
    expect(result.current.countOwned(nickname)).toEqual(0)
  })

  test('should not decrement to minus value when no nickname exist', () => {
    // arrange
    const nickname = 'anyNickname'
    const { result } = renderHook(() => useStoragePokemon('anyKey'))

    act(() => result.current.remove(nickname))

    // assert
    expect(result.current.countOwned(nickname)).toEqual(0)
  })

  test('should throw error when adding nickname that already exist', async () => {
    // arrange
    const nickname = 'anyDuplicateNickname'
    mockGetItem.mockReturnValue(
      JSON.stringify([
        {
          nickname,
          name: 'anyName',
          image: 'anyImageUrl',
        },
      ]),
    )
    const { result } = renderHook(() => useStoragePokemon('anyKey'))

    // assert
    expect(() =>
      result.current.add({
        nickname,
        name: 'anyName',
        image: 'anyImageUrl',
      }),
    ).toThrow('nickname already exist!')
  })
})
