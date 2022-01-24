
/*
##########################################################################################################################
*/

// Imports
import axios from 'axios'

// Modules
import { iterLayout } from './draw'
import { fillRoot } from './root'
import { getElementByIdUnsafe } from '../utils'

import * as canvasDisplay from './card/functions/canvas-display'
import * as chartFunctions from './card/functions/chart-functions'
import * as dropdownLegend from './card/functions/dropdown-legend'
import * as resizeFonts from './card/functions/resize-fonts'

// Types
import { DatasetCollection, Root } from './types'

/*
##########################################################################################################################
*/

let layout: Root
let datasetList: string[]
let datasets: DatasetCollection

/*
##########################################################################################################################
*/

async function Void() {}

/*
##########################################################################################################################
*/

function getHref() { return getElementByIdUnsafe('url').getAttribute('href') }
function dataUrl() { return `${getHref()}api/data/` }

/*
##########################################################################################################################
*/

async function checkLayout(current: Root, next: Root) {
    if (JSON.stringify(current) === JSON.stringify(next)) return Void()
    return await Promise.all([
        fillRoot(layout),
        iterLayout('dyn', layout?.body?.children)
    ])
}

/*
##########################################################################################################################
*/

async function getApiData(list: string[], current: DatasetCollection) {
    // Get Datasets
    const { data: next } = await axios.post(
        dataUrl(), { datasets: list }
    )
    // Check Datasets
    if (JSON.stringify(current) === JSON.stringify(next)) return
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
