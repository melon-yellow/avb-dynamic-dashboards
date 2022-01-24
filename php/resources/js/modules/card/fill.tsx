
/*
##########################################################################################################################
*/

import ReactDOM from 'react-dom'
import str from 'ts-misc/dist/utils/string'
import { getElementByIdUnsafe } from '../utils'
import { fillCard } from './card'
import type { Layout, Root, Children, Row, Col, Card } from './types'

/*
##########################################################################################################################
*/

async function fillTopNavColor(color?: string) {
    if (color) {
        getElementByIdUnsafe("topNav").style.backgroundColor = color
        const el = document.getElementsByClassName("sb-sidenav-footer")[0] as HTMLElement
        el.style.backgroundColor = color
    }
}
async function fillSideNavColor(color?: string) {
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
async function fillBodyColor(color?: string) {
    if (color) {
        const el = document.getElementsByTagName("body")[0]
        el.style.backgroundColor = color
    }
}
async function fillBodyFontColor(color?: string) {
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

async function fillRoot(layout: Root) {
    return await Promise.all([
        fillTopNavColor(layout?.topnav?.color),
        fillSideNavColor(layout?.sidenav?.color),
        setSideNavDisplay(layout?.sidenav?.display),
        fillBodyColor(layout?.body?.color),
        fillBodyFontColor(layout?.body?.font?.color),
        setBodyFontSize(layout?.body?.font?.size)
    ])
}

/*
##########################################################################################################################
*/

function fillRow<
    U extends string,
    I extends number,
    L extends Row
>(
    ups: U,
    index: I,
    layout: L
) {
    // set id
    const id = str.join([ups, '-row', index])
    ReactDOM.render(
        <div id={id} className="row" />,
        getElementByIdUnsafe(ups)
    )
    // run iteration
    if (layout?.children)
        iterLayout(id, layout.children)
}

/*
##########################################################################################################################
*/

function fillCol<
    I extends number,
    U extends string
>(
    ups: U,
    index: I,
    layout: Col
) {
    // set id
    const id = str.join([ups, '-col', index])
    const className = str.join(['col-xl-', layout.grid, ' col-md-', layout.grid]) 
    ReactDOM.render(
        <div id={id} className={className} />,
        getElementByIdUnsafe(ups)   
    )
    // run iteration
    if (layout?.children)
        iterLayout(id, layout.children)
}

/*
##########################################################################################################################
*/

function fillCard<
    I extends number,
    U extends string
>(
    ups: U,
    index: I,
    layout: Card
) {
    // set id
    const id = str.join([ups, '-card', index])
    ReactDOM.render(
        <div
            id={id}
            className="card mb-2 shadow card-responsive"
            style={{backgroundColor: layout?.body?.color}}
        />,
        getElementByIdUnsafe(ups)
    )
    // run iteration
    if (layout?.elements)
        iterElements(id, layout.elements)
}

/*
##########################################################################################################################
*/

// Fill Page Function
function fillLayout<
    L extends Layout,
    I extends number,
    U extends string
>(
    ups: U,
    index: I,
    layout: L
) {
    if (layout.type === 'row') return fillRow(ups, index, layout)
    if (layout.type === 'col') return fillCol(ups, index, layout)
    if (layout.type === 'card') return fillCard(ups, index, layout)
    throw new Error(`invalid children type: ${layout?.type}`)
}

/*
##########################################################################################################################
*/

export async function iterLayout<U extends string>(
    ups: U,
    layout: Children
) {
    return layout.map((child, index) => {
        return fillLayout(ups, index, child)
    })
}


/*
##########################################################################################################################
*/
