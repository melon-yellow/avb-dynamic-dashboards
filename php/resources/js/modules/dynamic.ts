
/*
##########################################################################################################################
*/

// Imports
import axios from 'axios'
import { is } from 'ts-misc/dist/utils/guards'

// Modules
import { render } from './view'
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
async function fetchLayout() {
    const { data } = await axios.get(getLayoutPath())
    return await render(data)
}

// Update Only On Change
async function checkUpdate(current: number, next: number) {
    if (current === next) return []
    current = next
    return await fetchLayout()
}

/*
##########################################################################################################################
*/

// Get Stale Data First
async function getStale() {
    return await Promise.all([
        callUpdate(),
        fetchLayout()
    ])
}

// Cyclic Update Request
async function getUpdate() {
    const timestamp = await callUpdate()
    return await Promise.all([
        timestamp,
        checkUpdate(lastUpdate, timestamp)
    ])
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
