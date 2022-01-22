
/*
##########################################################################################################################
*/

// Imports
import axios from 'axios'
import { is } from 'ts-misc/dist/utils/guards'

// Modules
import { headers } from '../app' 
import * as view from './card/view'

/*
##########################################################################################################################
*/

// Last update
export let lastUpdate: number

/*
##########################################################################################################################
*/

// No Cache Bypass
const layout = (nc: unknown) => `${headers.dir}/layout.json?nocache=${nc}`


// Cyclic Update Request
const update = async() => {
    // First Run
    if (lastUpdate === undefined) {
        const { data: stale } = await axios.get(layout(new Date().getTime()))
        view.render(stale)
    }

    // Request Update
    const { data: update } = await axios.get(`${headers.dir}/main.php?action=update`)
    if (!is.object(update)) throw new Error('invalid response')
    if (!is.in(update, 'timestamp', 'number')) throw new Error('invalid response')
    if (update.timestamp != lastUpdate) {
        const hot = await axios.get(layout(new Date().getTime()))
        view.render(hot?.data)
        lastUpdate = update.timestamp
    }
}

/*
##########################################################################################################################
*/

// First Run
setTimeout(update, 0)

// Cyclic Run (each second)
setInterval(update, 1000)

/*
##########################################################################################################################
*/
