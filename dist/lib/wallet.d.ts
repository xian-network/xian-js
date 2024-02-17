/**
 * Create a wallet object for signing and verifying messages
 *
 * @param {Object} [args={}] Args Object
 * @param {string} [args.sk=undefined] A 32 character long hex representation of a signing key (private key) to create wallet from
 * @param {Uint8Array(length: 32)} [args.seed=null] A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be avoided by everyday users
 * @param {boolean} [args.keepPrivate=false] No direct access to the sk. Will still allow the wallet to sign messages
 * @return {Object} Wallet Object with sign and verify methods
 */
export declare let create_wallet: (args?: any) => {
    sign: (msg: any) => string;
    verify: (msg: any, sig: any) => boolean;
    vk: any;
    sk: any;
};
/**
 * @param Uint8Array(length: 32) seed
 *      seed:   A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be
 *              avoided by everyday users
 *
 * @return {Uint8Array(length: 32), Uint8Array(length: 32)} { vk, sk }
 *      sk:     Signing Key (SK) represents 32 byte signing key
 *      vk:     Verify Key (VK) represents a 32 byte verify key
 */
export declare function generate_keys(seed?: any): {
    sk: Uint8Array;
    vk: Uint8Array;
};
/**
 * @param String sk
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *
 * @return String vk
 *      vk:     A 64 character long hex representation of a verify key (public key)
 */
export declare function get_vk(sk: any): any;
/**
 * @param String sk
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *
 * @return {Uint8Array(length: 32), Uint8Array(length: 32)} { vk, sk }
 *      sk:     Signing Key (SK) represents 32 byte signing key
 *      vk:     Verify Key (VK) represents a 32 byte verify key
 */
export declare function format_to_keys(sk: any): {
    sk: Uint8Array;
    vk: Uint8Array;
};
/**
 * @param Object kp
 *      kp:     Object containing the properties sk and vk
 *          sk:     Signing Key (SK) represents 32 byte signing key
 *          vk:     Verify Key (VK) represents a 32 byte verify key
 *
 * @return {string, string} { sk, vk }
 *      sk:     Signing Key (SK) represented as a 64 character hex string
 *      vk:     Verify Key (VK) represented as a 64 character hex string
 */
export declare function keys_to_format(kp: any): {
    vk: any;
    sk: any;
};
/**
 * @param Uint8Array(length: 32) seed
 *      seed:   A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be
 *              avoided by everyday users
 *
 * @return {string, string} { sk, vk }
 *      sk:     Signing Key (SK) represented as a 64 character hex string
 *      vk:     Verify Key (VK) represented as a 64 character hex string
 */
export declare function new_wallet(seed?: any): {
    vk: any;
    sk: any;
};
/**
 * @param seed Bip39 seed phrase (128 characters in hex)
 * @param derivationIndex bip32 derivation key index
 *
 * @return {{derivationIndex: number, vk: string, sk: string, mnemonic: (string|undefined)}} { sk, vk, derivationIndex, mnemonic }
 *      sk:                 Signing Key (SK) represented as a 64 character hex string
 *      vk:                 Verify Key (VK) represented as a 64 character hex string
 *      derivationIndex:    Bip32 derivation index
 *      seed:               Bip39 seed phrase (128 characters in hex)
 *      mnemonic:           Bip39 24 words mnemonic
 */
export declare function new_wallet_bip39(seed?: any, derivationIndex?: number): {
    sk: string;
    vk: string;
    derivationIndex: number;
    seed: any;
    mnemonic: any;
};
/**
 * @param String sk
 * @param Uint8Array msg
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *      msg:    A Uint8Array of bytes representing the message you would like to sign
 *
 * @return String sig
 *      sig:    A 128 character long hex string representing the message's signature
 */
export declare function sign(sk: string, msg: Uint8Array): string;
/**
 * @param String vk
 * @param {(Uint8Array|string)} msg
 * @param String sig
 *      vk:     A 64 character long hex representation of a verify key (public key)
 *      msg:    A Uint8Array (bytes) || (string) representation of a message that has been signed
 *      sig:    A 128 character long hex representation of a nacl signature
 *
 * @return Bool result
 *      result: true if verify checked out, false if not
 */
export declare function verify(vk: any, msg: any, sig: any): boolean;
/**
 * @param string mnemonic
 * @param string[] wordList
 *      mnemonic: Bip39 24 words mnemonic
 *      wordList: An array of string(Optional)
 *
 * @return Boolen res
 *      res: A boolen value
 */
export declare function validateMnemonic(mnemonic: any, wordList: any): boolean;
//# sourceMappingURL=wallet.d.ts.map