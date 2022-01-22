
/*
##########################################################################################################################
*/

// Imports
import ReactDOM from 'react-dom'
import axios from 'axios'
import { is } from 'ts-misc/dist/utils/guards'

// Modules
import { headers } from '../app'

/*
##########################################################################################################################
*/

interface JSONRoute {
    key: string
    this: string
}

type JSONRouteCollection = Record<string, JSONRoute>

function isJSONRoute(obj: unknown): obj is JSONRoute {
    if (!is.object(obj)) return false
    if (!is.in(obj, ['key','this'], 'string')) return false
    else return true
}

function isJSONRouteCollection(obj: unknown): obj is JSONRouteCollection {
    if (!is.object(obj)) return false
    if (!Object.entries(obj).every(v => isJSONRoute(v[1]))) return false
    else return true
}

/*
##########################################################################################################################
*/

// Get path to current page
const mainPHP = (params: string) => axios.get(`${headers.dir}/main.php?${params}`)
const routePHP = (route: string) => mainPHP(`action=route&path=${route}`)
const route = async (route: string) => (await routePHP(route))?.data

// Get Routes
const routes = async() => {
    // Get Path to Current
    const current = await route('this')
    if (!isJSONRoute(current))
        throw new Error('invalid route "this"')
    // Get Path to Parent
    let parent = await route('parent')
    if (!isJSONRoute(parent?.data)) parent = current
    // Get Path to Group
    let group = await route('childs')
    if (!isJSONRouteCollection(group)) {
        const brothers = await routePHP('brothers')
        group = brothers
        if (!isJSONRouteCollection(group))
            throw new Error('invalid route "group"')
    }
    // Return Routes
    return { current, parent, group }
}

/*
##########################################################################################################################
*/

// Add Title to TopNav
const renderTopNav = (p: { parent: JSONRoute }) =>
    ReactDOM.render(
        <a
            id={p.parent.key}
            href={`?key=${p.parent.key}`}
            className="navbar-brand font-weight-bold"
        >{p.parent.this}</a>,
        document.getElementById('topNav')
    )

// Create NavBar Items
const navBarItems: JSX.Element[] = []
for (const item in group) {
    navBarItems.push(
        <a
            id={group[item]?.key}
            href={`?key=${group[item]?.key}`}
            className="nav-link"
        >{group[item]?.this}</a>
    )
}

// Add Items to NavBar
const NavBar = document.getElementById('navBar')
if (!NavBar) throw new Error('couldnt find "#navBar"')
ReactDOM.render(navBarItems, NavBar)

// Highlight current page on navbar
for (const item in group) {
    if (headers.key() == group[item].key) {
        document.getElementById(group[item].key)
            ?.classList.add('active')
    }
}

// Get Page Container
const PageContainer = document.getElementById('pageContainer')
if (!PageContainer) throw new Error('couldnt find "#pageContainer"')

// Add Title to Page Container
ReactDOM.render(
    <div
        id="containerTitle"
        className={[
            'container-title',
            'align-items-center',
            'font-weight-bold',
            'text-dark'
        ].join(' ')}
    >{current?.this}</div>,
    PageContainer
)

// Set minimum size of page as navSize + 100
const navSize = Number(NavBar?.offsetHeight)
PageContainer.style.minHeight = `${navSize + 100}px`

/*
##########################################################################################################################
*/
