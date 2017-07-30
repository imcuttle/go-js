/**
 * Created by moyu on 2017/7/30.
 */

module.exports = {
    encode: function encodeSep(str) {
        return str.replace(/\//g, '~&*@')
    },
    decode: function decodeSep(str) {
        return str.replace(/~&*@/g, '/')
    }
}