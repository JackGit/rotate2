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

  function Rotate2 (options, callback) {

    this.eventTarget = document
    this._callback = d => {
      // document.getElementById('circle').style.transform = 'rotateZ(' + d + 'deg)'
      var v = d > 0 ? d : 360 + d
      console.log(v, Math.floor(v / 10)) // map [0 - 180, -180 - 0] into [0 - 360]
      updateImage(35 - Math.floor(v / 10))
    }

    this._centerPoint = { x: 250, y: 250 }
    this._startPoint = null
    this._movingPoint = null

    this.bind()
  }

  Rotate2.prototype.bind = function () {
    this.eventTarget.addEventListener(startEvent, this.onStart.bind(this))
    this.eventTarget.addEventListener(moveEvent, this.onMove.bind(this))
    this.eventTarget.addEventListener(endEvent, this.onEnd.bind(this))
  }

  Rotate2.prototype.update = function () {
    var degree = deg(
      this._centerPoint,
      this._startPoint,
      this._movingPoint
    )
    this._callback && this._callback(degree)
  }

  Rotate2.prototype.onStart = function (e) {
    e = hasTouch ? e.touches[0] : e
    this._startPoint = { x: e.pageX, y: e.pageY }
  }

  Rotate2.prototype.onMove = function (e) {
    e.preventDefault()
    if (!this._startPoint) {
      return
    }

    e = hasTouch ? e.touches[0] : e
    this._movingPoint = { x: e.pageX, y: e.pageY }

    this.update()
  }

  Rotate2.prototype.onEnd = function () {
    this._startPoint = null
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

  function getCenterOfElement (elm) {

  }

  return Rotate2
})

/*
var r = new Rotate2({
  eventTarget: document,
  center: [pageX, pageY], // or an dom element
  innerRadius: 10,
  outerRadius: Infinity
}, deg => {})

r.deg(s, e)

r.disable()

r.enable()
*/
