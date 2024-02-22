import * as axios from 'axios';
import * as bignumber_js from 'bignumber.js';

/**
 * Used when instantiating a TransactionBuilder class.
 */
interface I_NetworkSettings {
    chain_id: string;
    type: T_NetworkType;
    masternode_hosts: string[];
}
type T_NetworkType = "mainnet" | "testnet";
/**
 * Used when instantiating a TransactionBuilder class.
 */
interface I_TxInfo {
    senderVk: string;
    chain_id: string;
    contractName: string;
    methodName: string;
    kwargs: {
        [key: string]: any;
    };
    stampLimit: number;
    nonce?: number;
}
interface I_SendTxResult {
    success: boolean;
    data?: any;
    hash?: string;
    error?: string;
}
interface I_Payload {
    sender: string;
    contract: string;
    function: string;
    kwargs: {
        [key: string]: any;
    };
    stamps_supplied: number;
    chain_id: string;
    nonce: number;
}
interface I_PayloadSorted {
    orderedPayload: I_Payload;
    jsonData: string;
}
interface I_Transaction {
    metadata: {
        signature: string;
    };
    payload: I_Payload;
}

declare class MasternodeAPI {
    hosts: string[];
    constructor(network_settings: I_NetworkSettings);
    validateProtocol(host: string): string;
    validateHosts(hosts: string[]): string[];
    get host(): string;
    get url(): string;
    getContractInfo(contractName: string): Promise<string | number>;
    getVariable(contract: string, variable: string): Promise<string | number>;
    getContractMethods(contractName: any): Promise<any>;
    getContractVariables(contractName: any): Promise<any>;
    pingServer(): Promise<any>;
    getCurrencyBalance(vk: string): Promise<any>;
    contractExists(contractName: any): Promise<boolean>;
    broadcastTx(tx: I_Transaction): Promise<I_SendTxResult>;
    getNonce(vk: string): Promise<number>;
    getTransaction(hash: string): Promise<axios.AxiosResponse<any, any>>;
    getNodeInfo(): Promise<axios.AxiosResponse<any, any>>;
    getLastetBlock(): Promise<axios.AxiosResponse<any, any>>;
}

declare class TransactionBuilder {
    uid: string;
    sender: string;
    contract: string;
    method: string;
    kwargs: object;
    stampLimit: number;
    nonce: number;
    signature: string;
    transactionSigned: boolean;
    txSendResult: {
        errors: string[];
    };
    txBlockResult: object;
    txHash: string;
    chain_id: string;
    payload: I_Payload;
    sortedPayload: I_PayloadSorted;
    masternodeApi: MasternodeAPI;
    constructor(networkSettings: I_NetworkSettings, txInfo: I_TxInfo);
    private sign;
    send(sk: string): Promise<I_SendTxResult>;
}

declare function Encoder(type: string, value: any): any;
declare namespace Encoder {
    var BigNumber: typeof bignumber_js.BigNumber;
}

declare class Keystore {
    KEYSTORE_VERSION: string;
    password: string;
    encryptedData: any;
    keyList: any;
    version: any;
    /**
     * Lamden Keystores
     *
     * This Class will create a lamden keystore instance
     *
     * @param {Object|undefined} arg constructor argument
     * @param {String|undefined} arg.key Create an instance and load it with one private key
     * @param {String|undefined} arg.keyList Create an instance and load it with an array of private keys
     * @param {String|undefined} arg.keystoreData Create an instance from an existing keystore file data
     * @return {Keystore}
     */
    constructor(arg?: any);
    /**
     * Add a list of keys to add to the keystore
     * @typedef {Object} keyinfo
     * @property {string} sk - The private key.
     * @property {string} nickname - The key nickname.
     * @property {string} name - The key name.
     * @property {string} network - Network name.
     * @property {string} symbol - The token symbol.
     * @param {Array.<keyinfo>} keyList An array of keyinfo Object
     */
    addKeys(keyList: any): void;
    /**
     * Add a key to the keystore
     * @typedef {Object} keyinfo
     * @property {string} sk - The private key.
     * @property {string} nickname - The key nickname.
     * @property {string} name - The key name.
     * @property {string} network - Network name.
     * @property {string} symbol - The token symbol.
     * @param {keyinfo} keyInfo A keyinfo Object
     */
    addKey(keyInfo: any): void;
    /**
     * Load the keystore with the data from an existing keystore
     * @param {string} keystoreData The contents of an existing encrypted keystore file
     */
    addKeystoreData(keystoreData: any): void;
    /**
     * Returns the password hint in a keystore file
     * @param {String|undefined} keystoreData The contents of an existing encrypted keystore file if one wasn't supplied to the constructor
     */
    getPasswordHint(keystoreData?: any): any;
    /**
     * Removes a specific key from the keyList
     * @param {Number} keyIndex The index of the key you want to remove
     */
    deleteKey(keyIndex: any): void;
    /**
     * Clears all keys from the keystore
     */
    clearKeys(): void;
    /**
     * Clears all keys from the keystore
     * @return {Array.<Object>} An array of wallet objects
     */
    get wallets(): any;
    /**
     * Load the keystore with the data from an existing keystore
     * @param {String} vk A 32 character long Lamden public key
     * @return {Object} A wallet object
     */
    getWallet(vk: any): any;
    /**
     * Used to validate that a keystore is the proper Lamden Format (does not decrypt data)
     * @param {String} keystoreData The contents of an existing encrypted keystore file
     * @return {Boolean} valid
     * @throws {Error} This is not a valid keystore file.
     */
    validateKeyStore(keystoreData: any): boolean;
    /**
     * Create a Keystore text string from the keys contained in the Keystore instance
     * @param {String} password A password to encrypt the data
     * @param {String|undefined} hint An optional password hint. Not stored in clear text (obsured) but not encrypted with the password.
     * @return {String} A JSON stringified object containing the encrypted data
     * @throws {Error} Any errors from the encyption process
     */
    createKeystore(password: any, hint?: any): any;
    /**
     * Decrypt a keystore into a useable array of wallets.  Any decrypted keys will be added to existing keys in the keystore.
     * @param {String} password A password to encrypt the data
     * @param {String|undefined} keystoreData The encrypted contents from a keystore file if not passed into the constructor.
     * @throws {Error} Any errors from the encyption process
     */
    decryptKeystore(password: any, keystoreData?: any): void;
}

/**
 * Create a wallet object for signing and verifying messages
 *
 * @param {Object} [args={}] Args Object
 * @param {string} [args.sk=undefined] A 32 character long hex representation of a signing key (private key) to create wallet from
 * @param {Uint8Array(length: 32)} [args.seed=null] A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be avoided by everyday users
 * @param {boolean} [args.keepPrivate=false] No direct access to the sk. Will still allow the wallet to sign messages
 * @return {Object} Wallet Object with sign and verify methods
 */
declare let create_wallet: (args?: any) => {
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
declare function generate_keys(seed?: any): {
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
declare function get_vk(sk: any): any;
/**
 * @param String sk
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *
 * @return {Uint8Array(length: 32), Uint8Array(length: 32)} { vk, sk }
 *      sk:     Signing Key (SK) represents 32 byte signing key
 *      vk:     Verify Key (VK) represents a 32 byte verify key
 */
declare function format_to_keys(sk: any): {
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
declare function keys_to_format(kp: any): {
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
declare function new_wallet(seed?: any): {
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
declare function new_wallet_bip39(seed?: any, derivationIndex?: number): {
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
declare function sign(sk: string, msg: Uint8Array): string;
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
declare function verify(vk: any, msg: any, sig: any): boolean;
/**
 * @param string mnemonic
 * @param string[] wordList
 *      mnemonic: Bip39 24 words mnemonic
 *      wordList: An array of string(Optional)
 *
 * @return Boolen res
 *      res: A boolen value
 */
declare function validateMnemonic(mnemonic: any, wordList: any): boolean;

declare const Wallet_create_wallet: typeof create_wallet;
declare const Wallet_format_to_keys: typeof format_to_keys;
declare const Wallet_generate_keys: typeof generate_keys;
declare const Wallet_get_vk: typeof get_vk;
declare const Wallet_keys_to_format: typeof keys_to_format;
declare const Wallet_new_wallet: typeof new_wallet;
declare const Wallet_new_wallet_bip39: typeof new_wallet_bip39;
declare const Wallet_sign: typeof sign;
declare const Wallet_validateMnemonic: typeof validateMnemonic;
declare const Wallet_verify: typeof verify;
declare namespace Wallet {
  export { Wallet_create_wallet as create_wallet, Wallet_format_to_keys as format_to_keys, Wallet_generate_keys as generate_keys, Wallet_get_vk as get_vk, Wallet_keys_to_format as keys_to_format, Wallet_new_wallet as new_wallet, Wallet_new_wallet_bip39 as new_wallet_bip39, Wallet_sign as sign, Wallet_validateMnemonic as validateMnemonic, Wallet_verify as verify };
}

/**
 * Encrypt a Javascript object with a string password
 * The object passed must pass JSON.stringify or the method will fail.
 *
 * @param {string} password  A password to encrypt the object with
 * @param {Object} obj A javascript object (must be JSON compatible)
 * @return {string} Encrypted string
 */
declare function encryptObject(password: string, obj: object): any;
/**
 *  Decrypt an Object using a password string
 *
 *  @param {string} password  A password to encrypt the object with
 *  @param {string} objString A javascript object as JSON string
 *  @return {string} Encrypted string
 */
declare function decryptObject(password: string, objString: string): any;
/**
 * Encrypt a string using a password string
 *
 * @param {string} password  A password to encrypt the object with
 * @param {string} string A string to be password encrypted
 * @return {string} Encrypted string
 */
declare function encryptStrHash(password: any, string: any): any;
/**
 * Decrypt a string using a password string
 *
 * @param {string} password  A password to encrypt the object with
 * @param {string} encryptedString A string to decrypt
 * @return {string} Decrypted string
 */
declare function decryptStrHash(password: any, encryptedString: any): any;
declare function buf2hex(buffer: any): any;
declare function hex2buf(hexString: any): Uint8Array;
declare function str2buf(string: any): Uint8Array;
declare function concatUint8Arrays(array1: any, array2: any): Uint8Array;
declare function ab2str(buf: any): any;
declare function str2ab(str: any): ArrayBuffer;
declare function str2hex(str: any): string;
declare function hex2str(hexx: any): string;
declare function randomString(length: any): string;
declare function isStringHex(string?: string): boolean;
declare function isLamdenKey(string: any): boolean;
declare function decodeInt(encodedInt: any): number;
declare function decodeQuery(response: any): string | number;
declare function decodeStr(encodedStr: any): string;
declare function decodeObj(encodedObj: string): any;
declare function sortObject(object: I_Payload): I_PayloadSorted;
declare function sortObjKeys(unsorted: any): {};
declare function makePayload(payload_args: I_Payload): I_PayloadSorted;
declare function makeTransaction(signature: string, sortedPayload: I_PayloadSorted): I_Transaction;
declare function verifySignature(payload: I_PayloadSorted, wallet: any, signature: string): any;
declare const stringifyTransaction: (tx: object) => string;

declare const Utils_ab2str: typeof ab2str;
declare const Utils_buf2hex: typeof buf2hex;
declare const Utils_concatUint8Arrays: typeof concatUint8Arrays;
declare const Utils_decodeInt: typeof decodeInt;
declare const Utils_decodeObj: typeof decodeObj;
declare const Utils_decodeQuery: typeof decodeQuery;
declare const Utils_decodeStr: typeof decodeStr;
declare const Utils_decryptObject: typeof decryptObject;
declare const Utils_decryptStrHash: typeof decryptStrHash;
declare const Utils_encryptObject: typeof encryptObject;
declare const Utils_encryptStrHash: typeof encryptStrHash;
declare const Utils_hex2buf: typeof hex2buf;
declare const Utils_hex2str: typeof hex2str;
declare const Utils_isLamdenKey: typeof isLamdenKey;
declare const Utils_isStringHex: typeof isStringHex;
declare const Utils_makePayload: typeof makePayload;
declare const Utils_makeTransaction: typeof makeTransaction;
declare const Utils_randomString: typeof randomString;
declare const Utils_sortObjKeys: typeof sortObjKeys;
declare const Utils_sortObject: typeof sortObject;
declare const Utils_str2ab: typeof str2ab;
declare const Utils_str2buf: typeof str2buf;
declare const Utils_str2hex: typeof str2hex;
declare const Utils_stringifyTransaction: typeof stringifyTransaction;
declare const Utils_verifySignature: typeof verifySignature;
declare namespace Utils {
  export { Utils_ab2str as ab2str, Utils_buf2hex as buf2hex, Utils_concatUint8Arrays as concatUint8Arrays, Utils_decodeInt as decodeInt, Utils_decodeObj as decodeObj, Utils_decodeQuery as decodeQuery, Utils_decodeStr as decodeStr, Utils_decryptObject as decryptObject, Utils_decryptStrHash as decryptStrHash, Utils_encryptObject as encryptObject, Utils_encryptStrHash as encryptStrHash, Utils_hex2buf as hex2buf, Utils_hex2str as hex2str, Utils_isLamdenKey as isLamdenKey, Utils_isStringHex as isStringHex, Utils_makePayload as makePayload, Utils_makeTransaction as makeTransaction, Utils_randomString as randomString, Utils_sortObjKeys as sortObjKeys, Utils_sortObject as sortObject, Utils_str2ab as str2ab, Utils_str2buf as str2buf, Utils_str2hex as str2hex, Utils_stringifyTransaction as stringifyTransaction, Utils_verifySignature as verifySignature };
}

declare const _default: {
    TransactionBuilder: typeof TransactionBuilder;
    MasternodeAPI: typeof MasternodeAPI;
    Wallet: typeof Wallet;
    Keystore: typeof Keystore;
    Encoder: typeof Encoder;
    Utils: typeof Utils;
};

export { _default as default };
