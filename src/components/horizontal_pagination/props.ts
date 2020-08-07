export class PageInfo {
  currentPage: number

  constructor(currentPage: number) {
    this.currentPage = currentPage
  }
}

export default interface HorizontalPagionationProps {
  pages: JSX.Element[]
  info: PageInfo
  onSlideChange?: (slide: number) => void
}
