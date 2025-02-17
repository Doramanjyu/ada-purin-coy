import { Polygon } from '../math/polygon'

import stage0 from './stage0'
import sample from './sample'

export type StageData = {
  name: string
  author: string
  imageUrl: string
  answerUrl: string
  timeLimit: number
  life: number
  purins: Polygon[]
}

export const stages: StageData[] = [stage0, sample]
