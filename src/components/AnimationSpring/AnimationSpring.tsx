import { animated, useSpring } from 'react-spring'

const interp = (i) => (r) =>
  `translate3d(0, ${15 * Math.sin(r + (i * 2 * Math.PI) / 1.6)}px, 0)`

function AnimationSpring(props) {
  const { radians } = useSpring<any>({
    to: async (next) => {
      for (let i = 0; i < 999; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await next({ radians: 2 * Math.PI })
      }
    },
    from: { radians: 0 },
    config: { duration: 200 },
    reset: true,
  })

  return (
    <animated.div
      style={{ transform: radians.interpolate(interp(0)) }}
      {...props}
    />
  )
}

export default AnimationSpring
