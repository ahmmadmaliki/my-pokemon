import React, { useContext, useMemo } from 'react'
import { Card, Skeleton, List } from 'antd'
import Image from 'next/image'
import { CardProps } from 'antd/lib/card'
import { css } from '@emotion/react'
import useValueBreakpoint from 'hooks/useValueBreakpoint'
import { ContextContainer } from 'layouts/containers/Public'

type PokemonCardProps = {
  name: string
  image: string
} & CardProps

const cssList = css`
  .ant-list-item-meta-content {
    align-self: center;
  }
  .ant-list-item-meta-avatar {
    width: 100px;
    height: 100px;
  }
`

function PokemonCard(props: PokemonCardProps) {
  const { name, image, loading, ...restProps } = props
  const { storagePokemon } = useContext(ContextContainer)
  const { value: isExtraSmall } = useValueBreakpoint({
    xs: true,
    sm: false,
  })

  const owned = `Owned: ${storagePokemon?.countOwned(name)}`

  const elImage = useMemo(() => {
    return (
      image && (
        <Image
          alt={name}
          src={image}
          layout={'responsive'}
          width={400}
          height={400}
        />
      )
    )
  }, [name, image])

  return useMemo(() => {
    if (isExtraSmall) {
      const skeletonText = (
        <Skeleton title={false} paragraph={{ rows: 1 }} active />
      )
      return (
        <List.Item.Meta
          css={cssList}
          avatar={loading ? <Skeleton.Image /> : <div>{elImage}</div>}
          title={loading ? skeletonText : name}
          description={loading ? skeletonText : owned}
          data-testid={'listPokemon'}
        />
      )
    }

    return (
      <Card
        data-testid={'cardPokemon'}
        {...restProps}
        loading={loading}
        cover={
          loading ? (
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <Skeleton.Image />
            </div>
          ) : (
            elImage
          )
        }
        hoverable
      >
        <Card.Meta title={name} description={owned} />
      </Card>
    )
  }, [name, loading, owned, isExtraSmall])
}

export default PokemonCard
