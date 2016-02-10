export function getCurrentHash() {
    return window.location.hash;
}

export function getProjectId(hash = '') {
    let matches = hash.match(/#\/(\w+)\//);

    return matches ? matches[1] : null;
}
