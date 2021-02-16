import React, { useMemo } from 'react'
import Content from 'components/Content/Content'
import { useHeader } from 'layouts/containers/Public/Header/Header'
import { List, Button, notification } from 'antd'
import useValueBreakpoint from 'hooks/useValueBreakpoint'
import Link from 'next/link'
import PokemonCard from 'components/PokemonCard'
import usePokemons from 'data/usePokemons'
import { useWindowWidth } from '@react-hook/window-size'

const TOTAL_FETCH = 15

function Home() {
  useHeader({
    title: 'Pokemon',
  })

  const width = useWindowWidth()

  const { fetchMore, data, variables, loading, error } = usePokemons({})

  const breakpointColumn = useValueBreakpoint({
    xs: width >= 428 ? 2 : 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  })

  const elListLoading = useMemo(() => {
    return Array(15).fill(
      <List.Item data-testid={'itemLoading'}>
        <PokemonCard loading name={''} image={null} />
      </List.Item>,
    )
  }, [])

  if (error) {
    return <Content data-testid={'errorView'}>{error.message}</Content>
  }

  return (
    <React.Fragment>
      <Content
        style={{
          paddingTop: 50,
          paddingBottom: 50,
        }}
      >
        <List
          grid={{
            gutter: [20, 20] as any,
            column: breakpointColumn.value,
          }}
          itemLayout="horizontal"
          loadMore={
            data &&
            data?.pokemons?.next !== null && (
              <div style={{ textAlign: 'center' }}>
                <Button
                  size={'large'}
                  type={'primary'}
                  data-testid={'loadMore'}
                  disabled={loading}
                  loading={loading}
                  onClick={() => {
                    fetchMore({
                      variables: {
                        ...variables,
                        offset: data?.pokemons?.results?.length + TOTAL_FETCH,
                      },
                    }).catch((err) => {
                      notification.error({
                        message: 'Error',
                        description: err.message,
                      })
                    })
                  }}
                >
                  Muat lebih banyak
                </Button>
              </div>
            )
          }
          dataSource={[...(data?.pokemons?.results || []), loading]}
          renderItem={(item) => {
            if (!item) {
              return <React.Fragment />
            }

            if (item === true) {
              return elListLoading
            }

            return (
              <List.Item data-testid={'itemPokemon'}>
                <Link href={`/detail?name=${item.name}`}>
                  <a>
                    <PokemonCard name={item.name} image={item.image} />
                  </a>
                </Link>
              </List.Item>
            )
          }}
        />
      </Content>
    </React.Fragment>
  )
}

export default Home
