import React, { useContext, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '@react-hook/window-size'
import Image from 'next/image'
import { ContextCatchModal } from 'views/Detail/CatchModal/CatchModal'
import Title from 'components/Typography/Title'

function SuccessResult(props) {
  const ctxCatchModal = useContext(ContextCatchModal)
  const [isShowConffeti, setIsShowConfetti] = useState(true)
  const [windowWidth, windowHeight] = useWindowSize()

  const { sprites, name } = { ...ctxCatchModal?.props?.data?.pokemon }

  useEffect(() => {
    setTimeout(() => {
      setIsShowConfetti(false)
    }, 3000)
  }, [])

  return (
    <div {...props}>
      <Confetti
        width={windowWidth}
        height={windowHeight}
        numberOfPieces={isShowConffeti ? 200 : 0}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      />

      {sprites && (
        <div style={{ textAlign: 'center' }}>
          <div>
            <Image
              src={sprites.front_default}
              width={200}
              height={130}
              objectFit={'cover'}
            />
          </div>
          <div>
            <Title>{name}</Title>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuccessResult
