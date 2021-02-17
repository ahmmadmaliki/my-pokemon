import React, { useContext, useMemo } from 'react'
import { Card, Skeleton, List, Button, Modal } from 'antd'
import Image from 'next/image'
import { CardProps } from 'antd/lib/card'
import { css } from '@emotion/react'
import useValueBreakpoint from 'hooks/useValueBreakpoint'
import ContextContainer from 'layouts/containers/Public/ContextContainer'
import Title from 'components/Typography/Title'
import Text from 'components/Typography/Text'
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined'

type PokemonCardProps = {
  nickname?: string
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
  const { nickname, name, image, loading, ...restProps } = props
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
  }, [nickname, name, image])

  return useMemo(() => {
    const title = (
      <div>
        <Title noMargin style={{ whiteSpace: 'nowrap' }}>
          {nickname}
        </Title>
        <Text style={{ whiteSpace: 'nowrap' }}>{name}</Text>
      </div>
    )

    const buttonRelease = nickname && (
      <Button
        danger
        type={'primary'}
        data-testid={'buttonRelease'}
        onClick={(event) => {
          event.preventDefault()
          Modal.confirm({
            title: `Do you want to release '${name}' with nickname '${nickname}'?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
              storagePokemon.remove(nickname)
            },
            onCancel() {},
          })
        }}
      >
        Release
      </Button>
    )

    const elOwned = (
      <div style={{ marginBottom: 5, whiteSpace: 'nowrap' }}>{owned}</div>
    )

    if (isExtraSmall) {
      const skeletonText = (
        <Skeleton title={false} paragraph={{ rows: 1 }} active />
      )
      return (
        <List.Item.Meta
          css={cssList}
          avatar={loading ? <Skeleton.Image /> : <div>{elImage}</div>}
          title={loading ? skeletonText : title}
          description={
            loading ? (
              skeletonText
            ) : (
              <div>
                {elOwned}
                <div>{buttonRelease}</div>
              </div>
            )
          }
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
        actions={buttonRelease && [buttonRelease]}
        hoverable
      >
        <Card.Meta title={title} description={elOwned} />
      </Card>
    )
  }, [nickname, name, loading, owned, isExtraSmall])
}

export default PokemonCard
