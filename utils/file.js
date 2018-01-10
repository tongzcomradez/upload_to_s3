const last = require('lodash/last')
const uniqid = require('uniqid');

/* response String: jpg */
exports.getFileType = originalFilename => last(originalFilename.split('.'))

/* response String: s5s1d4s20x5s2d4s5 */
exports.uniqId = () => uniqid()

/* response String: http://localhost:3000/images/xxx.jpg */
exports.fullUrl = (req, pathFile) => `${req.protocol}://${req.get('host')}${req.originalUrl}${pathFile}`