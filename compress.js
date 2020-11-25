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

        console.log("--------------------")
        console.log("Arquivos compridos: ")
        compressedFiles.forEach(compressedFile => {
            console.log(compressedFile.sourcePath)
        })
        console.log('--------------------')
    })

    return Promise.all(promises)
}


const init = async () => {
    console.log("COMPRESSING FILES...")
    const dirsWithImage = getDirectoriesWithImages()

    await compressImages(dirsWithImage)
    console.log('COMPRESSION ENDED SUCCESSFULLY')
}


init()