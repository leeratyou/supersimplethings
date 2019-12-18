enum Format {
  png = 'png',
  jpeg = 'jpeg',
  webp = 'webp',
  bmp = 'bmp'
}

enum Output {
  dataURL = 'dataURL',
  File = 'File',
  Blob = 'Blob'
}

interface Options {
  maxWidth?: number
  maxHeight?: number
  format?: Format,
  quality?: number,
  output?: Output
}

export function resize(file: any, options: Options): Promise<any> {
  const {
    maxWidth = 1024,
    maxHeight = 768,
    format = 'jpeg',
    quality = 1.0,
    output = 'dataURL'
  } = options
  
  const image = new Image()
  const url = typeof file === 'string' ? file : URL.createObjectURL(file)
  
  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return reject('Error')
      
      let width = image.width
      let height = image.height
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx.drawImage(image, 0, 0, width, height)
      
      if (output === "dataURL") {
        const dataURL = canvas.toDataURL(`image/${format}`, quality)
        resolve(dataURL)
      }
      
      if (output === 'Blob') {
        canvas.toBlob(blob => resolve(blob), `image/${format}`, quality)
      }
      
      if (output === 'File') {
        canvas.toBlob(blob => {
          if (!blob) return reject('Error')
          const file = new File([blob], 'image')
          resolve(file)
        }, `image/${format}`, quality)
      }
    }
    image.src = url
  })
}
