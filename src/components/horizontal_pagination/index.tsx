import React, { useState, useEffect, useRef } from 'react'
import HorizontalPagionationProps from './props'
import ReactSwipe from 'react-swipe'
import './styles.css'

const HorizontalPagination: React.FC<HorizontalPagionationProps> = ({
  pages,
  slide,
  onSlideChange,
}) => {
  const sliderRef = useRef({} as ReactSwipe)
  const [currentSlide, setCurrentSlide] = useState(slide ? slide : 0)

  useEffect(() => {
    if (slide) {
      setCurrentSlide(slide)
    }
  }, [slide])

  const handleSlideChange = (index: number, elem: HTMLElement) => {
    if (onSlideChange) {
      onSlideChange(index)
    }
  }

  return (
    <div className="horizontal_pagination">
      <ReactSwipe
        className="carousel"
        ref={sliderRef}
        swipeOptions={{
          callback: handleSlideChange,
          startSlide: currentSlide,
          continuous: false,
          speed: 250
        }}
      >
        {pages.map((Page, index) => (
          <div className="horizontal_pagination__slide" key={index}>
            <Page />
          </div>
        ))}
      </ReactSwipe>
    </div>
  )
}

export default HorizontalPagination
