import React from 'react'
import Content from 'components/Content/Content'
import { useHeader } from 'layouts/containers/Public/Header/Header'

function MyPokemon() {
  useHeader({
    title: 'My Pokemon',
  })

  return <Content>My Pokemon</Content>
}

export default MyPokemon
