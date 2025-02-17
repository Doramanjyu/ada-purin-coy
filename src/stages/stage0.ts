import { Polygon } from '../math/polygon'

import imageUrl from './stage0.png'
import answerUrl from './stage0.answer.png'

export default {
  name: 'Tutorial',
  author: 'doramanjyu',
  imageUrl: imageUrl,
  answerUrl: answerUrl,
  timeLimit: 60 * 5 * 1000,
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
    new Polygon([
      [1087, 365],
      [1103, 359],
      [1121, 369],
      [1126, 402],
      [1087, 403],
    ]),
    new Polygon([
      [688, 890],
      [689, 873],
      [676, 858],
      [683, 832],
      [709, 825],
      [727, 838],
      [756, 840],
      [778, 825],
      [788, 840],
      [798, 841],
      [813, 826],
      [838, 825],
      [851, 848],
      [845, 865],
      [853, 881],
      [818, 897],
      [752, 897],
      [709, 896],
    ]),
  ],
}
