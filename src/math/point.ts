export type Point = number[]

const dot = (a: Point, b: Point): number => {
  return a[0] * b[0] + a[1] * b[1]
}

const norm = (a: Point): number => {
  return Math.hypot(a[0], a[1])
}

export const lineToPoint = (a: Point, b: Point, p: Point): number => {
  const ap = [p[0] - a[0], p[1] - a[1]]
  const bp = [p[0] - b[0], p[1] - b[1]]
  const ab = [b[0] - a[0], b[1] - a[1]]
  const ba = [-ab[0], -ab[1]]

  if (dot(ap, ab) < 0) {
    return norm(ap)
  }
  if (dot(bp, ba) < 0) {
    return norm(bp)
  }
  return (
    Math.abs(ab[1] * p[0] - ab[0] * p[1] + b[0] * a[1] - b[1] * a[0]) /
    Math.hypot(b[1] - a[1], b[0] - a[0])
  )
}
