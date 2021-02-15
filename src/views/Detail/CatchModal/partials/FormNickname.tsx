import React, { useContext } from 'react'
import { Form, Formik } from 'formik'
import { Button, Col, Row } from 'antd'
import FInput from 'fields/FInput/FInput'
import { ContextCatchModal } from 'views/Detail/CatchModal/CatchModal'
import { ContextContainer } from 'layouts/containers/Public'
import {try} from "q";

function FormNickname() {
  const ctxContainer = useContext(ContextContainer)
  const ctxCatchModal = useContext(ContextCatchModal)

  return (
    <Formik
      initialValues={{
        nickname: '',
      }}
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
    >
      {() => {
        return (
          <Form>
            <div style={{ color: 'green' }}>Give the Pokemon a nickname</div>
            <Row gutter={[0, 10]}>
              <Col xs={24}>
                <FInput title={'Nickname'} name={'nickname'} />
              </Col>
              <Col xs={24} style={{ textAlign: 'end' }}>
                <Button htmlType={'submit'} type={'primary'}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        )
      }}
    </Formik>
  )
}

export default FormNickname
