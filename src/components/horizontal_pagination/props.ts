export default interface HorizontalPagionationProps {
  pages: JSX.Element[]
  slide?: number
  dontAnimate?: boolean
  onSlideChange?: (slide: number) => void
}
