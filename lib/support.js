export function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

export function result(obj, key, ...args) {
    let value = obj[key];
    
    if (isFunction(value)) {
        return value.call(obj, ...args);
    } else {
        return value;
    }
}

export function domReady(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
}


function eachPrototype(obj, fn) {
    fn(obj);
    var proto = Object.getPrototypeOf(obj);
    if ( proto ) {
        eachPrototype(proto, fn);
    }
}

/**
 * Iterates over the (prototype chain)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain]
 * for a specified property in each prototype
 *
 * @param {Object} obj - The object to climb the property chain with
 * @param {string} key - The property name to find on each prototype
 * @returns {Array} - An array consisting of the property for each prototype
 */
export function scanPrototypesFor(obj, key) {
    let values = [];
    eachPrototype(obj, p => {
        values.push(p[key]);
    })
    return values;
}

export function uniq (array, testFn) {
    if (!Array.isArray(array)) return array;
    const copy = []
    if (!testFn) testFn = (x, copy) => !copy.includes(x)
    array.forEach(x => {
        if (testFn(x, copy)) {
            copy.push(x)
        }
    })
    return copy;
}

export function indexOfNode(el) {
    return Array.from(el.parentNode.childNodes).indexOf(el)
}

export function closest (el, selector) {
    if (!el.matches) { return null }
    if (el.matches(selector)) { return el }
    return el.closest(selector)
}

export function groupBy(array, key) {
    const results = {}
    array.forEach(x => {
        let xKey
        if (isFunction(key)) {
            xKey = results[key(x)]
        } else {
            xKey = result(x, key)
        }
        results[xKey] = results[xKey] || []
        results[xKey].push(x)
    })
    return results
}

export function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

export function except (o, ...keys) {
    const result = {}
    Object.keys(o).forEach(function(key) {
      if (!keys.includes(key)) {
        result[key] = o[key];
      }
    });
    return result
}


export { bury } from 'dolla';

export function dig (obj, keys, fallback) {
    if (!Array.isArray(keys)) { keys = [keys] }
    const key = keys[0]
    keys = keys.slice(1)
    if (obj.hasOwnProperty(key)) {
        if (keys.length > 0) {
            return dig(obj[key], keys, fallback)
        } else {
            return obj[key]
        }
    } else {
        return fallback
    }
}