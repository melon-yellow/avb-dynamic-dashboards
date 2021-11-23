import { timestamp } from './sync.js';
// Saves Log
export async function log(log) {
    // Structure
    const t = timestamp();
    console.log(`(${t}) ${log}`);
}
