import React, { useContext, useEffect, useMemo, useReducer } from 'react'
import { Col, Button, Row, Avatar, Menu } from 'antd'
import Text from 'components/Typography/Text'
import Link from 'next/link'
import BaseHeader, { BaseHeaderProps } from 'components/BaseHeader/BaseHeader'
import Title from 'components/Typography/Title'
import useValueBreakpoint from 'hooks/useValueBreakpoint'
import HamburgerButton from 'components/HamburgerButton/HamburgerButton'
import { css } from '@emotion/react'

const cssBlackButton = css(
  `.ant-btn {
              border-color: black;
              background: black;
              &:hover,
              &:focus,
              &:active {
                border-color: #777;
                background: #777;
              }
            }
          `,
)

export type HeaderProps = {
  title: string
} & BaseHeaderProps

export const ContextHeader = React.createContext<{
  props?: HeaderProps
  setProps?: (props?: HeaderProps) => void
}>({})

export function useHeaderProps(initialProps?: HeaderProps) {
  const [props, setProps] = useReducer((prevState, action) => {
    return {
      ...prevState,
      ...action,
    }
  }, initialProps)

  return {
    props,
    setProps,
  }
}

export function useHeader(initialProps?: HeaderProps) {
  const ctxHeader = useContext(ContextHeader)
  useEffect(() => {
    ctxHeader.setProps(initialProps)
  }, [])

  return ctxHeader
}

function Header(props: HeaderProps) {
  const { title, ...restProps } = props

  const { value: isExtraSmall } = useValueBreakpoint({
    xs: true,
    sm: false,
  })

  const btnMyPokemon = useMemo(() => {
    return (
      <Link href={'/my-pokemon'}>
        <a css={cssBlackButton}>
          <Button danger type={'primary'} block={isExtraSmall}>
            <Text fontFamily={'bold'}>My Pokemon</Text>
          </Button>
        </a>
      </Link>
    )
  }, [isExtraSmall])

  const menu = isExtraSmall ? (
    <div style={{ display: 'inline-block' }}>
      <HamburgerButton
        menu={
          <Menu>
            <Menu.Item>{btnMyPokemon}</Menu.Item>
          </Menu>
        }
      />
    </div>
  ) : (
    btnMyPokemon
  )

  const styleMenu = isExtraSmall ? { height: 28 } : { height: 32 }

  return (
    <BaseHeader
      {...restProps}
      styleContainer={{
        backgroundColor: 'white',
      }}
    >
      <Col flex={'none'}>
        <Link href={'/'}>
          <a className={'reset-a'}>
            <Row wrap={false}>
              <Col style={{ alignSelf: 'center' }}>
                <Avatar
                  style={{
                    backgroundColor: '#e21d26',
                  }}
                  size={'large'}
                >
                  <Text bold>P</Text>
                </Avatar>
              </Col>
              <Col>
                <Title noMargin style={{ padding: 6 }}>
                  {title}
                </Title>
              </Col>
            </Row>
          </a>
        </Link>
      </Col>
      <Col flex={'auto'} style={{ textAlign: 'end', ...styleMenu }}>
        {menu}
      </Col>
    </BaseHeader>
  )
}

export default Header
