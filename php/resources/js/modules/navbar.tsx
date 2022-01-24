
/*
##########################################################################################################################
*/

// Imports
import ReactDOM from 'react-dom'
import axios from 'axios'
import { is } from 'ts-misc/dist/utils/guards'

// Modules
import { getElementByIdUnsafe } from './utils'

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
function mainPHP(params: string) {
    return axios.get(`${
        getElementByIdUnsafe('dir').getAttribute('content')
    }/main.php?${params}`)
}
function routePHP(route: string) { return mainPHP(`action=route&path=${route}`) }
async function getRoute(route: string) { return (await routePHP(route))?.data }

async function getParentRoute() {
    // Get Path to Current and Parent
    const [current, par] = await Promise.all([
        getRoute('this'), getRoute('parent')
    ])
    if (!isJSONRoute(current)) throw new Error('invalid route "this"')
    const parent = isJSONRoute(par) ? par : current
    // Return Data
    return { current, parent }
}

async function getGroupRoute() {
    // Get Path to Group
    let [childs, brothers] = await Promise.all([
        getRoute('childs'), getRoute('brothers')
    ])
    const group = isJSONRouteCollection(childs) 
        ? childs : isJSONRouteCollection(brothers)
            ? brothers : null
    if (!group) throw new Error('invalid route "group"')
    // Return Data
    return { group }
}

// Get Routes
async function getRoutes() {
    // Get Path to Current
    const [{ current, parent }, { group }] =
        await Promise.all([getParentRoute(), getGroupRoute()])
    // Return Routes
    return { current, parent, group }
}

/*
##########################################################################################################################
*/

// Create NavBar Items
function getNavBarItems(group: JSONRouteCollection) {
    return Object.keys(group).map(i =>
        <a
            id={group[i].key}
            href={`?key=${group[i].key}`}
            className="nav-link"
        >{group[i].this}</a>
    )
}

// Highlight current page on navbar
async function highlightCurrentPage(group: JSONRouteCollection) {
    const key = getElementByIdUnsafe('key').getAttribute('content')
    if (!is.string(key)) throw new Error('"#key" content invalid')
    Object.keys(group).map(i =>
        (key == group[i].key) ?
            getElementByIdUnsafe(group[i].key)
                .classList.add('active')
        : null
    )
}

// Set minimum size of page as navSize + 100
async function setContainerMinSize() {
    getElementByIdUnsafe('pageContainer').style.minHeight = `${
        getElementByIdUnsafe('navBar').offsetHeight + 100
    }px`
}

// Add Items to NavBar
async function renderNavBarItems(p: { group: JSONRouteCollection }) {
    ReactDOM.render(
        getNavBarItems(p.group),
        getElementByIdUnsafe('navBar')
    )
    await Promise.all([
        highlightCurrentPage(p.group),
        setContainerMinSize()
    ])
}

// Add Title to TopNav
async function renderTopNav(p: { parent: JSONRoute }) {
    return ReactDOM.render(
        <a
            id={p.parent.key}
            href={`?key=${p.parent.key}`}
            className="navbar-brand font-weight-bold"
        >{p.parent.this}</a>,
        getElementByIdUnsafe('topNav')
    )
}

// Add Title to Page Container
async function renderContainer(p: { current: JSONRoute }) {
    return ReactDOM.render(
        <div
            id="containerTitle"
            className={[
                'container-title',
                'align-items-center',
                'font-weight-bold',
                'text-dark'
            ].join(' ')}
        >{p.current.this}</div>,
        getElementByIdUnsafe('pageContainer')
    )
}

/*
##########################################################################################################################
*/

export async function renderNavBar() {
    const routes = await getRoutes()
    return await Promise.all([
        renderTopNav(routes),
        renderNavBarItems(routes),
        renderContainer(routes)
    ])
}

/*
##########################################################################################################################
*/
