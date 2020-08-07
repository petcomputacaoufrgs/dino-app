export default interface HorizontalPagionationProps {
  pages: JSX.Element[]
  initialSlide: number
  fixInitialSlide?: boolean
  onSlideChange?: (slide: number) => void
}
