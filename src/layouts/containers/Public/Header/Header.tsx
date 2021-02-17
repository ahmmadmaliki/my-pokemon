import React, { useContext, useEffect, useMemo, useReducer } from 'react'
import { Col, Button, Row, Avatar, Menu, Badge } from 'antd'
import ContextContainer from 'layouts/containers/Public/ContextContainer'
import Text from 'components/Typography/Text'
import Link from 'next/link'
import BaseHeader, { BaseHeaderProps } from 'components/BaseHeader/BaseHeader'
import Title from 'components/Typography/Title'
import useValueBreakpoint from 'hooks/useValueBreakpoint'
import HamburgerButton from 'components/HamburgerButton/HamburgerButton'
import { css } from '@emotion/react'
import { useTransition, animated } from 'react-spring'
import { useRouter } from 'next/router'
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined'

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

export const cssBlackButton = css`
  #containerButton {
    .ant-btn {
      border-color: black;
      background: black;
      &:hover,
      &:focus,
      &:active {
        border-color: #777;
        background: #777;
      }
    }

    .ant-badge {
      width: 100%;
    }
  }
`

export function useHeader(initialProps?: HeaderProps) {
  const ctxHeader = useContext(ContextHeader)
  useEffect(() => {
    ctxHeader.setProps(initialProps)
  }, [])

  return ctxHeader
}

function Header(props: HeaderProps) {
  const { title, ...restProps } = props
  const { asPath } = useRouter()
  const isShowBack = asPath !== '/'

  const transitions = useTransition(isShowBack, null, {
    from: {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0,
      transform: 'translate3d(100%,0,0)',
    },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  })

  const { storagePokemon } = useContext(ContextContainer)
  const { value: isExtraSmall } = useValueBreakpoint({
    xs: true,
    sm: false,
  })

  const { length: totalPokemon } = storagePokemon.data || {}

  const btnMyPokemon = useMemo(() => {
    return (
      <Link href={'/my-pokemon'}>
        <a id={'containerButton'}>
          <Badge count={totalPokemon}>
            <Button danger type={'primary'} block={isExtraSmall}>
              <Text fontFamily={'bold'}>My Pokemon</Text>
            </Button>
          </Badge>
        </a>
      </Link>
    )
  }, [isExtraSmall, totalPokemon])

  const menu = isExtraSmall ? (
    <div style={{ display: 'inline-block' }}>
      <HamburgerButton
        menu={
          <Menu css={cssBlackButton}>
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
      css={cssBlackButton}
      styleContainer={{
        backgroundColor: 'white',
      }}
    >
      <Col flex={'none'}>
        <Link href={'/'}>
          <a className={'reset-a'}>
            <Row wrap={false}>
              <Col style={{ alignSelf: 'center', width: 40, height: 40 }}>
                {transitions.map(({ item: isShowBack, props }) => {
                  return (
                    <animated.div style={props}>
                      <Avatar
                        style={{
                          backgroundColor: isShowBack
                            ? 'transparent'
                            : '#e21d26',
                        }}
                        size={'large'}
                      >
                        {isShowBack ? (
                          <ArrowLeftOutlined
                            style={{ color: 'black', fontSize: 20 }}
                          />
                        ) : (
                          <Text bold>P</Text>
                        )}
                      </Avatar>
                    </animated.div>
                  )
                })}
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
