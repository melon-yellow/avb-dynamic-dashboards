
/*
##########################################################################################################################
*/

import ReactDOM from 'react-dom'
import { getElementByIdUnsafe } from '../utils'
import type { Root } from './types'

/*
##########################################################################################################################
*/

function setTitle() {
    return ReactDOM.render(
        <div
            id="containerTitle"
            className={[
                'container-title',
                'align-items-center',
                'font-weight-bold',
                'text-dark'
            ].join(' ')}
        >{
            getElementByIdUnsafe('containerTitle').innerText
        }</div>,
        getElementByIdUnsafe('pageContainer')
    )
}

/*
##########################################################################################################################
*/

async function setTopNavColor(color?: string) {
    if (color) {
        getElementByIdUnsafe("topNav").style.backgroundColor = color
        const el = document.getElementsByClassName("sb-sidenav-footer")[0] as HTMLElement
        el.style.backgroundColor = color
    }
}
async function setSideNavColor(color?: string) {
    if (color) {
        getElementByIdUnsafe("navBar").style.color = color
        const el = document.getElementsByClassName("sb-sidenav-menu")[0] as HTMLElement
        el.style.backgroundColor = color
        
    }
}
async function setSideNavDisplay(display?: boolean) {
    const els = document.getElementsByClassName("sb-sidenav-toggled")
    if (display != (els.length > 0)) {
        getElementByIdUnsafe("body").classList.toggle("sb-sidenav-toggled")
    }
}
async function setBodyColor(color?: string) {
    if (color) {
        const el = document.getElementsByTagName("body")[0]
        el.style.backgroundColor = color
    }
}
async function setBodyFontColor(color?: string) {
    if (color) {
        getElementByIdUnsafe("containerTitle").style.color = color
    }
}
async function setBodyFontSize(size?: number) {
    if (size) {
        getElementByIdUnsafe("containerTitle").style.fontSize = `${size}vmax`;
    }
}

/*
##########################################################################################################################
*/

export async function fillRoot(layout: Root) {
    return await Promise.all([
        setTitle(),
        setTopNavColor(layout?.topnav?.color),
        setSideNavColor(layout?.sidenav?.color),
        setSideNavDisplay(layout?.sidenav?.display),
        setBodyColor(layout?.body?.color),
        setBodyFontColor(layout?.body?.font?.color),
        setBodyFontSize(layout?.body?.font?.size)
    ])
}

/*
##########################################################################################################################
*/
