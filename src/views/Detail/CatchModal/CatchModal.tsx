import React, { useEffect } from 'react'
import { Button, Col, Modal, Row } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { UsePokemonByNameData } from 'data/usePokemonByName'
import useToggle from 'hooks/useToggle'
import catchPokemon from 'helpers/catchPokemon'
import SuccessResult from 'views/Detail/CatchModal/partials/SuccessResult'
import FailedResult from 'views/Detail/CatchModal/partials/FailedResult'
import LoadingGacha from 'views/Detail/CatchModal/partials/LoadingGacha'
import { Formik, Form } from 'formik'
import FInput from 'fields/FInput/FInput'
import FormNickname from 'views/Detail/CatchModal/partials/FormNickname'

type CatchModalProps = ModalProps & {
  data?: UsePokemonByNameData
}

export const GACHA_TIMEOUT = 2000

const toggleStateConfig = {
  initialState: {
    title: 'Catching Pokemon...',
    isFinish: false,
    isLoading: true,
    isCatchedPokemon: false,
  },
}

const StateCatching = () => useToggle(toggleStateConfig)

export const ContextCatchModal = React.createContext<{
  props: CatchModalProps
  stateCatching: ReturnType<typeof StateCatching>
}>({} as any)

function CatchModal(props: CatchModalProps) {
  const { visible, onCancel } = props

  const stateCatching = useToggle(toggleStateConfig)

  const { title, isCatchedPokemon, isFinish, isLoading } = stateCatching.state

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const isCatchedPokemon = catchPokemon()
        stateCatching.toggle({
          title: isCatchedPokemon
            ? 'Yeay you got it :D'
            : 'Failed to catch Pokemon :(',
          isFinish: true,
          isLoading: false,
          isCatchedPokemon,
        })
      }, GACHA_TIMEOUT)
    }

    return () => {
      stateCatching.reset()
    }
  }, [visible])

  return (
    <ContextCatchModal.Provider
      value={{
        props,
        stateCatching,
      }}
    >
      <Modal
        title={title}
        footer={null}
        closable={false}
        destroyOnClose
        maskClosable={isFinish}
        {...props}
      >
        <div data-testid={'modalPokemon'} />
        {isLoading && <LoadingGacha data-testid={'loading'} />}

        {isFinish && isCatchedPokemon && (
          <Row>
            <Col xs={24}>
              <SuccessResult data-testid={'successResult'} />
            </Col>
            <Col xs={24}>
              <FormNickname />
            </Col>
          </Row>
        )}

        {isFinish && !isCatchedPokemon && (
          <Row>
            <Col xs={24}>
              <FailedResult data-testid={'failedResult'} />
            </Col>
            <Col xs={24} style={{ textAlign: 'end' }}>
              <Button type={'primary'} size={'large'} onClick={onCancel}>
                OK
              </Button>
            </Col>
          </Row>
        )}
      </Modal>
    </ContextCatchModal.Provider>
  )
}
export default CatchModal
