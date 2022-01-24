

export function getElementByIdUnsafe(id: string) {
    const el = document.getElementById(id)
    if (!el) throw new Error(`"#${id}" not found`)
    return el
}