import React from 'react'

export default interface HorizontalPagionationProps {
  pages: React.FC[]
  slide?: number
  dontAnimate?: boolean
  controlChange?: boolean
  shouldSwipe?: boolean
  onSlideChange?: (slide: number) => void
}
