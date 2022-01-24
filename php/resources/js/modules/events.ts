
/*
##########################################################################################################################
*/

import { getElementByIdUnsafe } from './utils'

/*
##########################################################################################################################
*/

// Scroll
export let scroll: number = 0

/*
##########################################################################################################################
*/

// Scroll Function
function onScroll() {
    const nowScroll = document.documentElement.scrollTop
    const delta = nowScroll - scroll
    if (delta == 0) return
    // Calc Side Scroll
    let sideScroll = getElementByIdUnsafe('div.sb-sidenav-menu').scrollTop
    sideScroll += delta
    if (sideScroll < 0) sideScroll = 0
    // Fix Navbar Overflow
    let navSize = getElementByIdUnsafe('navBar').offsetHeight
    if (sideScroll > navSize) sideScroll = navSize
    // Assign Scroll
    getElementByIdUnsafe('div.sb-sidenav-menu').scrollTop = sideScroll
    scroll = document.documentElement.scrollTop
}

async function setOnScrollEvent() {
    getElementByIdUnsafe('body').onscroll = onScroll
}

/*
##########################################################################################################################
*/

// Toggle Function
function onSideNavToggle() {
    getElementByIdUnsafe('body').classList.toggle('sb-sidenav-toggled')
}

async function setOnSideNavToggleEvent() {
    getElementByIdUnsafe('sidebarToggle').onclick = onSideNavToggle
}

/*
##########################################################################################################################
*/

export async function setEvents() {
    return await Promise.all([
        setOnScrollEvent(),
        setOnSideNavToggleEvent()
    ])
}

/*
##########################################################################################################################
*/
