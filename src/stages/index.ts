import { Polygon } from '../math/polygon'

import hbd from './hbd'
import mountain from './mountain'
import onTheDesk from './on-the-desk'
import purinAndPurin from './purin-and-purin'
import purinFactory from './purin-factory'
import purinLand from './purinland'
import purinVillage from './purin-village'
import tutorial from './tutorial'
import underwater from './underwater'

export type StageData = {
  name: string
  author: string
  imageUrl: string
  answerUrl: string
  timeLimit: number
  life: number
  purins: Polygon[]
}

export const dumpPurins = (purins: Polygon[]): string => {
  const lines = ['  purins: [']
  purins.forEach((purin) => {
    lines.push('    new Polygon([')
    purin.points.forEach((p) => {
      lines.push(`      [${p[0]}, ${p[1]}],`)
    })
    lines.push('    ]),')
  })
  lines.push('  ],')
  return lines.join('\n')
}

const stagesNormal: StageData[] = [
  tutorial,
  onTheDesk,
  purinVillage,
  mountain,
  purinAndPurin,
  underwater,
  purinFactory,
  purinLand,
]

const stagesMarchOnly: StageData[] = new Date().getMonth() === 2 ? [hbd] : []

export const stages: StageData[] = stagesNormal.concat(stagesMarchOnly)
