// OP_DUP OP_HASH160 {pubKeyHash} OP_EQUALVERIFY OP_CHECKSIG

var base58 = require('bs58')
var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function check (script) {
  var buffer = bscript.compile(script)

  // TODO FIX THIS
  return buffer[0] === OPS.OP_DUP &&
    buffer[1] === OPS.OP_HASH160 &&
    buffer[2] === 0x14 &&
    buffer[23] === OPS.OP_EQUALVERIFY &&
    buffer[24] === OPS.OP_CHECKSIG
}
check.toJSON = function () { return 'pubKeyHash output' }

function encode (pubKeyHash) {
  typeforce(types.Hash160bit, pubKeyHash)

  const buf = new Buffer(4);
  buf.writeUInt32LE(139430)

  return bscript.compile([
    OPS.OP_DUP,
    OPS.OP_HASH160,
    pubKeyHash,
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG,    
    new Buffer('0000000305525f92bd4b01de07c2ec7a378e2047b56207743ab64590c4a096cd', 'hex').reverse(),
    // 139300 looks like this: 0x03 0x022024        
    //new Buffer('0' + (3).toString(16), 'hex'), LITTLE INDIAN
    // BUFFER STUFF    
    new Buffer([0x14, 0x1f, 0x02]),
    // new Buffer([0x14, 0x1f, 0x02]),
    //new Buffer('0' + (139430).toString(16), 'hex'),
    OPS.OP_NOP5
  ])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(3, 23)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}
