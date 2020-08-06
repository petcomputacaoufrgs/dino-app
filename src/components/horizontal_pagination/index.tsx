import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
import HorizontalPagionationProps from './props'

const SCROLL_PORCENTAGE_TO_CHANGE = 1.4

const HorizontalPagination: React.FC<HorizontalPagionationProps> = ({
  pages,
}) => {
  const mainRef = useRef({} as HTMLDivElement)
  const [touchStart, setTouchStart] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [forcedScroll, setForcedScroll] = useState(false)
  const [currentScrollLeft, setCurrentScrollLeft] = useState(0)

  useEffect(() => {
    const changePage = (newScrollLeft: number): boolean => {
      if (currentScrollLeft !== newScrollLeft) {
        setCurrentScrollLeft(newScrollLeft)
        mainRef.current.scrollLeft = newScrollLeft
        return true
      }

      return false
    }

    const calculatePreviousPage = (scrollLeft: number, clientWidth: number) => {
      let newScrollLeft = currentScrollLeft

      while (scrollLeft >= newScrollLeft * SCROLL_PORCENTAGE_TO_CHANGE) {
        newScrollLeft = newScrollLeft + clientWidth
      }


      return changePage(newScrollLeft)
    }

    const calculateNextPage = (scrollLeft: number, clientWidth: number): boolean => {
      let newScrollLeft = currentScrollLeft

      while (scrollLeft <= newScrollLeft * SCROLL_PORCENTAGE_TO_CHANGE) {
        newScrollLeft = newScrollLeft - clientWidth
      }

      return changePage(newScrollLeft)
    }

    const calculatePage = () => {
      setForcedScroll(true)

      const scrollLeft = mainRef.current.scrollLeft
      let clientWidth = mainRef.current.clientWidth

      const pageChanged = calculatePreviousPage(scrollLeft, clientWidth)

      if (!pageChanged) {
        calculateNextPage(scrollLeft, clientWidth)
      }
    }

    let handleContainerTouchEnd = (e) => {
      if (isScrolling) {
        setIsScrolling(false)
        setTouchStart(false)
        calculatePage()
      }
    }

    let handleContainerTouchStart = () => {
      setTouchStart(true)
    }

    let handleCalendarScroll = (e) => {
      if (forcedScroll) {
        setForcedScroll(false)
        return
      }

      if (touchStart) {
        setIsScrolling(true)
      } else {
        console.log("returning")
        mainRef.current.scrollLeft = currentScrollLeft
      }
    }

    if (mainRef.current) {
      mainRef.current.ontouchend = handleContainerTouchEnd
      mainRef.current.ontouchstart = handleContainerTouchStart
      mainRef.current.onscroll = handleCalendarScroll
    }

    const cleanBeforeUpdate = () => {
      handleCalendarScroll = () => {}
      handleContainerTouchEnd = () => {}
    }

    return cleanBeforeUpdate
  })

  const getTotalWidth = (): string => {
    const totalWidth = pages.length * 100

    return `${totalWidth}%`
  }

  return (
    <div className='horizontal_pagination' ref={mainRef}>
      <div
        className="horizontal_pagination__pages_container"
        style={{ width: getTotalWidth() }}
      >
        {pages.map((page, key) => (
          <div className="horizontal_pagination__item" key={key}>
            {page}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HorizontalPagination
