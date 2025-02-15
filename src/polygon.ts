export type Point = number[]

export class Polygon {
  points: Point[]

  constructor(points?: Point[]) {
    if (points) {
      this.points = points
      return
    }
    this.points = []
  }

  isInside(p: Point): boolean {
    const closed = [...this.points, this.points[0]]
    let cnt = 0
    for (let i = 0; i < closed.length - 1; i++) {
      const p0 = closed[i]
      const p1 = closed[i + 1]

      if ((p0[1] <= p[1] && p1[1] > p[1]) || (p0[1] > p[1] && p1[1] <= p[1])) {
        const vt = (p[1] - p0[1]) / (p1[1] - p0[1])
        if (p[0] < p0[0] + vt * (p1[0] - p0[0])) {
          cnt++
        }
      }
    }
    return cnt % 2 == 1
  }

  draw(cctx: CanvasRenderingContext2D) {
    this.points.forEach((p) => {
      cctx.lineTo(p[0], p[1])
    })
  }
}
