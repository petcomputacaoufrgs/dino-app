import ArrayUtils from '../../../../utils/ArrayUtils'
import { getRandomInteger } from '../../../../utils/RandomUtils'
import sleep from '../../../../utils/SleepUtils'

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

  isRunning = true
  queueCount = 0
  duration = getRandomDuration()

  ArrayUtils.suffle(clouds)
  
  startAnimations(clouds)

  return stop
}

function stop() {
  isRunning = false
}

async function startAnimations(clouds: HTMLElement[]) {
  for (const cloud of clouds) {
    if (cloud) {
      cloud.onclick = () => handleCloudClick(cloud)
      runCloudAnimation(cloud)
      await sleep(duration/clouds.length * 2)
    }
  }
}

async function handleCloudClick(cloud: HTMLElement) {
  let opacity = 1
  while(opacity > 0) {
    opacity = opacity - 0.1
    cloud.style.opacity = `${opacity}`
    await sleep(100)
  }
}

async function runCloudAnimation(cloud: HTMLElement) {
  const id = cloud.id
  let sleepTime = 100
  cloud.style.animationDuration = `${duration}ms`
  while(isRunning) {
    cloud.removeAttribute('id')
    await sleep(sleepTime)
    cloud.style.opacity = "1"
    cloud.style.visibility = 'visible'
    cloud.setAttribute('id', id)
    await sleep(duration)
    cloud.style.visibility = 'hidden'
    sleepTime = await getRandomSleep()
  }
}

function getRandomDuration(): number {
  return getRandomInteger(30000, 70000)
}

function getRandomSleep(): Promise<number> {
  return new Promise<number>(resolve => {
    randomQueue.push(resolve)
    if (randomQueue.length === 1) resolveRandomSleepQueue()
  })
}

async function resolveRandomSleepQueue() {
  const resolve = randomQueue.shift()
  if (resolve) resolve(getSleepValue())

  await sleep(getRandomInteger(50, 150))
  if (randomQueue.length > 0) resolveRandomSleepQueue()
}

function getSleepValue(): number {
  if (queueCount === 0) {
    queueCount++
    return getRandomInteger(0, duration*0.02)
  } 
  if (queueCount === 1) {
    queueCount++
    return getRandomInteger(duration*0.1, duration*0.2) 
  }
  if (queueCount === 2) {
    queueCount++
    return getRandomInteger(duration*0.4, duration*0.6) 
  }

  queueCount = 0
  return getRandomInteger(duration*0.8, duration*1) 
}