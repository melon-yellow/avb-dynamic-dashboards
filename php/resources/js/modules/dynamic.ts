
/*
##########################################################################################################################
*/

// Imports
import axios from 'axios'
import { is } from 'ts-misc/dist/utils/guards'

// Modules
import * as view from './card/view'
import { getElementByIdUnsafe } from './utils'

/*
##########################################################################################################################
*/

// Last update
export let lastUpdate: number

/*
##########################################################################################################################
*/

// Get Layout Directory
function getDir() { 
    const dir = getElementByIdUnsafe('dir').getAttribute('content')
    if (!dir) throw new Error('"#dir" content invalid')
    return dir
}

// No Cache Bypass
function getLayoutPath() {
    return `${getDir()}/layout.json?nocache=${new Date().getTime()}`
}

/*
##########################################################################################################################
*/

// Get Last Update Timestamp
async function callUpdate() {
    const { data: update } = await axios.get(`${getDir()}/main.php?action=update`)
    if (!is.in(update, 'timestamp', 'number')) throw new Error('invalid response')
    return update.timestamp
}

// Sigle Update Request
async function renderLayout() {
    const { data } = await axios.get(getLayoutPath())
    return view.render(data)
}

async function getStale() {
    return await Promise.all([
        renderLayout(),
        callUpdate()
    ])
}

// Cyclic Update Request
async function getUpdate() {
    const timestamp = await callUpdate()
    if (lastUpdate != timestamp) {
        lastUpdate = timestamp
        renderLayout()
    }
    return timestamp
}

/*
##########################################################################################################################
*/

// Start Dynamic Render Loop
export async function dynamicDashboard() {
    return await Promise.all([
        getStale(),
        setInterval(getUpdate, 1000)
    ])
}

/*
##########################################################################################################################
*/
