
// Modules
import { renderNavBar } from './modules/navbar.js'
import { setEvents } from './modules/events.js'
import { dynamicDashboard } from './modules/dynamic.js'

// Main Function
async function main() {
    return await Promise.all([
        renderNavBar(),
        setEvents(),
        dynamicDashboard()
    ])
}

// Start
setTimeout(main, 0)
