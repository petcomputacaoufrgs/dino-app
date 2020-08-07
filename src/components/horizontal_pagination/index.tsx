import React, { useState, useEffect } from 'react'
import Carousel from 'nuka-carousel'
import HorizontalPagionationProps from './props'
import { useLanguage } from '../../context_provider/app_settings'
import { isMobile } from 'react-device-detect'
import './styles.css'

const HorizontalPagination: React.FC<HorizontalPagionationProps> = ({
  pages,
  info,
  onSlideChange
}) => {
  const language = useLanguage().current
  
  const [slideIndex, setSlideIndex] = useState(info.currentPage)
  const [isUpdateCallback, setIsUpdateCallback] = useState(false)

  const handleSlideChange = (slide: number) => {
    if (isUpdateCallback) {
      setIsUpdateCallback(false)
    } else {
      setIsUpdateCallback(true)
      setSlideIndex(slide)
      if (onSlideChange) {
        onSlideChange(slide)
      }
    }
  }

  useEffect(() => {
    setSlideIndex(info.currentPage)
  }, [info])

  return (
    <div className="horizontal_pagination">
      <Carousel
        withoutControls={isMobile}
        afterSlide={handleSlideChange}
        defaultControlsConfig={{
          nextButtonText: language.NEXT_BUTTON_TEXT,
          prevButtonText: language.PREVIOUS_BUTTON_TEXT,
        }}
        disableAnimation={isUpdateCallback}
        slideIndex={slideIndex}
        disableEdgeSwiping
      >
        {pages.map((page, index) => (
          <div className="horizontal_pagination__slide" key={index}>
            {page}
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default HorizontalPagination
