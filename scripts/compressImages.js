const imagemin = require("imagemin");
const imageminPng = require("imagemin-pngquant");
const imageminJpg = require('imagemin-mozjpeg');
const imageminSvg = require('imagemin-svgo')
const fs = require('fs')
const path = require('path')

const compressionDirs = ['./src', './public']

const supportedImageTypes = ['.svg', '.png', '.jpg', '.jpeg']

const isValidImage = (file) => supportedImageTypes.some(type => file.endsWith(type))

const getDirectoriesWithImages = () => {
    const result = new Set()
    compressionDirs.forEach((dir) => getDirectoriesWithImagesAux(dir, [], result))

    return Array.from(result)
}

const getDirectoriesWithImagesAux = (dirPath, arrayOfFiles, dirWithImages) => {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      getDirectoriesWithImagesAux(
        dirPath + '/' + file,
        arrayOfFiles,
        dirWithImages
      )
    } else {
      if (isValidImage(file)) dirWithImages.add(dirPath)
      arrayOfFiles.push(path.join(__dirname, dirPath, '/', file))
    }
  })
}

const compressImages = async (dirs) => {
    const compressedImages = []
    const filesTypes = supportedImageTypes.join(',')

    const promises = dirs.map(async (dir) => {
        const compressedFiles = await imagemin([`${dir}/*{${filesTypes}}`], {
            destination: dir,
            plugins: [
            imageminPng({
                quality: [0.6, 0.8],
            }),
            imageminJpg({
                quality: [0.6, 0.8],
            }),
            imageminSvg({
                plugins: [{ removeViewBox: false }],
            }),
            ],
        })

        compressedImages.push(
          ...compressedFiles.map((compressedFile) => compressedFile.sourcePath)
        )
    })

    await Promise.all(promises)

    return compressedImages
}


const init = async () => {
    console.log('-------------------IMAGE COMPRESSOR-------------------')
    console.log('COMPRESSING FILES...')

    try {
        const dirsWithImage = getDirectoriesWithImages()

        const compressedImages = await compressImages(dirsWithImage)

        console.log('COMPRESSION ENDED SUCCESSFULLY')        
        console.log('   FILES: ')
        compressedImages.forEach((compressImage) =>
          console.log(`      ${compressImage}`)
        )
        console.log('------------------------------------------------------')

        return 0
    } catch (e) {
        console.log('COMPRESSION FAIL')
        console.log(e)

        return 1
    }
}


return init()