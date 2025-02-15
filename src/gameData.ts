import { Polygon } from './polygon'

import imageUrl1 from './adapurincoy1.png'
import answerUrl1 from './adapurincoy1.answer.png'

export type GameData = {
  imageUrl: string
  answerUrl: string
  purins: Polygon[]
}

export const gameData1: GameData = {
  imageUrl: imageUrl1,
  answerUrl: answerUrl1,
  purins: [
    new Polygon([
      [148, 0],
      [280, 0],
      [306, 47],
      [299, 63],
      [254, 85],
      [195, 99],
      [167, 93],
      [162, 72],
      [175, 57],
    ]),
    new Polygon([
      [1233, 660],
      [1267, 646],
      [1288, 658],
      [1284, 673],
      [1295, 711],
      [1289, 718],
      [1247, 720],
      [1240, 711],
      [1242, 680],
      [1233, 673],
    ]),
  ],
}
