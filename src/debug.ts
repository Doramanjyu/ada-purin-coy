export const isDebug = () => {
  const p = new URLSearchParams(window.location.search)
  return !!p.get('debug')
}
