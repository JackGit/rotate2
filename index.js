(function (root, factory) {
  'use strict'
  /* istanbul ignore next */
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else {
    // Browser globals
    root.Rotate2 = factory()
  }
})(this, function () {

  var hasTouch = 'ontouchstart' in window
  var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize'
	var startEvent = hasTouch ? 'touchstart' : 'mousedown'
	var moveEvent = hasTouch ? 'touchmove' : 'mousemove'
	var endEvent = hasTouch ? 'touchend' : 'mouseup'
	var cancelEvent = hasTouch ? 'touchcancel' : 'mouseup'

  function Rotate2 (options) {

    if (!options) {
      console.error('Rotate2(options) options is required')
      return
    }

    this.eventTarget = options.eventTarget || document
    this.callback = options.onRotate

    this.centerPoint = options.center || centerOfElement(this.eventTarget)
    this.startPoint = null
    this.movingPoint = null

    this.deltaDegree = 0
    this.lastDegree = 0

    this.disabled = false

    ;['onStart', 'onMove', 'onEnd', 'onResize'].forEach(function (m) {
      this[m] = this[m].bind(this)
    }, this)

    this.init()
  }

  Rotate2.prototype.init = function () {
    this.bind()
  }

  Rotate2.prototype.bind = function () {
    this.eventTarget.addEventListener(startEvent, this.onStart, { passive: false })
    this.eventTarget.addEventListener(moveEvent, this.onMove, { passive: false })
    this.eventTarget.addEventListener(endEvent, this.onEnd)
    this.eventTarget.addEventListener(resizeEvent, this.onResize)
  }

  Rotate2.prototype.unbind = function () {
    this.eventTarget.removeEventListener(startEvent, this.onStart)
    this.eventTarget.removeEventListener(moveEvent, this.onMove)
    this.eventTarget.removeEventListener(endEvent, this.onEnd)
    this.eventTarget.removeEventListener(resizeEvent, this.onResize)
  }

  Rotate2.prototype.update = function () {
    this.deltaDegree = deg(
      this.centerPoint,
      this.startPoint,
      this.movingPoint
    )
    this.notify()
  }

  Rotate2.prototype.notify = function () {
    this.callback && this.callback(this.deltaDegree, this.lastDegree)
  }

  Rotate2.prototype.onStart = function (e) {
    if (this.disabled) {
      return
    }

    e.preventDefault()

    e = hasTouch ? e.touches[0] : e
    this.startPoint = { x: e.pageX, y: e.pageY }
  }

  Rotate2.prototype.onMove = function (e) {
    if (this.disabled || !this.startPoint) {
      return
    }

    e.preventDefault()

    e = hasTouch ? e.touches[0] : e
    this.movingPoint = { x: e.pageX, y: e.pageY }

    this.update()
  }

  Rotate2.prototype.onEnd = function () {
    if (this.disabled) {
      return
    }

    this.startPoint = null
    this.lastDegree += this.deltaDegree
  }

  Rotate2.prototype.onResize = function () {

  }

  /* public methods */
  Rotate2.prototype.center = function (point) {
    if (point) {
      this.centerPoint = point
    } else {
      return this.centerPoint
    }
  }

  Rotate2.prototype.enable = function () {
    this.disabled = false
  }

  Rotate2.prototype.disable = function () {
    this.disabled = true
  }

  Rotate2.prototype.reset = function () {
    this.deltaDegree = this.lastDegree = 0
    this.notify()
  }

  Rotate2.prototype.destroy = function () {
    this.unbind()
  }

  /* util functions */

  // rad => deg
  function rad2Deg (v) {
    return v * 180 / Math.PI
  }

  // deg => rad
  function deg2Rad (v) {
    return v * Math.PI / 180
  }

  // length of two points
  function len (p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y))
  }

  function deg (
    cp, // center point
    sp, // start point
    ep  // end point
  ) {
    var rad = Math.atan2(ep.y - cp.y, ep.x - cp.x) - Math.atan2(sp.y - cp.y, sp.x - cp.x)
    return rad2Deg(rad)
  }

  function centerOfElement (elm) {
    return {
      x: elm.offsetLeft + elm.clientWidth / 2,
      y: elm.offsetTop + elm.clientHeight / 2
    }
  }

  return Rotate2
})
