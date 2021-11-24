
// Imports
import { is } from 'ts_misc/dist/utils/guards.js'

// Modules
import { headers } from '../index.js' 
import * as view from './card/view.js'

// Last update
let lastupdate: number

// Cyclic Run of Show Values Function
const update = () => {
    // Get reference json folder
    const nc = new Date().getTime()
    const url = `${headers.dir}/layout.json?nocache=${nc}`

    // First Run
    if (lastupdate === undefined) view.render(url)

    // Request Update
    axios.get(`${headers.dir}/main.php?action=update`)
        .catch(() => null)
        .then(data => {
            if (!is.object(data)) throw new Error('invalid response')
            if (!is.in(data, 'timestamp', 'number')) throw new Error('invalid response')
            if (data.timestamp != lastupdate) {
                view.render(url)
                lastupdate = data.timestamp
            }
        })
}

// First Run
setTimeout(update, 0)

// Cyclic Run (each second)
setInterval(update, 1000)