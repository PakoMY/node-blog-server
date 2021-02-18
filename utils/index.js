const crypto = require('crypto')

function md5(s) {
    //参数必须为String类型
    return crypto.createHash('md5').update(String(s)).digest('hex')
}

module.exports = {
    md5
}