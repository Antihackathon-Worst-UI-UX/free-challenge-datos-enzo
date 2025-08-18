import randomNumber from '@utils/randomNumber'

const randomChoose = <T>(items: T[]): T =>
  items[randomNumber(0, items.length - 1)]

export default randomChoose
