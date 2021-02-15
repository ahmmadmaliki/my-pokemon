import React, { CSSProperties, ReactNode } from 'react'
import cx from 'classnames'
import cssContent from 'components/Content/Content.module.scss'
import { ReactComponentLike } from 'prop-types'

export interface ContentProps {
  id?: string
  classNameContainer?: string
  styleContainer?: CSSProperties
  className?: string
  isMobile?: boolean
  style?: CSSProperties
  children?: ReactNode | string
  isComponentContainer?: boolean
  isFullHeight?: boolean
  component?: ReactComponentLike
}

const DefaultComponent = (props) => <section {...props} />

function Content(props: ContentProps) {
  const {
    classNameContainer,
    styleContainer,
    children,
    component: Component = DefaultComponent,
    isMobile = false,
    className,
    style,
    isComponentContainer,
    isFullHeight,
    ...comProps
  } = props

  let extraStyle = {}

  if (isFullHeight) {
    extraStyle = { ...extraStyle, height: '100%' }
  }

  const containerProps = {
    className: cx(cssContent.container, classNameContainer),
    style: {
      ...styleContainer,
      ...extraStyle,
    },
  }

  const sectionProps = {
    className: cx(cssContent.section, className),
    style: {
      ...style,
      ...(isMobile ? { maxWidth: 576 } : {}),
      ...extraStyle,
    },
  }

  if (isComponentContainer) {
    return (
      <Component {...containerProps}>
        <div {...sectionProps} {...comProps}>
          {children}
        </div>
      </Component>
    )
  }

  return (
    <div {...containerProps}>
      <Component {...sectionProps} {...comProps}>
        {children}
      </Component>
    </div>
  )
}

export default Content
