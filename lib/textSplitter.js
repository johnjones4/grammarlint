module.exports = (text, charsPerLine) => {
  const paragraphs = text.split('\n')
  const outputArray = []
  let currentLine = ''
  paragraphs.forEach((paragraph, pIndex) => {
    const words = paragraph.split(' ')
    words.forEach((word) => {
      const nextString = (currentLine.length === 0 ? word : (currentLine + ' ' + word))
      if (nextString.length > charsPerLine) {
        outputArray.push(currentLine)
        currentLine = word
      } else {
        currentLine = nextString
      }
    })
    outputArray.push(currentLine)
    currentLine = ''
  })
  return outputArray
}
