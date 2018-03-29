class Rotate2 {
  constructor (options = {}) {
    const defaultOptions = {
      eventTarget: document,
      center: null,
      onRotateStart: () => {},
      onRotate: () => {},
      onRotateEnd: () => {}
    }

    this.options = { ...defaultOptions, ...options }

    this.hasTouch = 'ontouchstart' in window
    this.events = {
      resize: 'onorientationchange' in window ? 'orientationchange' : 'resize',
      start: this.hasTouch ? 'touchstart' : 'mousedown',
      move: this.hasTouch ? 'touchmove' : 'mousemove',
      end: this.hasTouch ? 'touchend' : 'mouseup',
      cancel: this.hasTouch ? 'touchcancel' : 'mouseup'
    }

    this.centerPoint = null
    this.startPoint = null
    this.movingPoint = null

    this.deltaDegree = 0
    this.lastDegree = 0

    this.disabled = false

    this.init()
  }

  init () {
    this.bind()
  }

  bind () {
    const { start, move, end, resize } = this.events
    const { eventTarget } = this.options
    eventTarget.addEventListener(start, this.startHandler, { passive: false })
    eventTarget.addEventListener(move, this.moveHandler, { passive: false })
    eventTarget.addEventListener(end, this.endHandler)
    eventTarget.addEventListener(resize, this.resizeHandler)
  }

  unbind () {
    const { start, move, end, resize } = this.events
    const { eventTarget } = this.options
    eventTarget.removeEventListener(start, this.startHandler, { passive: false })
    eventTarget.removeEventListener(move, this.moveHandler, { passive: false })
    eventTarget.removeEventListener(end, this.endHandler)
    eventTarget.removeEventListener(resize, this.resizeHandler)
  }

  update () {
    this.deltaDegree = deg(
      this.centerPoint,
      this.startPoint,
      this.movingPoint
    )
    this.options.onRotate(this.deltaDegree, this.lastDegree)
  }

  startHandler = (e) => {
    if (this.disabled) {
      return
    }

    e.preventDefault()

    e = this.hasTouch ? e.touches[0] : e
    this.startPoint = { x: e.pageX, y: e.pageY }
    this.centerPoint = this.getCenter()

    this.options.onRotateStart()
  }

  moveHandler = () => {
    if (this.disabled || !this.startPoint) {
      return
    }

    e.preventDefault()

    e = this.hasTouch ? e.touches[0] : e
    this.movingPoint = { x: e.pageX, y: e.pageY }

    this.update()
  }

  endHandler = () => {
    if (this.disabled) {
      return
    }

    this.startPoint = null
    this.lastDegree += this.deltaDegree
    this.options.onRotateEnd()
  }

  resizeHandler = () => {}

  getCenter () {
    const { center, eventTarget } = this.options

    if (!center) {
      return centerOfElement(eventTarget)
    } else if (center instance of Node){
      return centerOfElement(center)
    } else {
      return center
    }
  }

  enable () {
    this.disabled = false
  }

  disable () {
    this.disabled = true
  }

  reset () {
    this.deltaDegree = this.lastDegree = 0
  }

  destroy () {
    this.unbind()
  }
}

// rad => deg
const rad2Deg = v => {
  return v * 180 / Math.PI
}

// deg => rad
const deg2Rad = v => {
  return v * Math.PI / 180
}

// length of two points
const len = (p1, p2) => {
  return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y))
}

const deg = (
  cp, // center point
  sp, // start point
  ep  // end point
) => {
  const rad = Math.atan2(ep.y - cp.y, ep.x - cp.x) - Math.atan2(sp.y - cp.y, sp.x - cp.x)
  return rad2Deg(rad)
}

const centerOfElement = elm => {
  const rect = elm.getBoundingClientRect()
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  }
}
