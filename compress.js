const imagemin = require("imagemin");
const imageminPng = require("imagemin-pngquant");
const imageminJpg = require('imagemin-mozjpeg');
const imageminSvg = require('imagemin-svgo')
const fs = require('fs')
const path = require('path')

const dirsToSearch = ['./src', './public']

const isImage = (file) => (
    file.endsWith('.svg') ||
    file.endsWith('.png') ||
    file.endsWith('.jpg') ||
    file.endsWith('.jpeg')
)

const getDirectoriesWithImages = () => {
    const result = new Set()
    dirsToSearch.forEach((dir) => getDirectoriesWithImagesAux(dir, [], result))

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
      if (isImage(file)) dirWithImages.add(dirPath)
      arrayOfFiles.push(path.join(__dirname, dirPath, '/', file))
    }
  })
}

const compressImages = async (dirs) => {
    const promises = dirs.map(async (dir) => {
      const compressedFiles = await imagemin([dir], {
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

      console.log(compressedFiles)
    })

    Promise.all(promises)
}

const dirsWithImage = getDirectoriesWithImages()

compressImages(dirsWithImage)