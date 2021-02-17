import React from 'react'
import { useWindowWidth } from '@react-hook/window-size'
import useValueBreakpoint from 'hooks/useValueBreakpoint'
import { List } from 'antd'
import Link from 'next/link'
import PokemonCard from 'components/PokemonCard'
import { ListProps } from 'antd/lib/list'

type ListPokemonProps<T> = ListProps<T> & {
  itemLoading?: React.ReactNode | React.ReactNode[]
}

function ListPokemon<T>(props: ListPokemonProps<T>) {
  const { itemLoading, ...listProps } = props
  const width = useWindowWidth()

  const breakpointColumn = useValueBreakpoint({
    xs: width >= 428 ? 2 : 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  })
  return (
    <List
      grid={{
        gutter: [20, 20] as any,
        column: breakpointColumn.value,
      }}
      itemLayout="horizontal"
      renderItem={(item: any) => {
        if (!item) {
          return <React.Fragment />
        }

        if (item === true) {
          return itemLoading
        }

        return (
          <List.Item data-testid={'itemPokemon'}>
            <Link href={`/detail?name=${item.name}`}>
              <a>
                <PokemonCard
                  nickname={item.nickname}
                  name={item.name}
                  image={item.image}
                />
              </a>
            </Link>
          </List.Item>
        )
      }}
      {...listProps}
    />
  )
}

export default ListPokemon
