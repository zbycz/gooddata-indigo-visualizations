
export function escapeAngleBrackets(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function unEscapeAngleBrackets(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

/**
 * Flat compare of arrays
 * Checks all elements to strict equality
 * @param {Array} array1 first array to compare
 * @param {Array} array2 second array to compare
 * @return {Boolean} true if the arrays have identical elements, false otherwise
 */
export function arraysEqual(array1, array2) {
    if (array1.length !== array2.length) return false;
    for (var i = 0, len = array1.length; i < len; i++) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

export function shortenText(value, options = {}) {
    var maxLength = options.maxLength;

    if (value && maxLength && value.length > maxLength) {
        return value.substr(0, maxLength) + '...';
    }

    return value;
}

export function safeBind(o, f) {
    var xargs = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;

    return function() {
        if (o && o.isDestroyed || o.isDestroying) return null;

        var args = (xargs) ? xargs.concat(Array.prototype.slice.call(arguments, 0)) : arguments;
        return f.apply(o, args);
    };
}

/**
 * Generates pseudo-random string.
 * @returns {string}
 */
export function randomString(len) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
