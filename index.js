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
    root.MyModule = factory()
  }
})(this, function () {

  var hasTouch = 'ontouchstart' in window
  var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize'
	var startEvent = hasTouch ? 'touchstart' : 'mousedown'
	var moveEvent = hasTouch ? 'touchmove' : 'mousemove'
	var endEvent = hasTouch ? 'touchend' : 'mouseup'
	var cancelEvent = hasTouch ? 'touchcancel' : 'mouseup'

  function Rotate2 (options, callback) {

    this._callback = callback
    this._startPoint = {}
  }

  Rotate2.prototype.bind = function () {
    this.eventTarget.addEventListener(startEvent, this.onStart.bind(this))
    this.eventTarget.addEventListener(startEvent, this.onStart.bind(this))
    this.eventTarget.addEventListener(startEvent, this.onStart.bind(this))
  }

  Rotate2.prototype.update = function () {

  }

  Rotate2.prototype.onStart = function (e) {
    var point = hasTouch ? e.touches[0] : e
    this._startPoint = [e.clientX, e.clientY]
  }

  Rotate2.prototype.onMove = function () {

  }

  Rotate2.prototype.onEnd = function () {

  }

  Rotate2.prototype.center = function (x, y) {

  }

  Rotate2.prototype.enable = function () {}

  Rotate2.prototype.disable = function () {}

  Rotate2.prototype.deg = function (sx, sy, ex, ey) {

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
  function len (x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
  }

  // s or e equals to o will returns NaN
  function deg (
    sx, sy, // start point
    ox, oy, // center point
    ex, ey  // end point
  ) {
    var rad = Math.acos(
      ((sx - ox) * (ex - ox) + (sy - oy) * (ey - oy)) /
      (len(sx, sy, ox, oy) * len(ex, ey, ox, oy))
    )
    return rad2Deg(rad)
  }

  return Rotate2
})


var r = new Rotate2({
  eventTarget: document,
  center:[ clientX, clientY ],
  safeRadiu: 10
}, deg => {})

r.deg(s, e)

r.disable()

r.enable()
