export const generateRandomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return letters.charAt(Math.floor(Math.random() * letters.length))
}

export const checkAnswer = (answer: string, correctLetter: string) => {
  // Placeholder logic for answer checking - this can be expanded based on the game rules
  // For instance, you can check if the answer starts with the correct letter
  return answer.toUpperCase().startsWith(correctLetter)
}
