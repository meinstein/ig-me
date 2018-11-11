const fs = require('fs')
const path = require('path')
const getColors = require('get-image-colors')

const data = []

async function processFiles(dir) {
  // get the dir name
  const dirName = dir.split('/').pop()
  // read all files in directory
  const files = getFiles(dir)
  // process each file concurrently
  return await Promise.all(
    files.map(async (fileName, idx) => {
      // get current file extension
      const { ext } = path.parse(fileName)
      // make sure we have image file
      if (ext === '.jpg') {
        // get current file path
        const filePath = path.join(dir, fileName)
        // get the colors
        try {
          const colors = await getColors(filePath)
          const hexColors = colors.map(color => color.hex())
          // add results to json map
          return data.push({
            dir: dirName,
            file: fileName,
            colors: hexColors
          })
        } catch (err) {
          console.log('Error getting colors:', err)
        }
      }
    })
  )
}

function getDirectories(filepath) {
  return fs.readdirSync(filepath).filter(file => {
    return fs.statSync(path.join(filepath, file)).isDirectory()
  })
}

function getFiles(filepath) {
  return fs.readdirSync(filepath).filter(file => {
    return fs.statSync(path.join(filepath, file)).isFile()
  })
}

function writeFile(filepath, content) {
  fs.writeFile(filepath, content, err => {
    err ? console.log('Error writing json file:', err) : console.log('Data successfully saved.')
  })
}

async function generateData() {
  // point our script at the photos directory from the IG data dump
  // we will assume that it's at the root of the dir
  const photosPath = path.join(__dirname, 'photos')
  // add data to src directory
  const jsonPath = path.join(__dirname, 'src', 'photoData.json')
  // get all the photo dirs
  const photos = getDirectories(photosPath)
  // process each dir in parallel
  await Promise.all(photos.map(dir => processFiles(path.join(photosPath, dir))))
  // write results to file
  writeFile(jsonPath, JSON.stringify(data))
}

generateData()
