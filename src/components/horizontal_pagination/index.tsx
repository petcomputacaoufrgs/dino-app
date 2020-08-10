import React, { useState, useEffect, useRef } from 'react'
import Slider from 'react-slick'
import HorizontalPagionationProps from './props'
import './styles.css'

let SLIDE_UPDATED = false

const HorizontalPagination: React.FC<HorizontalPagionationProps> = ({
  pages,
  slide,
  dontAnimate,
  onSlideChange
}) => {
  const sliderRef = useRef({} as Slider)
  const [updateCount, setUpdateCount] = useState(0)

  const update = (currentSlide: number) => {
    if (slide) {
      if (!SLIDE_UPDATED) {
        SLIDE_UPDATED = true
        setUpdateCount(updateCount + 1)
        if (onSlideChange) {
          onSlideChange(currentSlide)
        }
      } else {
        SLIDE_UPDATED = false
      }
    } else {
      sliderRef.current.slickGoTo(currentSlide, dontAnimate)
      if (onSlideChange) {
        onSlideChange(currentSlide)
      }
    }
  }

  useEffect(() => {
    if (slide) {
      sliderRef.current.slickGoTo(slide, dontAnimate)
    }
  }, [dontAnimate, slide])

  return (
    <div className="horizontal_pagination">
      <Slider
        ref={sliderRef}
        dots={false}
        infinite={false}
        speed={500}
        afterChange={update}
        initialSlide={slide ? slide : 0}
      >
        {pages.map((Page, index) => (
          <div className="horizontal_pagination__slide" key={index}>
            <Page />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default HorizontalPagination
