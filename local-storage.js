'use strict';

var stub = require('./stub');
var tracking = require('./tracking');
var ls;

// Added the try/catch and typeof check as it seems some IE Edge/IE11 browsers will raise exceptions when accessing it due to user profile security settings
try {
  ls = typeof localStorage === "undefined" ? stub : ('localStorage' in global && global.localStorage ? global.localStorage : stub);
} catch (e) {
  ls = stub;
}

function accessor (key, value) {
  if (arguments.length === 1) {
    return get(key);
  }
  return set(key, value);
}

function get (key) {
  return JSON.parse(ls.getItem(key));
}

function set (key, value) {
  try {
    ls.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function remove (key) {
  return ls.removeItem(key);
}

function clear () {
  return ls.clear();
}

function backend (store) {
  store && (ls = store);

  return ls;
}

accessor.set = set;
accessor.get = get;
accessor.remove = remove;
accessor.clear = clear;
accessor.backend = backend;
accessor.on = tracking.on;
accessor.off = tracking.off;

module.exports = accessor;
