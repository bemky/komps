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