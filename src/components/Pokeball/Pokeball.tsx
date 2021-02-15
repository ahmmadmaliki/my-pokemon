import svgPokeball from 'components/Pokeball/pokeball.svg'
import Icon, { IconComponentProps } from '@ant-design/icons/lib/components/Icon'

const Pokeball = (props: IconComponentProps | any) => {
  return <Icon component={svgPokeball} {...props} />
}

export default Pokeball
