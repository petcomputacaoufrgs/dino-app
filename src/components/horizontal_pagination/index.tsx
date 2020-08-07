import React, { useState, useEffect, useRef } from 'react'
import Slider from 'react-slick'
import HorizontalPagionationProps from './props'
import './styles.css'

let SLIDE_UPDATED = false

const HorizontalPagination: React.FC<HorizontalPagionationProps> = ({
  pages,
  initialSlide,
  fixInitialSlide,
  onSlideChange
}) => {
  const sliderRef = useRef({} as Slider)
  const [updateCount, setUpdateCount] = useState(0)

  const update = (currentSlide: number) => {
    if (fixInitialSlide) {
      if (!SLIDE_UPDATED) {
        SLIDE_UPDATED = true
        setUpdateCount(updateCount + 1)
        if (onSlideChange) {
          onSlideChange(currentSlide)
        }
      } else {
        SLIDE_UPDATED = false
      }
    } else if (onSlideChange) {
      onSlideChange(currentSlide)
    }
  }

  useEffect(() => {
    if (fixInitialSlide) {
      sliderRef.current.slickGoTo(initialSlide, true)
    }
  }, [updateCount, initialSlide, fixInitialSlide])

  return (
    <div className="horizontal_pagination">
      <Slider
        ref={sliderRef}
        dots={false}
        infinite={false}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        afterChange={update}
        initialSlide={initialSlide}
        beforeChange={(current, next) => {}}
      >
        {pages.map((page, index) => (
          <div className="horizontal_pagination__slide" key={index}>
            {page}
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default HorizontalPagination
