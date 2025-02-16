import { Polygon } from './polygon'

import imageUrl1 from './adapurincoy1.png'
import answerUrl1 from './adapurincoy1.answer.png'

export type StageData = {
  name: string
  imageUrl: string
  answerUrl: string
  timeLimit: number
  life: number
  purins: Polygon[]
}

export const stages: StageData[] = [
  {
    name: 'Sample1 (2m, 4fails)',
    imageUrl: imageUrl1,
    answerUrl: answerUrl1,
    timeLimit: 60 * 2 * 1000,
    life: 4,
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
  },
  {
    name: 'Sample2 (30s, 3fails)',
    imageUrl: imageUrl1,
    answerUrl: answerUrl1,
    timeLimit: 30 * 1000,
    life: 3,
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
  },
]
