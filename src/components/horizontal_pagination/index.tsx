import React, { useState, useEffect, useRef } from 'react'
import Slider from 'react-slick'
import HorizontalPagionationProps from './props'
import ReactSwipe from 'react-swipe'
import './styles.css'

let SLIDE_UPDATED = false

const HorizontalPagination: React.FC<HorizontalPagionationProps> = ({
  pages,
  slide,
  dontAnimate,
  onSlideChange,
  shouldSwipe,
}) => {
  const sliderRef = useRef({} as ReactSwipe)
  const [updateCount, setUpdateCount] = useState(0)
  const [swipe, setSwipe] = useState(
    shouldSwipe === undefined ? true : shouldSwipe
  )

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
      //sliderRef.current.slickGoTo(currentSlide, dontAnimate)
      if (onSlideChange) {
        onSlideChange(currentSlide)
      }
    }
  }

  useEffect(() => {
    if (slide) {
      //sliderRef.current.slickGoTo(slide, dontAnimate)
    }
  }, [dontAnimate, slide])

  useEffect(() => {
    console.log("Should swipe")
    console.log(shouldSwipe)
    setSwipe(shouldSwipe === undefined ? true : shouldSwipe)
  }, [setSwipe, shouldSwipe])

  return (
    <div className="horizontal_pagination">
      <ReactSwipe
        className="carousel"
        swipeOptions={{ continuous: false }}
        ref={sliderRef}
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
