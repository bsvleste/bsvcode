import { el } from '../../lib/dom.js'

export function Header() {
  return el('header', [el('ul', [el('li', 'link1'), el('li', 'link2')])])
}
