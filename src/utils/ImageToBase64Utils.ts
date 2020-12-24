import LogAppErrorService from '../services/log_app_error/LogAppErrorService'

type ImageFormat = 'jpeg' | 'png'

type ImageProcessItemCallback = (
  base64: string,
  success: boolean,
  data?: any
) => void

interface ImageProcessItem {
  src: string
  type: ImageFormat
  callback: ImageProcessItemCallback
  data?: any
}

/**
 * @description Gera a codificação Base64 de uma imagem no formato JPEG ou PNG
 * Funciona para qualquer fonte de imagem que seja aceita na tag <img> porém para
 * imagens externas é necessário que o servidor esteja configurado para permitir acesso
 * de origens diferentes.
 */
class ImageToBase64Utils {
  image: HTMLImageElement
  canvas: HTMLCanvasElement
  queue: ImageProcessItem[]
  processing: boolean
  currentItem: ImageProcessItem | undefined

  constructor() {
    this.image = new Image()
    this.canvas = document.createElement('canvas')
    this.queue = [] as ImageProcessItem[]
    this.processing = false
  }

  getBase64FromImageSource(
    src: string,
    type: ImageFormat,
    callback: ImageProcessItemCallback,
    data?: any
  ) {
    this.addToQueue(src, type, callback, data)
  }

  private addToQueue(
    src: string,
    type: ImageFormat,
    callback: ImageProcessItemCallback,
    data?: any
  ) {
    const item: ImageProcessItem = {
      src: src,
      callback: callback,
      type: type,
      data: data,
    }

    this.queue.push(item)

    if (!this.processing) {
      this.run()
    }
  }

  private run() {
    this.processing = true

    const item = this.queue.pop()
    if (item) {
      try {
        this.image.crossOrigin = 'Anonymous'
        this.image.src = item.src
        this.currentItem = item
        this.image.onload = () => {
          this.genereCanvas()
        }
        this.image.onerror = () => {
          this.imageLoadError()
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    } else {
      this.processing = false
    }
  }

  private genereCanvas() {
    this.canvas.width = this.image.width
    this.canvas.height = this.image.height
    this.generateBase64FromCanvas()
  }

  private generateBase64FromCanvas = () => {
    if (this.currentItem) {
      const ctx = this.canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(this.image, 0, 0)
        this.currentItem.callback(
          this.canvas.toDataURL(`image/${this.currentItem.type}`),
          true,
          this.currentItem.data
        )
      }
    }
    this.run()
  }

  private imageLoadError = () => {
    if (this.currentItem) {
      this.currentItem.callback('', false)
    }
    this.run()
  }
}

export default new ImageToBase64Utils()
