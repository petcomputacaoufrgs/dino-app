import React from 'react'

export default interface HorizontalPagionationProps {
	pages: React.FC[]
	slide?: number
	onSlideChange?: (slide: number) => void
}
