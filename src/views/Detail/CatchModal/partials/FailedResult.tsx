import React from 'react'
import FrownOutlined from '@ant-design/icons/FrownOutlined'
import { Result } from 'antd'

function FailedResult(props) {
  return (
    <div {...props}>
      <Result icon={<FrownOutlined />} title="Try again later" />
    </div>
  )
}

export default FailedResult
