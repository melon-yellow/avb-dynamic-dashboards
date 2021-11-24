
/*
##########################################################################################################################
*/

// Imports
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
let current: JSONRoute | null = resCurrent?.data
if (!isJSONRoute(current)) current = null

// Get path to parent
const resParent = await axios.get(`${headers.dir}/main.php?action=route&path=parent`)
let parent: JSONRoute | null = resParent?.data
if (!isJSONRoute(parent)) parent = current

// Get path to group
const resChilds = await axios.get(`${headers.dir}/main.php?action=route&path=childs`)
let group: JSONRouteCollection | null = resChilds?.data
if (!isJSONRouteCollection(group)) {
    const resBrothers = await axios.get(`${headers.dir}/main.php?action=route&path=brothers`)
    group = resBrothers?.data
    if (!isJSONRouteCollection(group)) group = null
}

/*
##########################################################################################################################
*/

// Create topnav title
document.getElementById('topNav')
    ?.insertAdjacentHTML('beforeend',
        `<a id="${parent?.key}" ` +
        `href="index.php?key=${parent?.key}" ` +
        'class="navbar-brand font-weight-bold">' +
        `${parent?.this}</a>`
    )

// Create navbar items
if (group) {
    for (const item in group) {
        document.getElementById('navBar')
            ?.insertAdjacentHTML('beforeend',
                `<a id="${group[item].key}" ` +
                `href="index.php?key=${group[item].key}" ` +
                'class="nav-link">' +
                `${group[item].this}</a>`
            )
    }
}

// Highlight current page on navbar
for (const item in group) {
    if (headers.key == group[item].key) {
        document.getElementById(group[item].key)
            ?.classList.add('active')
    }
}

// Creates the title of the page container
document.getElementById('pageContainer')
    ?.insertAdjacentHTML('beforeend',
        '<div id="containerTitle"' + 
        'class="container-title align-items-center font-weight-bold">' +
        `${current?.this}</div>`
    )

// Set minimum size of page as navSize + 100
const navSize = Number(document.getElementById('navBar')?.offsetHeight)
const cont = document.getElementById('pageContainer')
if (cont) cont.style.minHeight = `${navSize + 100}px`

/*
##########################################################################################################################
*/
