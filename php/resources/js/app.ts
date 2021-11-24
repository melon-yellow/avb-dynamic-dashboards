
// Modules
import * as navbar from './modules/navbar.js'
import * as events from './modules/events.js'
import * as dynamic from './modules/dynamic.js'

// Headers
export const headers = {
    get url() { return document.getElementById("url")?.getAttribute("href") },
    get dir() { return document.getElementById("dir")?.getAttribute("content") },
    get key() { return document.getElementById("key")?.getAttribute("content") }
} as const

// Page
export const page = {
    navbar,
    events,
    dynamic
} as const
