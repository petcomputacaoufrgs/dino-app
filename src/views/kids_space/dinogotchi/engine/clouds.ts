import SkyAnimation from '../../engine/SkyAnimation'

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