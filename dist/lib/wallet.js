"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMnemonic = exports.verify = exports.sign = exports.new_wallet_bip39 = exports.new_wallet = exports.keys_to_format = exports.format_to_keys = exports.get_vk = exports.generate_keys = exports.create_wallet = void 0;
const helpers = __importStar(require("./helpers"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const bip39 = __importStar(require("bip39"));
const ed25519_hd_key_1 = __importDefault(require("ed25519-hd-key"));
/**
 * Create a wallet object for signing and verifying messages
 *
 * @param {Object} [args={}] Args Object
 * @param {string} [args.sk=undefined] A 32 character long hex representation of a signing key (private key) to create wallet from
 * @param {Uint8Array(length: 32)} [args.seed=null] A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be avoided by everyday users
 * @param {boolean} [args.keepPrivate=false] No direct access to the sk. Will still allow the wallet to sign messages
 * @return {Object} Wallet Object with sign and verify methods
 */
let create_wallet = (args = {}) => {
    let { sk, keepPrivate, seed } = args;
    let vk;
    if (sk) {
        vk = get_vk(sk);
    }
    else {
        let keyPair = new_wallet(seed);
        vk = keyPair.vk;
        sk = keyPair.sk;
    }
    const wallet = () => {
        return {
            sign: (msg) => sign(sk, msg),
            verify: (msg, sig) => verify(vk, msg, sig),
            vk,
            sk: !keepPrivate ? sk : undefined
        };
    };
    return wallet();
};
exports.create_wallet = create_wallet;
/**
 * @param Uint8Array(length: 32) seed
 *      seed:   A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be
 *              avoided by everyday users
 *
 * @return {Uint8Array(length: 32), Uint8Array(length: 32)} { vk, sk }
 *      sk:     Signing Key (SK) represents 32 byte signing key
 *      vk:     Verify Key (VK) represents a 32 byte verify key
 */
function generate_keys(seed = null) {
    var kp = null;
    if (seed == null) {
        kp = tweetnacl_1.default.sign.keyPair();
    }
    else {
        kp = tweetnacl_1.default.sign.keyPair.fromSeed(seed);
    }
    // In the JS implementation of the NaCL library the sk is the first 32 bytes of the secretKey
    // and the vk is the last 32 bytes of the secretKey as well as the publicKey
    // {
    //   'publicKey': <vk>,
    //   'secretKey': <sk><vk>
    // }
    return {
        sk: new Uint8Array(kp["secretKey"].slice(0, 32)),
        vk: new Uint8Array(kp["secretKey"].slice(32, 64))
    };
}
exports.generate_keys = generate_keys;
/**
 * @param String sk
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *
 * @return String vk
 *      vk:     A 64 character long hex representation of a verify key (public key)
 */
function get_vk(sk) {
    var kp = format_to_keys(sk);
    var kpf = keys_to_format(kp);
    return kpf.vk;
}
exports.get_vk = get_vk;
/**
 * @param String sk
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *
 * @return {Uint8Array(length: 32), Uint8Array(length: 32)} { vk, sk }
 *      sk:     Signing Key (SK) represents 32 byte signing key
 *      vk:     Verify Key (VK) represents a 32 byte verify key
 */
function format_to_keys(sk) {
    var skf = helpers.hex2buf(sk);
    var kp = generate_keys(skf);
    return kp;
}
exports.format_to_keys = format_to_keys;
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
function keys_to_format(kp) {
    return {
        vk: helpers.buf2hex(kp.vk),
        sk: helpers.buf2hex(kp.sk)
    };
}
exports.keys_to_format = keys_to_format;
/**
 * @param Uint8Array(length: 32) seed
 *      seed:   A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be
 *              avoided by everyday users
 *
 * @return {string, string} { sk, vk }
 *      sk:     Signing Key (SK) represented as a 64 character hex string
 *      vk:     Verify Key (VK) represented as a 64 character hex string
 */
function new_wallet(seed = null) {
    const keys = generate_keys(seed);
    return keys_to_format(keys);
}
exports.new_wallet = new_wallet;
/**
 *
 * @param seed Bip39 seed phrase (128 characters in hex)
 * @param derivationIndex bip32 derivation key index
 * @returns {{derivationIndex: number, vk: string, sk: string, mnemonic: string}}
 *      derivationIndex:    bip32 derivation key index
 *      vk:                 Verify Key (VK) represented as a 64 character hex string
 *      sk:                 Signing Key (SK) represented as a 64 character hex string
 *      seed:               Bip39 seed phrase (128 characters in hex)
 *      mnemonic:           Bip39 24 words mnemonic
 */
function generate_keys_bip39(seed = undefined, derivationIndex = 0) {
    let finalSeed;
    let finalMnemonic;
    if (seed !== undefined) {
        finalSeed = seed;
    }
    else {
        finalMnemonic = bip39.generateMnemonic(256);
        finalSeed = bip39.mnemonicToSeedSync(finalMnemonic).toString("hex");
    }
    const derivationPath = "m/44'/789'/" + derivationIndex + "'/0'/0'";
    const { key, chainCode } = ed25519_hd_key_1.default.derivePath(derivationPath, finalSeed, 0x80000000);
    const privateKey = key.toString("hex");
    const publicKey = ed25519_hd_key_1.default.getPublicKey(key, false).toString("hex");
    if (publicKey !== get_vk(privateKey)) {
        throw Error("Bip32 public key does not match with Lamden public key!");
    }
    if (finalMnemonic !== undefined) {
    }
    return {
        sk: privateKey,
        vk: publicKey,
        derivationIndex: derivationIndex,
        seed: seed !== undefined ? null : finalSeed,
        mnemonic: seed !== undefined ? null : finalMnemonic
    };
}
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
function new_wallet_bip39(seed = undefined, derivationIndex = 0) {
    return generate_keys_bip39(seed, derivationIndex);
}
exports.new_wallet_bip39 = new_wallet_bip39;
/**
 * @param String sk
 * @param Uint8Array msg
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *      msg:    A Uint8Array of bytes representing the message you would like to sign
 *
 * @return String sig
 *      sig:    A 128 character long hex string representing the message's signature
 */
function sign(sk, msg) {
    var kp = format_to_keys(sk);
    // This is required due to the secretKey required to sign a transaction
    // in the js implementation of NaCL being the combination of the sk and
    // vk for some stupid reason. That being said, we still want the sk and
    // vk objects to exist in 32-byte string format (same as cilantro's
    // python implementation) when presented to the user.
    var jsnacl_sk = helpers.concatUint8Arrays(kp.sk, kp.vk);
    return helpers.buf2hex(tweetnacl_1.default.sign.detached(msg, jsnacl_sk));
}
exports.sign = sign;
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
function verify(vk, msg, sig) {
    var vkb = helpers.hex2buf(vk);
    var sigb = helpers.hex2buf(sig);
    var msgb = msg;
    // Convert string messages to Uint8Array
    if (Object.prototype.toString.call(msgb) === "[object String]")
        msgb = helpers.str2buf(msg);
    try {
        return tweetnacl_1.default.sign.detached.verify(msgb, sigb, vkb);
    }
    catch (_a) {
        return false;
    }
}
exports.verify = verify;
/**
 * @param string mnemonic
 * @param string[] wordList
 *      mnemonic: Bip39 24 words mnemonic
 *      wordList: An array of string(Optional)
 *
 * @return Boolen res
 *      res: A boolen value
 */
function validateMnemonic(mnemonic, wordList) {
    return bip39.validateMnemonic(mnemonic, wordList);
}
exports.validateMnemonic = validateMnemonic;
