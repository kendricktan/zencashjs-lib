var Buffer = require('safe-buffer').Buffer
var bs58check = require('bs58check')
var bscript = require('./script')
var networks = require('./networks')
var typeforce = require('typeforce')
var types = require('./types')

function fromBase58Check (address) {
  var payload = bs58check.decode(address)
  if (payload.length < 22) throw new TypeError(address + ' is too short')
  if (payload.length > 22) throw new TypeError(address + ' is too long')

  var version = payload.readUInt16BE(0)
  var hash = payload.slice(2)

  return { hash: hash, version: version }
}

function toBase58Check (hash, version) {
  typeforce(types.tuple(types.Hash160bit, types.UInt16), arguments)

  var payload = Buffer.allocUnsafe(22)    
  payload.writeUInt16BE(version, 0)
  hash.copy(payload, 2)

  return bs58check.encode(payload)
}

function fromOutputScript (outputScript, network) {
  network = network || networks.zencash

  if (bscript.pubKeyHash.output.check(outputScript)) return toBase58Check(bscript.compile(outputScript).slice(3, 23), network.pubKeyHash)
  if (bscript.scriptHash.output.check(outputScript)) return toBase58Check(bscript.compile(outputScript).slice(2, 22), network.scriptHash)

  throw new Error(bscript.toASM(outputScript) + ' has no matching Address')
}

function toOutputScript (address, network) {
  network = network || networks.zencash

  var decode = fromBase58Check(address)
  if (decode.version === network.pubKeyHash) return bscript.pubKeyHash.output.encode(decode.hash)
  if (decode.version === network.scriptHash) return bscript.scriptHash.output.encode(decode.hash)

  throw new Error(address + ' has no matching Script')
}

module.exports = {
  fromBase58Check: fromBase58Check,
  fromOutputScript: fromOutputScript,
  toBase58Check: toBase58Check,
  toOutputScript: toOutputScript
}
