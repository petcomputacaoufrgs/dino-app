import SkyAnimation from '../../engine/SkyAnimation'

const randomQueue: ((value: number | PromiseLike<number>) => void)[] = []
let duration = 0
let queueCount = 0
let isRunning = true

export function startCloudEngine() {
  const clouds = [
    document.getElementById('dinogotchi__inside__cloud_one'),
    document.getElementById('dinogotchi__inside__cloud_two'),
    document.getElementById('dinogotchi__inside__cloud_three'),
    document.getElementById('dinogotchi__inside__cloud_four'),
    document.getElementById('dinogotchi__inside__cloud_five'),
    document.getElementById('dinogotchi__inside__cloud_six'),
    document.getElementById('dinogotchi__inside__cloud_seven'),
    document.getElementById('dinogotchi__inside__cloud_eight'),
    document.getElementById('dinogotchi__inside__cloud_nine')
  ].filter(el => el !== null) as HTMLElement[]
  
  const skyAnimation = new SkyAnimation()
  skyAnimation.startSkyEngine(clouds)

  return skyAnimation.stopSkyEngine
}