"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyTransaction = exports.verifySignature = exports.makeTransaction = exports.makePayload = exports.sortObjKeys = exports.sortObject = exports.decodeObj = exports.decodeStr = exports.decodeQuery = exports.decodeInt = exports.isLamdenKey = exports.isStringHex = exports.randomString = exports.hex2str = exports.str2hex = exports.str2ab = exports.ab2str = exports.concatUint8Arrays = exports.str2buf = exports.hex2buf = exports.buf2hex = exports.decryptStrHash = exports.encryptStrHash = exports.decryptObject = exports.encryptObject = void 0;
const node_cryptojs_aes_1 = __importDefault(require("node-cryptojs-aes"));
const { CryptoJS, JsonFormatter } = node_cryptojs_aes_1.default;
/**
 * Encrypt a Javascript object with a string password
 * The object passed must pass JSON.stringify or the method will fail.
 *
 * @param {string} password  A password to encrypt the object with
 * @param {Object} obj A javascript object (must be JSON compatible)
 * @return {string} Encrypted string
 */
function encryptObject(password, obj) {
    if (typeof password !== "string" || password === "") {
        throw new Error("Password must be a non-empty string");
    }
    if (typeof obj !== "object" || obj === null) {
        throw new Error("Object must be a non-null object");
    }
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), password, {
        format: JsonFormatter
    }).toString();
    return encrypted;
}
exports.encryptObject = encryptObject;
/**
 *  Decrypt an Object using a password string
 *
 *  @param {string} password  A password to encrypt the object with
 *  @param {string} objString A javascript object as JSON string
 *  @return {string} Encrypted string
 */
function decryptObject(password, objString) {
    if (typeof password !== "string" || password === "") {
        throw new Error("Password must be a non-empty string");
    }
    if (typeof objString !== "string" || objString === "") {
        throw new Error("Object string must be a non-empty string");
    }
    try {
        const decrypt = CryptoJS.AES.decrypt(objString, password, { format: JsonFormatter });
        return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt));
    }
    catch (e) {
        return false;
    }
}
exports.decryptObject = decryptObject;
/**
 * Encrypt a string using a password string
 *
 * @param {string} password  A password to encrypt the object with
 * @param {string} string A string to be password encrypted
 * @return {string} Encrypted string
 */
function encryptStrHash(password, string) {
    if (typeof password !== "string" || password === "") {
        throw new Error("Password must be a non-empty string");
    }
    if (typeof string !== "string") {
        throw new Error("String must be a non-empty string");
    }
    const encrypt = CryptoJS.AES.encrypt(string, password).toString();
    return encrypt;
}
exports.encryptStrHash = encryptStrHash;
/**
 * Decrypt a string using a password string
 *
 * @param {string} password  A password to encrypt the object with
 * @param {string} encryptedString A string to decrypt
 * @return {string} Decrypted string
 */
function decryptStrHash(password, encryptedString) {
    if (typeof password !== "string" || password === "") {
        throw new Error("Password must be a non-empty string");
    }
    if (typeof encryptedString !== "string" || encryptedString === "") {
        throw new Error("Encrypted string must be a non-empty string");
    }
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedString, password);
        return CryptoJS.enc.Utf8.stringify(decrypted) === "" ? false : CryptoJS.enc.Utf8.stringify(decrypted);
    }
    catch (e) {
        return false;
    }
}
exports.decryptStrHash = decryptStrHash;
function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
}
exports.buf2hex = buf2hex;
function hex2buf(hexString) {
    var bytes = new Uint8Array(Math.ceil(hexString.length / 2));
    for (var i = 0; i < bytes.length; i++)
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    return bytes;
}
exports.hex2buf = hex2buf;
function str2buf(string) {
    var buf = Buffer.from(string);
    return new Uint8Array(buf);
}
exports.str2buf = str2buf;
function concatUint8Arrays(array1, array2) {
    var arr = new Uint8Array(array1.length + array2.length);
    arr.set(array1);
    arr.set(array2, array1.length);
    return arr;
}
exports.concatUint8Arrays = concatUint8Arrays;
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
exports.ab2str = ab2str;
function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
exports.str2ab = str2ab;
function str2hex(str) {
    var hex = "";
    for (var i = 0; i < str.length; i++) {
        hex += "" + str.charCodeAt(i).toString(16);
    }
    return hex;
}
exports.str2hex = str2hex;
function hex2str(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
exports.hex2str = hex2str;
function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.randomString = randomString;
function isStringHex(string = "") {
    let hexRegEx = /([0-9]|[a-f])/gim;
    return typeof string === "string" && (string.match(hexRegEx) || []).length === string.length;
}
exports.isStringHex = isStringHex;
function isLamdenKey(string) {
    if (/^[0-9a-fA-F]{64}$/.test(string))
        return true;
    return false;
}
exports.isLamdenKey = isLamdenKey;
function decodeInt(encodedInt) {
    let decodedBytes = Buffer.from(encodedInt, "base64");
    let value = decodedBytes.readInt32BE(0);
    return value;
}
exports.decodeInt = decodeInt;
function decodeQuery(response) {
    let value;
    let type = response.info;
    if (type === "int") {
        value = parseInt(Buffer.from(response.value, "base64").toString());
    }
    else if (type === "decimal") {
        value = parseFloat(Buffer.from(response.value, "base64").toString());
    }
    else if (type === "str") {
        value = Buffer.from(response.value, "base64").toString();
    }
    else {
        value = null;
    }
    return value;
}
exports.decodeQuery = decodeQuery;
function decodeStr(encodedStr) {
    let decodedBytes = Buffer.from(encodedStr, "base64");
    let value = decodedBytes.toString();
    return value;
}
exports.decodeStr = decodeStr;
function decodeObj(encodedObj) {
    let decodedBytes = Buffer.from(encodedObj, "base64");
    let value = JSON.parse(decodedBytes.toString());
    return value;
}
exports.decodeObj = decodeObj;
function sortObject(object) {
    const orderedPayload = processObj(object);
    return {
        orderedPayload: orderedPayload,
        jsonData: JSON.stringify(orderedPayload)
    };
}
exports.sortObject = sortObject;
function sortObjKeys(unsorted) {
    const sorted = {};
    Object.keys(unsorted)
        .sort()
        .forEach((key) => (sorted[key] = unsorted[key]));
    return sorted;
}
exports.sortObjKeys = sortObjKeys;
function processObj(obj) {
    if (!isObject(obj))
        throw new TypeError("Not a valid Object");
    try {
        obj = JSON.parse(JSON.stringify(obj));
    }
    catch (e) {
        throw new TypeError("Not a valid JSON Object");
    }
    return formatKeys(obj);
}
function formatKeys(unformatted) {
    Object.keys(unformatted).forEach((key) => {
        if (isArray(unformatted[key]))
            unformatted[key] = unformatted[key].map((item) => {
                if (isObject(item))
                    return formatKeys(item);
                return item;
            });
        if (isObject(unformatted[key]))
            unformatted[key] = formatKeys(unformatted[key]);
    });
    return sortObjKeys(unformatted);
}
function isArray(value) {
    if (getType(value) === "[object Array]")
        return true;
    return false;
}
const isObject = (value) => {
    if (getType(value) === "[object Object]")
        return true;
    return false;
};
function getType(value) {
    return Object.prototype.toString.call(value);
}
function makePayload(payload_args) {
    return sortObject(payload_args);
}
exports.makePayload = makePayload;
function makeTransaction(signature, sortedPayload) {
    return {
        metadata: {
            signature: signature
        },
        payload: sortedPayload.orderedPayload
    };
}
exports.makeTransaction = makeTransaction;
function verifySignature(payload, wallet, signature) {
    const stringBuffer = Buffer.from(payload.jsonData);
    const stringArray = new Uint8Array(stringBuffer);
    return wallet.verify(this.sender, stringArray, this.signature);
}
exports.verifySignature = verifySignature;
const stringifyTransaction = (tx) => Buffer.from(JSON.stringify(tx)).toString("hex");
exports.stringifyTransaction = stringifyTransaction;
