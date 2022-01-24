
/*
##########################################################################################################################
*/

import ReactDOM from 'react-dom'
import str from 'ts-misc/dist/utils/string'
import { getElementByIdUnsafe } from '../utils'
import { fillCard } from './card'
import type { Layout, Children, Row, Col, Card } from './types'

/*
##########################################################################################################################
*/

type RenderSpawn = void | Promise<RenderSpawn[]>

/*
##########################################################################################################################
*/

function drawRow<
    U extends string,
    I extends number,
    L extends Row
>(
    ups: U,
    index: I,
    layout: L
): RenderSpawn {
    // set id
    const id = str.join([ups, '-row', index])
    ReactDOM.render(
        <div id={id} className="row" />,
        getElementByIdUnsafe(ups)
    )
    // run iteration
    if (layout?.children)
        return iterLayout(id, layout.children)
}

/*
##########################################################################################################################
*/

function drawCol<
    I extends number,
    U extends string
>(
    ups: U,
    index: I,
    layout: Col
): RenderSpawn {
    // set id
    const id = str.join([ups, '-col', index])
    const className = str.join(['col-xl-', layout.grid, ' col-md-', layout.grid]) 
    ReactDOM.render(
        <div id={id} className={className} />,
        getElementByIdUnsafe(ups)   
    )
    // run iteration
    if (layout?.children)
        return iterLayout(id, layout.children)
}

/*
##########################################################################################################################
*/

function drawCard<
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
    // run fill card
    return fillCard(id)
}

/*
##########################################################################################################################
*/

// Fill Page Function
function drawLayout<
    L extends Layout,
    I extends number,
    U extends string
>(
    ups: U,
    index: I,
    layout: L
) {
    if (layout.type === 'row') return drawRow(ups, index, layout)
    if (layout.type === 'col') return drawCol(ups, index, layout)
    if (layout.type === 'card') return drawCard(ups, index, layout)
    throw new Error(`invalid children type: ${layout?.type}`)
}

/*
##########################################################################################################################
*/

export async function iterLayout<U extends string>(
    ups: U,
    layouts?: Children
) {
    if (!layouts) throw new Error(`invalid layouts: ${ups}`)
    return layouts.map((child, index) => {
        return drawLayout(ups, index, child)
    })
}


/*
##########################################################################################################################
*/
