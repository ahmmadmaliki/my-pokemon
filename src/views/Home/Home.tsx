import React, { useMemo } from 'react'
import Content from 'components/Content/Content'
import { useHeader } from 'layouts/containers/Public/Header/Header'
import { List, Button, notification } from 'antd'
import PokemonCard from 'components/PokemonCard'
import usePokemons from 'data/usePokemons'
import ListPokemon from 'components/ListPokemon/ListPokemon'

const TOTAL_FETCH = 15

function Home() {
  useHeader({
    title: 'Pokemon',
  })

  const { fetchMore, data, variables, loading, error } = usePokemons({})

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
        <ListPokemon
          itemLoading={elListLoading}
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
        />
      </Content>
    </React.Fragment>
  )
}

export default Home
