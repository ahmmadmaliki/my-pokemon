import React from 'react'
import Content from 'components/Content/Content'
import { Col, Row } from 'antd'
import Text from 'components/Typography/Text'
import { HEIGHT_FOOTER } from 'layouts/containers/Public/index'

function Footer() {
  return (
    <Content
      id={'contributors'}
      component={(props) => <footer {...props} />}
      style={{
        padding: 16,
        color: 'white',
      }}
      styleContainer={{
        minHeight: HEIGHT_FOOTER,
        backgroundColor: 'black',
      }}
    >
      <Row gutter={[0, 16]}>
        <Col xs={24}>
          <div style={{ marginBottom: 10 }}>
            <Text size={16}>Created By: Muhammad Syafaat</Text>
          </div>
          <a
            href={'https://github.com/chornos13'}
            rel="noreferrer"
            target={'_blank'}
          >
            <img
              src={'https://avatars1.githubusercontent.com/u/20974979'}
              alt={'logo'}
              style={{ maxWidth: 40, borderRadius: '50%' }}
            />
          </a>
        </Col>
      </Row>
    </Content>
  )
}

export default Footer
