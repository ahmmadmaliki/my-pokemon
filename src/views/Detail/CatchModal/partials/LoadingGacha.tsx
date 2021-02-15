import React from 'react'
import AnimationSpring from 'components/AnimationSpring/AnimationSpring'
import Pokeball from 'components/Pokeball/Pokeball'

function LoadingGacha(props) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 50,
      }}
      {...props}
    >
      <AnimationSpring>
        <Pokeball
          style={{
            fontSize: 100,
          }}
        />
      </AnimationSpring>
    </div>
  )
}

export default LoadingGacha
