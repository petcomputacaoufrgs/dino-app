import ArrayUtils from '../../../../utils/ArrayUtils'
import { getRandomInteger } from '../../../../utils/RandomUtils'
import sleep from '../../../../utils/SleepUtils'

const cloudClickEffectDuration = 2500
const randomQueue: ((value: number | PromiseLike<number>) => void)[] = []
let duration = 0
let queueCount = 0
let isRunning = true

export function start() {
  const clouds = [
    document.getElementById('cloud_one'),
    document.getElementById('cloud_two'),
    document.getElementById('cloud_three'),
    document.getElementById('cloud_four'),
    document.getElementById('cloud_five'),
    document.getElementById('cloud_six'),
    document.getElementById('cloud_seven'),
    document.getElementById('cloud_eight'),
    document.getElementById('cloud_nine')
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
      runCloudAnimation(cloud)
      await sleep(duration/clouds.length * 2)
    }
  }
}

async function handleCloudClick(cloud: HTMLElement, id: string) {
  let opacity = 1
  while(opacity > 0) {
    cloud.style.opacity = `${opacity}`
    opacity = opacity - 0.1
    await sleep(100)
  }
}

async function runCloudAnimation(cloud: HTMLElement) {
  const id = cloud.id
  let sleepTime = 100
  cloud.onclick = () => handleCloudClick(cloud, id)
  while(isRunning) {
    cloud.removeAttribute('id')
    await sleep(sleepTime)
    cloud.style.animationDuration = `${duration}ms`
    cloud.style.display = 'visible'
    cloud.style.opacity = "1"
    cloud.setAttribute('id', id)
    await sleep(duration)
    cloud.style.display = 'none'
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
    return getRandomInteger(duration*0.05, duration*0.3) 
  }
  if (queueCount === 2) {
    queueCount++
    return getRandomInteger(duration*0.5, duration*0.7) 
  }

  queueCount = 0
  return getRandomInteger(duration*1.5, duration*2) 
}