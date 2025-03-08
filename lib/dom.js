function isChildren(children) {
  return Array.isArray(children) || typeof children === 'string'
}
const isString = (value) => typeof value === 'string'
const toArray = (value) => (Array.isArray(value) ? value : [value])

function extracTagName(tagName) {
  return tagName.match(/^(\w+)/)[0]
}
function extractClassesAndId(tagName) {
  const regexp = /[\#\.]{1}([\w\-\_]*)/gi
  return Array.from(tagName.matchAll(regexp)).reduce(
    (acc, current) => {
      if (current[0].startsWith('.')) {
        acc.classes.push(current[1])
      } else {
        acc.id.push(current[1])
      }
      return acc
    },
    {
      classes: [],
      id: []
    }
  )
}
export function el(tag, attrsArr, childrensArray) {
  if (typeof tag === 'function') {
    return tag(attrsArr)
  }
  const autoCloseTags = [
    'img',
    'br',
    'input',
    'hr',
    'meta',
    'link',
    'base',
    'col',
    'area',
    'param',
    'source',
    'track'
  ]
  const tagName = extracTagName(tag)

  const isAutoClose = autoCloseTags.includes(tagName.toLowerCase())
  const { classes, id } = extractClassesAndId(tag)
  const attrs = !isChildren(attrsArr) ? attrsArr : {}
  if (id.length) {
    attrs.id = id.pop()
  }
  if (classes.length) {
    attrs.classNames = classes
  }
  const childrens = toArray(isChildren(attrsArr) ? attrsArr : childrensArray)

  return {
    tagName,
    nodeType: 'element',
    isAutoClose,
    attrs,
    childrens: childrens ? childrens : []
  }
}

export function renderServer(node) {
  if (isString(node)) return node
  if (node.nodeType === 'fragment') {
    return node.childrens.map(renderServer).join('')
  }
  const { tagName, attrs, childrens, isAutoClose } = node
  const attrsHtml = Object.entries(attrs)
    .map(([key, value]) => {
      const values = Array.isArray(value) ? value.join(' ') : value
      return `${key}="${values}"`
    })
    .join(' ')
    .replaceAll('classNames', 'class')
  const startTag = `<${tagName} ${attrsHtml && ''}${attrsHtml} >`
  const endTag = `</${tagName}>`
  const autoClose = `<${tagName} ${attrsHtml && ''}${attrsHtml} />`
  const childrenHTML = childrens
    .map((children) => renderServer(children))
    .join('')
  const html = isAutoClose ? autoClose : `${startTag} ${childrenHTML} ${endTag}`
  return html
}
export function render(node) {
  if (isString(node)) return document.createTextNode(node)
  const { tagName, attrs, childrens } = node
  const $element =
    node.nodeType === 'fragment'
      ? document.createDocumentFragment()
      : document.createElement(tagName)
  Object.entries(attrs).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value.join(' ') : value
    $element.setAttribute(key.replaceAll('classNames', 'class'), values)
  })
  childrens.forEach((children) => {
    $element.appendChild(render(children))
  })

  return $element
}
export function Fragment(childrens) {
  return {
    tagName: null,
    nodeType: 'fragment',
    attrs: {},
    childrens: childrens ? childrens : []
  }
}
