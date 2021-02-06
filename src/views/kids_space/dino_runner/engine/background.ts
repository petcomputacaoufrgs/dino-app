import SkyAnimation from "../../engine/SkyAnimation"

const STAR_SPEED = 1500

export function startBackgroundEngine() {
  const stars = [
    document.getElementById('star_one'),
    document.getElementById('star_two'),
    document.getElementById('star_three'),
    document.getElementById('star_four'),
    document.getElementById('star_five'),
    document.getElementById('star_six'),
    document.getElementById('star_seven'),
    document.getElementById('star_eight'),
    document.getElementById('star_nine'),
    document.getElementById('star_ten'),
    document.getElementById('star_eleven'),
  ].filter(el => el !== null) as HTMLElement[]

  const skyAnimation = new SkyAnimation()
  skyAnimation.startSkyEngine(stars, STAR_SPEED, true)

  return skyAnimation.stopSkyEngine
}