import React, { forwardRef } from 'react'
import { Slide } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

const TransitionSlide = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
  ) {
  return (
    <Slide direction="up" ref={ref} mountOnEnter unmountOnExit {...props} />
  )
})

export default TransitionSlide
