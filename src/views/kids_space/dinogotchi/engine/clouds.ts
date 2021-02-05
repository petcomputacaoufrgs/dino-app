import ArrayUtils from "../../../../utils/ArrayUtils"
import { getRandomInteger } from "../../../../utils/RandomUtils"
import sleep from "../../../../utils/SleepUtils"

let duration = 0
let firstCount = 0
let cloudsCount = 0
const randomStack: ((value: number | PromiseLike<number>) => void)[] = []
let longSleepCount = 0

export function startCloudsAnimation() {
  const clouds = [
    document.getElementById("cloud_one"),
    document.getElementById("cloud_two"),
    document.getElementById("cloud_three"),
    document.getElementById("cloud_four"),
    document.getElementById("cloud_five"),
    //document.getElementById("cloud_six"),
  ]

  firstCount = 0
  longSleepCount = 0
  cloudsCount = clouds.length
  duration = getRandomDuration()

  ArrayUtils.suffle(clouds)

  clouds.forEach(cloud => {
    if (cloud) runCloudAnimation(cloud)
  })
}

async function runCloudAnimation(cloud: HTMLElement) {
  const id = cloud.id
  cloud.removeAttribute('id')

  const isFirstRender = await firstRender(cloud)

  if (!isFirstRender) {
    const sleepTime = await getRandomSleep()
    console.log(sleepTime)
    await sleep(sleepTime)
  }
  
  cloud.style.animationDuration = `${duration}s`
  cloud.setAttribute('id', id)
}

function getRandomDuration(): number {
  return getRandomInteger(20, 30)
}

function getRandomSleep(): Promise<number> {
  return new Promise<number>(resolve => {
    randomStack.push(resolve)
    if (randomStack.length === 1) resolveRandomStack()
  })
}

async function resolveRandomStack() {
  let value
  if (longSleepCount >= 1) {
    longSleepCount = 0
    value = getRandomInteger(0, duration*10)
  } else {
    longSleepCount++
    value = getRandomInteger(duration*150, duration*300) 
  }
   
  const resolve = randomStack.pop()
  if (resolve) resolve(value)

  await sleep(getRandomInteger(50, 150))
  if (randomStack.length > 0) resolveRandomStack()
}

async function firstRender(cloud: HTMLElement): Promise<boolean> {
  if (firstCount <= cloudsCount) {
    firstCount++
    cloud.onanimationend = () => runCloudAnimation(cloud)
    await sleep((firstCount * (duration*150)))
    
    return true
  }
  return false
}