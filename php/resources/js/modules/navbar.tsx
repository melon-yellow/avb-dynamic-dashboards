
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
const resCurrent = await axios.get(`${headers.dir}/main.php?action=route&path=this`)
let current: JSONRoute = resCurrent?.data
if (!isJSONRoute(current)) throw new Error('invalid route "this"')

// Get path to parent
const resParent = await axios.get(`${headers.dir}/main.php?action=route&path=parent`)
let parent: JSONRoute = resParent?.data
if (!isJSONRoute(parent)) parent = current

// Get path to group
const resChilds = await axios.get(`${headers.dir}/main.php?action=route&path=childs`)
let group: JSONRouteCollection = resChilds?.data
if (!isJSONRouteCollection(group)) {
    const resBrothers = await axios.get(`${headers.dir}/main.php?action=route&path=brothers`)
    group = resBrothers?.data
    if (!isJSONRouteCollection(group)) throw new Error('invalid route "group"')
}

/*
##########################################################################################################################
*/

// Add Title to TopNav
const TopNav = document.getElementById('topNav')
if (!TopNav) throw new Error('couldnt find "#topNav"')
ReactDOM.render(
    <a
        id={parent?.key}
        href={`?key=${parent?.key}`}
        className={[
            'navbar-brand',
            'font-weight-bold'
        ].join(' ')}
    >{parent?.this}</a>,
    TopNav
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
    if (headers.key == group[item].key) {
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
