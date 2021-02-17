import React, { useContext } from 'react'
import Content from 'components/Content/Content'
import { useHeader } from 'layouts/containers/Public/Header/Header'
import ContextContainer from 'layouts/containers/Public/ContextContainer'
import { isEmpty } from 'lodash'
import { Result, Button } from 'antd'
import Link from 'next/link'
import ListPokemon from 'components/ListPokemon/ListPokemon'

function MyPokemon() {
  useHeader({
    title: 'My Pokemon',
  })

  const { storagePokemon } = useContext(ContextContainer)

  if (isEmpty(storagePokemon.data)) {
    return (
      <div data-testid={'emptyView'}>
        <Result
          status={404}
          title={'No pokemon here :('}
          subTitle={
            <Link href={'/'}>
              <a>
                <Button type={'primary'}>Go Catch Them</Button>
              </a>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <Content>
      <ListPokemon dataSource={storagePokemon.data} />
    </Content>
  )
}

export default MyPokemon
