// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

module.exports = {  
  zencash: {
    messagePrefix: '\x20ZENCash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x2089,    
    scriptHash: 0x2096,
    wif: 0x80
  }
}
