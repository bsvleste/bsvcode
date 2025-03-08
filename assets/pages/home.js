import { el, render } from '../../lib/dom.js'
import { Header } from '../components/Header.js'

console.log('ola chuch')

const targetNode = document.body
const config = { childList: true, subtree: true }

const callback = function (mutationList, obeserver) {
  for (let mutation of mutationList) {
    if (mutation.type === 'childList') {
      const element = document.querySelector('#home')
      if (element) {
        console.log(element)
        element.appendChild(render(el(Header)))
        obeserver.disconnect()
      }
    }
  }
}
const obeserver = new MutationObserver(callback)
obeserver.observe(targetNode, config)
