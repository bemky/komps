const strokeIcon = paths => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`

// Diagonal arrows out of the corners — "open this up".
export function expandIcon () {
    return strokeIcon('<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>')
}

// The same arrows pointing back into the corners.
export function collapseIcon () {
    return strokeIcon('<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>')
}

export function handleIcon (options={}) {
    if (options.horizontal) {
        return `
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        	 viewBox="0 0 2 18" xml:space="preserve" width="2" height="18" fill="currentColor" preserveAspectRatio="xMidYMid meet">
        <circle cy="6" cx="1" r="1"/>
        <circle cy="10" cx="1" r="1"/>
        <circle cy="14" cx="1" r="1"/>
        </svg>
        `
    }
    return `
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    	 viewBox="0 0 18 2" xml:space="preserve" width="24" height="2" fill="currentColor" preserveAspectRatio="xMidYMid meet">
    <circle cy="1" cx="6" r="1"/>
    <circle cy="1" cx="10" r="1"/>
    <circle cy="1" cx="14" r="1"/>
    </svg>
    `
}