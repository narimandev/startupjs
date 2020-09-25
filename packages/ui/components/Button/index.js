import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from '../Row'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../typography/Span'
import { colorToRGBA } from '../../config/helpers'
// import { StyleSheet } from 'react-native'
import STYLES from './index.styl'

const {
  config: {
    heights, outlinedBorderWidth, iconMargins
  },
  colors
} = STYLES

function Button ({
  style,
  iconStyle,
  textStyle,
  children,
  color,
  variant,
  size,
  icon,
  iconPosition,
  textColor,
  disabled,
  onPress,
  ...props
}) {
  if (!colors[color]) console.error('Button component: Color for color property is incorrect. Use colors from $UI.colors')

  const isFlat = variant === 'flat'

  const _color = colors[color]
  const _textColor = colors[textColor] || (isFlat ? colors.white : _color)

  const hasChildren = React.Children.count(children)
  const height = heights[size]
  const rootStyle = { height }
  const rootExtraProps = {}
  const labelStyle = { color: _textColor }
  const iconWrapperStyle = {}

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color
      break
    case 'outlined':
      rootStyle.borderWidth = outlinedBorderWidth
      rootStyle.borderColor = colorToRGBA(_color, 0.5)
      break
    case 'text':
      break
    case 'shadowed':
      rootStyle.backgroundColor = colors.white
      rootExtraProps.level = 2
      break
  }

  let padding
  const quarterOfHeight = height / 4

  if (hasChildren) {
    padding = height / 2

    switch (iconPosition) {
      case 'left':
        iconWrapperStyle.marginRight = iconMargins[size]
        iconWrapperStyle.marginLeft = -quarterOfHeight
        break
      case 'right':
        iconWrapperStyle.marginLeft = iconMargins[size]
        iconWrapperStyle.marginRight = -quarterOfHeight
        break
    }
  } else {
    padding = quarterOfHeight
  }

  if (variant === 'outlined') padding -= outlinedBorderWidth

  rootStyle.paddingLeft = padding
  rootStyle.paddingRight = padding

  return pug`
    Row.root(
      style=[rootStyle, style]
      styleName=[
        size,
        { disabled }
      ]
      align='center'
      vAlign='center'
      reverse=iconPosition === 'right'
      variant='highlight'
      underlayColor=color
      disabled=disabled
      onPress=onPress
      ...rootExtraProps
      ...props
    )
      if icon
        Div.iconWrapper(
          style=iconWrapperStyle
          styleName=[
            {'with-label': hasChildren},
            iconPosition
          ]
        )
          Icon.icon(
            style=iconStyle
            styleName=[variant]
            icon=icon
            size=size
          )
      if children
        Span.label(
          style=[labelStyle, textStyle]
          styleName=[size]
        )= children
  `
}

Button.defaultProps = {
  ...Div.defaultProps,
  color: 'dark',
  variant: 'outlined',
  size: 'm',
  shape: 'rounded',
  iconPosition: 'left'
}

Button.propTypes = {
  ...Div.propTypes,
  textStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['flat', 'outlined', 'text', 'shadowed']),
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  shape: Div.propTypes.shape,
  textColor: propTypes.string,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right'])
}

export default observer(Button)
