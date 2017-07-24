// OP_DUP OP_HASH160 {pubKeyHash} OP_EQUALVERIFY OP_CHECKSIG

var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 25 &&
    buffer[0] === OPS.OP_DUP &&
    buffer[1] === OPS.OP_HASH160 &&
    buffer[2] === 0x14 &&
    buffer[23] === OPS.OP_EQUALVERIFY &&
    buffer[24] === OPS.OP_CHECKSIG
}
check.toJSON = function () { return 'pubKeyHashReplay output' }


// ZENCash pubhashreply https://github.com/ZencashOfficial/zen/blob/6f3cc47c4f4643e360267534e85a703e7859e3b1/src/script/standard.cpp#L377
// OP_NOP is OP_CHECKHEIGHTATNODE https://github.com/ZencashOfficial/zen/blob/6f3cc47c4f4643e360267534e85a703e7859e3b1/src/script/script.h#L165

function encode (pubKeyHash) {
  typeforce(types.Hash160bit, pubKeyHash)

  var buf = new Buffer(4);    
  buf.writeUInt32LE(139300)

  if (buf[3] === 0x00){
    var temp_buf = new Buffer(3);
    temp_buf.fill(buf, 0, 3)
    buf = temp_buf
  }  

  return bscript.compile([
    OPS.OP_DUP,
    OPS.OP_HASH160,
    pubKeyHash,
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG,
    new Buffer('000000019a3c363e4cabf1d02c12cfbfdc6d61f33174df2f4066d01dc392498e', 'hex').reverse(),
    // 139300 looks like this: 0x03 0x022024        
    //new Buffer('0' + (3).toString(16), 'hex'), LITTLE INDIAN
    // BUFFER STUFF    
    buf,
    // new Buffer([0x14, 0x1f, 0x02]),
    //new Buffer('0' + (139430).toString(16), 'hex'),
    OPS.OP_NOP5 // OPS.OP_NOP5 == OPS.
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
