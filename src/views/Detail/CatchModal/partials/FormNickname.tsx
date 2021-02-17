import React, { useContext, useState } from 'react'
import { Form, Formik, FormikConfig } from 'formik'
import { Button, Col, Result, Row } from 'antd'
import FInput from 'fields/FInput/FInput'
import { ContextCatchModal } from 'views/Detail/CatchModal/CatchModal'
import ContextContainer from 'layouts/containers/Public/ContextContainer'
import { schemaPokemon } from 'hooks/useStoragePokemon/useStoragePokemon'
import Link from 'next/link'
import { cssBlackButton } from 'layouts/containers/Public/Header/Header'

type FormNickname = Partial<FormikConfig<{ nickname: string }>>

function FormNickname(props: FormNickname) {
  const [isSuccess, setIsSuccess] = useState(false)
  const ctxContainer = useContext(ContextContainer)
  const ctxCatchModal = useContext(ContextCatchModal)

  return (
    <Formik
      initialValues={{
        nickname: '',
      }}
      validationSchema={schemaPokemon}
      onSubmit={({ nickname }, formikHelpers) => {
        const { pokemon } = ctxCatchModal.props.data
        try {
          ctxContainer.storagePokemon.add({
            nickname,
            name: pokemon.name,
            image: pokemon.sprites.front_default,
          })
          setIsSuccess(true)
        } catch (e) {
          formikHelpers.setFieldError('nickname', e.message)
        }
      }}
      {...props}
    >
      {({ handleSubmit }) => {
        return (
          <Form data-testid={'form'} onSubmit={handleSubmit}>
            {!isSuccess && (
              <React.Fragment>
                <div style={{ color: 'green' }}>
                  Give the Pokemon a nickname
                </div>
                <Row gutter={[0, 10]}>
                  <Col xs={24}>
                    <FInput
                      data-testid={'nickname'}
                      title={'Nickname'}
                      name={'nickname'}
                    />
                  </Col>
                  <Col xs={24} style={{ textAlign: 'end' }}>
                    <Row justify={'end'} gutter={[10, 0]}>
                      <Col>
                        <Button
                          data-testid={'cancel'}
                          danger
                          type={'primary'}
                          onClick={ctxCatchModal.props.onCancel}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          data-testid={'submit'}
                          htmlType={'submit'}
                          type={'primary'}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </React.Fragment>
            )}

            {isSuccess && (
              <div data-testid={'successView'}>
                <Result
                  status="success"
                  title="Successfully added Pokemon"
                  extra={[
                    <div
                      css={cssBlackButton}
                      style={{ display: 'inline-block' }}
                      key={'goToPokemonList'}
                    >
                      <Link href={'/my-pokemon'}>
                        <a id={'containerButton'}>
                          <Button type="primary" key="goToPokemonList">
                            Go to My Pokemon
                          </Button>
                        </a>
                      </Link>
                    </div>,
                    <Button onClick={ctxCatchModal.props.onCancel} key="close">
                      Close
                    </Button>,
                  ]}
                />
              </div>
            )}
          </Form>
        )
      }}
    </Formik>
  )
}

export default FormNickname
