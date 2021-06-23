import React, { useEffect } from 'react'
import SliderBoard from './board'

export const useEvent = (event: any, handler: {(this: Window, ev: any): any; (this: Window, ev: any): any;}, passive = false) => {
  useEffect(() => {
      window.addEventListener(event, handler, passive)
      return function cleanup() {
          window.removeEventListener(event, handler)
      }
  })
}

const DinoSlider: React.FC = () => <SliderBoard/>

export default DinoSlider