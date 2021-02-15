import React from 'react'
import Content from 'components/Content/Content'
import { useHeader } from 'layouts/containers/Public/Header/Header'
import { useRouter } from 'next/router'
import usePokemonByName, { UsePokemonByNameData } from 'data/usePokemonByName'
import Image from 'next/image'
import Title from 'components/Typography/Title'
import { Button, Descriptions, Result } from 'antd'
import Pokeball from 'components/Pokeball/Pokeball'
import useToggle from 'hooks/useToggle'
import CatchModal from 'views/Detail/CatchModal/CatchModal'
import Link from 'next/link'

function reduceName(key: string) {
  return (acc, curVal) => {
    const { name } = curVal[key]
    if (acc) {
      return `${acc}, ${name}`
    }
    return name
  }
}

function Detail() {
  const router = useRouter()
  const stateModalPokemon = useToggle<UsePokemonByNameData>()

  useHeader({
    title: 'Detail Pokemon',
  })

  const { name: pokemonNameId } = router.query as { name: string }

  const { loading, error, data } = usePokemonByName({
    variables: {
      name: pokemonNameId,
    },
  })

  const { name, sprites, types, moves } = { ...data?.pokemon }
  const srcImage = sprites?.front_default

  if (error) {
    return (
      <Content data-testid={'errorView'}>
        <Result status="error" title="Error" subTitle={error.message} />
      </Content>
    )
  }

  if (loading) {
    return <Content data-testid={'loading'}>Loading...</Content>
  }

  if (!name) {
    return (
      <Content data-testid={'notFoundView'}>
        <Result
          status="404"
          title="404"
          subTitle="Pokemon not found"
          extra={
            <Link href={'/'}>
              <a>
                <Button type="primary">Back to Pokemon List</Button>
              </a>
            </Link>
          }
        />
      </Content>
    )
  }

  return (
    <div>
      <Content
        data-testid={'item'}
        style={{
          position: 'relative',
          paddingBottom: 30,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {srcImage && <Image src={srcImage} width={300} height={300} />}
        </div>
        <div style={{ paddingBottom: 20 }}>
          <Descriptions layout="vertical" column={1} bordered>
            <Descriptions.Item label="Name">
              <Title>{name}</Title>
            </Descriptions.Item>
            <Descriptions.Item label="Types">
              {types?.reduce(reduceName('type'), '')}
            </Descriptions.Item>
            <Descriptions.Item label="Moves">
              {moves?.reduce(reduceName('move'), '')}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div
          style={{
            position: 'sticky',
            bottom: 20,
            textAlign: 'end',
          }}
        >
          <Button
            type={'primary'}
            size={'large'}
            icon={<Pokeball />}
            data-testid={'buttonCatch'}
            onClick={() => stateModalPokemon.toggle(data)}
          >
            Catch
          </Button>
        </div>
      </Content>

      <CatchModal
        data={stateModalPokemon.state}
        visible={stateModalPokemon.isToggled}
        onCancel={() => stateModalPokemon.untoggle()}
      />
    </div>
  )
}

export default Detail
