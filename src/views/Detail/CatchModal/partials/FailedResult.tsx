import React from 'react'
import FrownOutlined from '@ant-design/icons/FrownOutlined'
import { Result } from 'antd'

function FailedResult(props) {
  return (
    <div {...props}>
      <Result
        icon={<FrownOutlined />}
        title={"Yah gagal menangkap pokemon :'("}
      />
    </div>
  )
}

export default FailedResult
