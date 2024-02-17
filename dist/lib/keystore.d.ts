export declare class Keystore {
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
//# sourceMappingURL=keystore.d.ts.map