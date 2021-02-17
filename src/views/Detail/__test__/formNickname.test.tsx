import FormNickname from 'views/Detail/CatchModal/partials/FormNickname'
import { render, screen, waitFor } from '@testing-library/react'
import mockWindowMatchMedia from 'hooks/useValueBreakpoint/__mocks__/mockWindowMatchMedia'
import ContextContainer from 'layouts/containers/Public/ContextContainer'
import {
  ContextCatchModal,
  toggleStateConfig,
} from 'views/Detail/CatchModal/CatchModal'
import useStoragePokemon from 'hooks/useStoragePokemon/useStoragePokemon'
import useToggle from 'hooks/useToggle'
import userEvent from '@testing-library/user-event'

mockWindowMatchMedia('lg')

const mockAdd = jest.fn()
const mockCancelModal = jest.fn()

function createArrPokemon(type: 'move' | 'type', data: string[]) {
  return data.map((value) => {
    return {
      [type]: {
        name: value,
      },
    }
  })
}

function createMoves(data: string[]) {
  return createArrPokemon('move', data) as { move: { name: string } }[]
}

function createTypes(data: string[]) {
  return createArrPokemon('type', data) as { type: { name: string } }[]
}

const MockContext = ({ children }: any) => {
  const storagePokemon = useStoragePokemon('anyKey')
  const stateCatching = useToggle(toggleStateConfig)
  return (
    <ContextContainer.Provider
      value={{
        storagePokemon: {
          ...storagePokemon,
          add: mockAdd,
        },
      }}
    >
      <ContextCatchModal.Provider
        value={{
          stateCatching,
          props: {
            data: {
              pokemon: {
                // any number
                id: 1,
                name: 'anyName',
                moves: createMoves(['anyMoves']),
                types: createTypes(['anyTypes']),
                sprites: {
                  front_default: '/anyImageUrl',
                },
              },
            },
            onCancel: mockCancelModal,
          },
        }}
      >
        {children}
      </ContextCatchModal.Provider>
    </ContextContainer.Provider>
  )
}

describe('basic form submit', () => {
  beforeEach(() => {
    mockAdd.mockReset()
  })
  test('should submit submitting a basic form', async () => {
    render(
      <MockContext>
        <FormNickname />
      </MockContext>,
    )

    const elNickName = screen.getByTestId('nickname')
    userEvent.type(elNickName, 'anyNickname')
    userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() =>
      expect(mockAdd).toBeCalledWith({
        image: '/anyImageUrl',
        name: 'anyName',
        nickname: 'anyNickname',
      }),
    )
  })

  test('should validation error nickname is required!, when nickname is empty', async () => {
    render(
      <MockContext>
        <FormNickname />
      </MockContext>,
    )

    userEvent.type(screen.getByTestId('nickname'), '')
    userEvent.click(screen.getByTestId('submit'))

    await screen.findByText('nickname is required!')
  })

  test('should show error when add/save pokemon fail', async () => {
    mockAdd.mockImplementation(() => {
      throw new Error('anyErrorMessage')
    })
    render(
      <MockContext>
        <FormNickname />
      </MockContext>,
    )

    userEvent.type(screen.getByTestId('nickname'), 'anyName')
    userEvent.click(screen.getByTestId('submit'))

    await screen.findByText('anyErrorMessage')
  })
})
