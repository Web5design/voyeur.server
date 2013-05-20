/**
 * # index
 *
 * @param {Array}
 * @type {[type]}
 *
 */
module.export = (process.env.VOYEUR_COVERAGE) ?
    require('./coverage/voyeur.js') :
    require('./lib/voyeur.js');
