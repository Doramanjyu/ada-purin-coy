import { Polygon } from '../math/polygon'

import tutorial from './tutorial'
import purinFactory from './purin-factory'

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

export const stages: StageData[] = [tutorial, purinFactory]
