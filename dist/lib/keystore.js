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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keystore = void 0;
const helpers = __importStar(require("./helpers"));
const wallet = __importStar(require("./wallet"));
class Keystore {
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
    constructor(arg = undefined) {
        this.KEYSTORE_VERSION = "1.0";
        this.password = null;
        this.encryptedData = null;
        this.keyList = (() => {
            let keyList = [];
            let outerClass = this;
            let wallets = [];
            const addKey = (key) => {
                keyList.push(key);
                createWallets();
            };
            const deleteKey = (position) => {
                keyList.splice(position, 1);
                createWallets();
            };
            const clearKeys = () => {
                keyList = [];
                createWallets();
            };
            const numOfKeys = () => keyList.length;
            const createWallets = () => {
                wallets = [];
                keyList.forEach(keyInfo => {
                    let newWallet = wallet.create_wallet({ sk: keyInfo.sk, keepPrivate: true });
                    newWallet = Object.assign(Object.assign({}, newWallet), keyInfo);
                    delete newWallet.sk;
                    wallets.push(newWallet);
                });
            };
            const createKeystore = (password, hint = undefined) => {
                return JSON.stringify({
                    data: helpers.encryptObject(password, { version: outerClass.KEYSTORE_VERSION, keyList }),
                    w: !hint ? "" : helpers.encryptStrHash('n1ahcKc0lb', hint),
                });
            };
            const decryptKeystore = (password, data) => {
                let decrypted = helpers.decryptObject(password, data);
                if (decrypted) {
                    if (!Array.isArray(decrypted.keyList)) {
                        throw new Error("Invalid keyList format. Expected an array.");
                    }
                    decrypted.keyList.forEach(keyInfo => {
                        if (typeof keyInfo.sk !== 'string' || keyInfo.sk.trim() === '') {
                            throw new Error("Invalid private key format. Expected a non-empty string.");
                        }
                    });
                    decrypted.keyList.forEach(keyInfo => addKey(keyInfo));
                    outerClass.version = decrypted.version;
                }
                else {
                    throw new Error("Incorrect Keystore Password.");
                }
            };
            return {
                getWallets: () => wallets,
                getWallet: (vk) => wallets.find(wallet => wallet.vk === vk),
                addKey,
                clearKeys,
                numOfKeys,
                deleteKey,
                createKeystore,
                decryptKeystore
            };
        })();
        if (arg) {
            if (arg.key)
                this.addKey(arg.key);
            if (arg.keyList)
                this.addKeys(arg.keyList);
            if (arg.keystoreData)
                this.addKeystoreData(arg.keystoreData);
        }
    }
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
    addKeys(keyList) {
        if (!Array.isArray(keyList)) {
            throw new Error("keyList must be an array.");
        }
        keyList.forEach(key => this.addKey(key));
    }
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
    addKey(keyInfo) {
        if (typeof keyInfo !== 'object' || Object.keys(keyInfo).length === 0) {
            throw new Error("keyInfo must be an object with keys.");
        }
        if (typeof keyInfo.sk !== 'string' || keyInfo.sk.trim() === '') {
            throw new Error("Private key (sk) must be a non-empty string.");
        }
        if (typeof keyInfo.vk === 'string' && keyInfo.vk.trim() !== '') {
            delete keyInfo.vk;
        }
        this.keyList.addKey(keyInfo);
    }
    /**
     * Load the keystore with the data from an existing keystore
     * @param {string} keystoreData The contents of an existing encrypted keystore file
     */
    addKeystoreData(keystoreData) {
        if (typeof keystoreData === 'string')
            keystoreData = JSON.parse(keystoreData);
        if (typeof this.validateKeyStore === 'function' && this.validateKeyStore(keystoreData)) {
            this.encryptedData = keystoreData;
        }
    }
    /**
     * Returns the password hint in a keystore file
     * @param {String|undefined} keystoreData The contents of an existing encrypted keystore file if one wasn't supplied to the constructor
     */
    getPasswordHint(keystoreData = undefined) {
        if (!this.encryptedData && !keystoreData)
            throw new Error("No keystore data found.");
        if (keystoreData) {
            if (typeof keystoreData === 'string')
                keystoreData = JSON.parse(keystoreData);
        }
        else
            keystoreData = this.encryptedData;
        if (keystoreData.w)
            return helpers.decryptStrHash('n1ahcKc0lb', keystoreData.w);
        else
            return "";
    }
    /**
     * Removes a specific key from the keyList
     * @param {Number} keyIndex The index of the key you want to remove
     */
    deleteKey(keyIndex) {
        if (!Number.isInteger(keyIndex)) {
            throw new Error("Key index must be an integer.");
        }
        if (this.keyList.numOfKeys() === 0)
            return;
        if (keyIndex < 0 || keyIndex >= this.keyList.numOfKeys())
            throw new Error("Key index out of range.");
        this.keyList.deleteKey(keyIndex);
    }
    /**
     * Clears all keys from the keystore
     */
    clearKeys() {
        this.keyList.clearKeys();
    }
    /**
     * Clears all keys from the keystore
     * @return {Array.<Object>} An array of wallet objects
     */
    get wallets() {
        return this.keyList.getWallets();
    }
    /**
     * Load the keystore with the data from an existing keystore
     * @param {String} vk A 32 character long Lamden public key
     * @return {Object} A wallet object
     */
    getWallet(vk) {
        return this.keyList.getWallet(vk);
    }
    /**
     * Used to validate that a keystore is the proper Lamden Format (does not decrypt data)
     * @param {String} keystoreData The contents of an existing encrypted keystore file
     * @return {Boolean} valid
     * @throws {Error} This is not a valid keystore file.
     */
    validateKeyStore(keystoreData) {
        if (typeof keystoreData !== 'object' || Object.keys(keystoreData).length === 0) {
            throw new Error("Keystore data must be an object with keys.");
        }
        try {
            let encryptedData = JSON.parse(keystoreData.data);
            if (!encryptedData.ct || !encryptedData.iv || !encryptedData.s) {
                throw new Error("This is not a valid keystore file.");
            }
        }
        catch (e) {
            throw new Error("This is not a valid keystore file.");
        }
        return true;
    }
    /**
     * Create a Keystore text string from the keys contained in the Keystore instance
     * @param {String} password A password to encrypt the data
     * @param {String|undefined} hint An optional password hint. Not stored in clear text (obsured) but not encrypted with the password.
     * @return {String} A JSON stringified object containing the encrypted data
     * @throws {Error} Any errors from the encyption process
     */
    createKeystore(password, hint = undefined) {
        if (typeof password !== 'string' || password.trim() === '') {
            throw new Error("Password must be a non-empty string.");
        }
        if (hint && (typeof hint !== 'string' || hint.trim() === '')) {
            throw new Error("Hint must be a non-empty string.");
        }
        return this.keyList.createKeystore(password, hint);
    }
    /**
     * Decrypt a keystore into a useable array of wallets.  Any decrypted keys will be added to existing keys in the keystore.
     * @param {String} password A password to encrypt the data
     * @param {String|undefined} keystoreData The encrypted contents from a keystore file if not passed into the constructor.
     * @throws {Error} Any errors from the encyption process
     */
    decryptKeystore(password, keystoreData = undefined) {
        if (keystoreData)
            this.addKeystoreData(keystoreData);
        if (!this.encryptedData)
            throw new Error("No keystoreData to decrypt.");
        try {
            this.keyList.decryptKeystore(password, this.encryptedData.data);
        }
        catch (e) {
            throw new Error("Incorrect Keystore Password.");
        }
    }
}
exports.Keystore = Keystore;
