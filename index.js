var align = require('align')
var classes = require('classes')
var event = require('event')
var Emitter = require('emitter')
var radio = require('radio')
var delegate = require('delegate')

/**
 * dropdown with trigger element and optional pos offset
 *
 * @public
 * @param  {Element}  el
 * @param {String} pos
 * @param {Object} offset
 */
function dropdown(el, pos, offset) {
  if (!(this instanceof dropdown)) return new dropdown(el, pos)
  var target = this.target = el.nextElementSibling
  if (!classes(target).has('dropdown-menu')) throw new Error('dropdown element not found')
  this.pos = pos || 'br-tr'
  this.el = el
  this.offset = offset || {y: 8}
  event.bind(el, 'click', this.onTriggerClick.bind(this))
  delegate.bind(target, 'li', 'click', this.onTargetClick.bind(this))
  document.addEventListener('click', function () {
    classes(target).add('hide')
  })
}

Emitter(dropdown.prototype)

dropdown.prototype.onTriggerClick = function (e) {
  e.preventDefault()
  e.stopPropagation()
  if (classes(this.target).has('hide')) {
    classes(this.target).remove('hide')
    align(this.el, this.target, this.pos, this.offset)
  } else {
    classes(this.target).add('hide')
  }
}

dropdown.prototype.onTargetClick = function (e) {
  var li = e.delegateTarget
  var href = li.getAttribute('data-href')
  e.preventDefault()
  e.stopPropagation()
  radio(li)
  if (href) {
    window.location.href = href
  } else {
    this.emit('select', li)
  }
}

dropdown.prototype.hide = function () {
  classes(this.target).add('hide')
}

module.exports = dropdown
