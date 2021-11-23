
// Modules
import * as navbar from './modules/navbar.js'
import * as sidenav from './modules/sidenav.js'
import * as dynamic from './modules/dynamic.js'

// Headers
export const headers = {
    get url() { return document.getElementById("url").getAttribute("href") },
    get dir() { return document.getElementById("dir").getAttribute("content") },
    get key() { return document.getElementById("key").getAttribute("content") }
} as const

// Page
export const page = {
    navbar,
    sidenav,
    dynamic
} as const
