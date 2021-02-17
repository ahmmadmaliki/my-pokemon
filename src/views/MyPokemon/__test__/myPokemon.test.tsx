import { render, screen } from '@testing-library/react'
import MyPokemon from 'views/MyPokemon/MyPokemon'
import useStoragePokemon from 'hooks/useStoragePokemon/useStoragePokemon'
import ContextContainer from 'layouts/containers/Public/ContextContainer'
import mockWindowMatchMedia from 'hooks/useValueBreakpoint/__mocks__/mockWindowMatchMedia'

mockWindowMatchMedia('lg')
jest.mock('layouts/containers/Public/Header/Header', () => {
  return {
    __esModule: true,
    useHeader: jest.fn(),
  }
})

jest.mock('hooks/useStoragePokemon/useStoragePokemon')
jest.mock('next/image', () => {
  return (props: any) => <img {...props} alt={'anyAlt'} />
})
jest.mock('next/link', () => {
  return (props) => <div {...props} />
})

const mockUseStoragePokemon = useStoragePokemon as jest.Mock<
  Partial<ReturnType<typeof useStoragePokemon>>
>

const MockContext = ({ children }: any) => {
  const storagePokemon = useStoragePokemon('anyKey')
  return (
    <ContextContainer.Provider
      value={{
        storagePokemon,
      }}
    >
      {children}
    </ContextContainer.Provider>
  )
}

describe('basic render', () => {
  test('should render empty view when no pokemon added', async () => {
    mockUseStoragePokemon.mockImplementation(() => {
      return {
        data: [],
      }
    })

    render(
      <MockContext>
        <MyPokemon />
      </MockContext>,
    )

    await screen.findByTestId('emptyView')
  })

  test('should render item pokemon', async () => {
    const image = 'anyImageUrl'
    const name = 'anyName'
    const nickname = 'anyNickname'
    mockUseStoragePokemon.mockImplementation(() => {
      return {
        data: [
          {
            image,
            name,
            nickname,
          },
        ],
        countOwned: () => 1,
      }
    })

    render(
      <MockContext>
        <MyPokemon />
      </MockContext>,
    )

    await screen.findByText(name)
    await screen.findByText(nickname)
    await screen.findByText('Owned: 1')
  })
})
