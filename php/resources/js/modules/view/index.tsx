
/*
##########################################################################################################################
*/

// Imports
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

// Modules
import { fillCard } from './card'
import { iterLayout } from './fill'
import { fillRoot } from './root'
import { getElementByIdUnsafe } from '../utils'

import * as canvasDisplay from './card/functions/canvas-display'
import * as chartFunctions from './card/functions/chart-functions'
import * as dropdownLegend from './card/functions/dropdown-legend'
import * as resizeFonts from './card/functions/resize-fonts'

// Types
import {
    DatasetCollection,
    Root
} from './types'

/*
##########################################################################################################################
*/

let layout: Root
let datasetList: string[]
let datasets: DatasetCollection

/*
##########################################################################################################################
*/

async function checkLayout(current: Root, next: Root) {
    if (JSON.stringify(current) === JSON.stringify(next)) return
    return await Promise.all([
        fillRoot(layout),
        iterLayout('dyn', layout?.body?.children)
    ])
}

/*
##########################################################################################################################
*/

async function getApiData(list: string[], current: DatasetCollection) {
    const next = await axios.get('')
    if (JSON.stringify(current) === JSON.stringify(next)) return
    return await Promise.all(
        list.map(
            axios.get
        )
    )
}

/*
##########################################################################################################################
*/

//Show Values Function
export async function render(nextLayout: Root) {
    return await Promise.all([
        checkLayout(layout, nextLayout),
        getApiData(datasetList, datasets)
    ])
}

/*
##########################################################################################################################
*/
