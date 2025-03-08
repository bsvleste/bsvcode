import { Header } from '../assets/components/Header.js'
import { el, render } from '../lib/dom.js'
/* 

const router = new Router()
router.add('/', '/assets/pages/home.html')
router.add('/about', '/assets/pages/about.html')
router.add(404, '/assets/pages/404.html')

router.handle()

window.onpopstate = () => router.handle()
window.route = () => router.route()

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
 */

const app = document.getElementById('app')
function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
}
const PAGES = {
  home: render(el(Header)),
  sobre: render(el('h2', 'Ai papai funcionou'))
}
const Erro = {
  eror: app.appendChild(render(el('h1', 'Pagina não encontrada')))
}
function loadPage(page) {
  clearContainer(app)
  app.appendChild(PAGES[page] || Erro['eror'])

  /* switch (page) {
    case 'home':
      app.appendChild(render(el(Header)))
      break
      case 'sobre':
      app.appendChild(render(el('h2', 'Ai papai funcionou')))
      break
    default:
      loadPage('home')
      break
  } */
}

function handleRoute() {
  //remove o hash da string
  const hash = window.location.hash.substring(1)
  loadPage(hash || 'home')
}
window.addEventListener('hashchange', handleRoute)

window.addEventListener('load', handleRoute)
