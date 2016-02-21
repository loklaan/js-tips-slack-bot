<<<<<<< HEAD
var Redis = require( 'ioredis' );
var redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;
var REDIS_KEY = 'KEY_JSTIP-PATH';

var lastJsTip = {};

=======
/*
 * The latest used JsTip can be stored in a redis store, or in-memory.
 */

var REDIS_KEY = 'KEY_JSTIP-PATH';
var Redis = require( 'ioredis' );
var redis = process.env.REDIS_URL ?
  new Redis(process.env.REDIS_URL) :
  null;

var lastJsTipStore = {};

/**
 * Gets the last tip used. Uses a redis store, but can fallback to js in-memory.
 * @return {Object} Github 'file' object.
 */
>>>>>>> 868b930... wip
function getLastTip() {
  return new Promise(resolve => {

    if (redis == null) {
<<<<<<< HEAD
      resolve(lastJsTip);
    } else {
      resolve(redis.get(REDIS_KEY)
        .then(json => {
          return JSON.parse(json);
        })
        .catch(err => {
          if (err.name === 'SyntaxError') {
            return lastJsTip;
          }
        });
      );
=======
      resolve(lastJsTipStore);
    } else {
      var lastJsTipPromise = redis.get(REDIS_KEY)
        .then(json => {
          return JSON.parse(json) || {};
        })
        .catch(err => {
          if (err.name === 'SyntaxError') {
            return lastJsTipStore;
          }
        });
      resolve(lastJsTipPromise);
>>>>>>> 868b930... wip
    }

  });
}

<<<<<<< HEAD
function setLastTip(tipObj) {
  if (!redis) {
    lastJsTip = tipObj;
=======
/**
 * Set the latest used js tip.
 * @return {Object} Github 'file' object.
 */
function setLastTip(tipObj) {
  if (!redis) {
    lastJsTipStore = tipObj;
>>>>>>> 868b930... wip
  } else {
    redis.set(REDIS_KEY, JSON.stringify(tipObj));
  }
}

module.exports = {
  getLastTip,
  setLastTip
};
