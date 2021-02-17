import React, { useContext } from 'react'
import { Form, Formik, FormikConfig } from 'formik'
import { Button, Col, Row } from 'antd'
import FInput from 'fields/FInput/FInput'
import { ContextCatchModal } from 'views/Detail/CatchModal/CatchModal'
import ContextContainer from 'layouts/containers/Public/ContextContainer'
import { schemaPokemon } from 'hooks/useStoragePokemon/useStoragePokemon'

type FormNickname = Partial<FormikConfig<{ nickname: string }>>

function FormNickname(props: FormNickname) {
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
          ctxCatchModal.props.onCancel(null)
        } catch (e) {
          formikHelpers.setFieldError('nickname', e.message)
        }
      }}
      {...props}
    >
      {({ handleSubmit }) => {
        return (
          <Form data-testid={'form'} onSubmit={handleSubmit}>
            <div style={{ color: 'green' }}>Give the Pokemon a nickname</div>
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
                    <Button data-testid={'cancel'} danger type={'primary'}>
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
          </Form>
        )
      }}
    </Formik>
  )
}

export default FormNickname
