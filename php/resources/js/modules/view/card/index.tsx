
/*
##########################################################################################################################
*/

import ReactDOM from 'react-dom'
import { getElementByIdUnsafe } from '../../utils'
import type { Card } from '../types'

/*
##########################################################################################################################
*/

async function renderCard<
    ID extends string
>(
    id: ID,
    layout: Card
) {
    return ReactDOM.render(
        <>
            <div
                id={`${id}-header`}
                className="card-header d-flex align-items-center justify-content-between"
                style={{
                    border: '2px solid #343a40',
                    borderBottom: '0px',
                    backgroundColor: layout?.header?.color,
                    ...layout?.header?.css
                }}
            >
                <a
                    id={`${id}-name`}
                    className="card-title-sm font-weight-bold"
                    style={{
                        color: layout?.header?.font?.color,
                        fontSize: `${layout?.header?.font?.size}vmax`
                    }}
                >
                    {layout?.name}
                </a>
                <div className="dropdown">
                    <span id={`${id}-button`} className="btn btn-link">
                        <i
                            className="fas fa-bars"
                            style={{
                                color: layout?.header?.font?.color
                            }}
                        />
                    </span>
                    <div
                        id={`${id}-button-dropdown`}
                        className="dropdown-content"
                        style={{
                            border: "2px solid #343a40"
                        }}
                    />
                </div>
            </div>
            <div
                id={`${id}-body`}
                className="card-body align-items-center align-middle"
                style={{
                    border: '2px solid #343a40',
                    borderTop: '0px',
                    overflow: 'hidden',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    paddingBottom: '2.5px',
                    ...layout?.body?.css
                }}
            />
        </>,
        getElementByIdUnsafe(id)
    )
}

/*
##########################################################################################################################
*/

export async function fillCard<
    ID extends string
>(
    id: ID,
    layout: Card
) {
    // creates card header and title
    if (!document.getElementById(`${id}-name`))
        renderCard(id, layout)

    const thissel: Record<ElementType, number> = {
        table: 0,
        chart: 0,
        pie: 0,
        progress: 0,
        display: 0
    }

    // for each element
    layout?.elements.map(() (let i = 0; i < layout.elements.length; i++) {
        //get this element type
        const type = layout.elements[i].type
        //Import Element Modules
        let thiscn = thissel[type]
        elements[thisElement].addons.typechart = new Array()
        //Run Element Function
        let sa = await render[elementType](`${id}-body`, element, cnt)
        thissel[type] ++
    };
}

/*
##########################################################################################################################
*/
