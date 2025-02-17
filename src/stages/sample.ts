import { Polygon } from '../math/polygon'

import imageUrl from './sample.png'
import answerUrl from './sample.answer.png'

export default {
  name: 'Sample',
  author: 'Testing',
  imageUrl: imageUrl,
  answerUrl: answerUrl,
  timeLimit: 60 * 1000,
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
}
