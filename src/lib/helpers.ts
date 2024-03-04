import nodeCryptoJs from "node-cryptojs-aes";
const { CryptoJS, JsonFormatter } = nodeCryptoJs;
import { I_Payload, I_PayloadSorted, I_Transaction, T_QueryResponseDataType } from "../types";

/**
 * Encrypt a Javascript object with a string password
 * The object passed must pass JSON.stringify or the method will fail.
 *
 * @param {string} password  A password to encrypt the object with
 * @param {Object} obj A javascript object (must be JSON compatible)
 * @return {string} Encrypted string
 */
export function encryptObject(password: string, obj: object) {
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

/**
 *  Decrypt an Object using a password string
 *
 *  @param {string} password  A password to encrypt the object with
 *  @param {string} objString A javascript object as JSON string
 *  @return {string} Encrypted string
 */
export function decryptObject(password: string, objString: string) {
	if (typeof password !== "string" || password === "") {
		throw new Error("Password must be a non-empty string");
	}
	if (typeof objString !== "string" || objString === "") {
		throw new Error("Object string must be a non-empty string");
	}

	try {
		const decrypt = CryptoJS.AES.decrypt(objString, password, { format: JsonFormatter });
		return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt));
	} catch (e) {
		return false;
	}
}

/**
 * Encrypt a string using a password string
 *
 * @param {string} password  A password to encrypt the object with
 * @param {string} string A string to be password encrypted
 * @return {string} Encrypted string
 */
export function encryptStrHash(password, string) {
	if (typeof password !== "string" || password === "") {
		throw new Error("Password must be a non-empty string");
	}
	if (typeof string !== "string") {
		throw new Error("String must be a non-empty string");
	}
	const encrypt = CryptoJS.AES.encrypt(string, password).toString();
	return encrypt;
}

/**
 * Decrypt a string using a password string
 *
 * @param {string} password  A password to encrypt the object with
 * @param {string} encryptedString A string to decrypt
 * @return {string} Decrypted string
 */
export function decryptStrHash(password, encryptedString) {
	if (typeof password !== "string" || password === "") {
		throw new Error("Password must be a non-empty string");
	}
	if (typeof encryptedString !== "string" || encryptedString === "") {
		throw new Error("Encrypted string must be a non-empty string");
	}

	try {
		const decrypted = CryptoJS.AES.decrypt(encryptedString, password);
		return CryptoJS.enc.Utf8.stringify(decrypted) === "" ? false : CryptoJS.enc.Utf8.stringify(decrypted);
	} catch (e) {
		return false;
	}
}
 
export function buf2hex(buffer : ArrayBuffer) {
	// return Array.prototype.map.call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
    const uint8Array: Uint8Array = new Uint8Array(buffer);
    const hexArray: string[] = Array.prototype.map.call(uint8Array, (x: number) => ("00" + x.toString(16)).slice(-2));
    const hexString: string = hexArray.join("");
    return hexString
}
export function hex2buf(hexString) {
	var bytes = new Uint8Array(Math.ceil(hexString.length / 2));
	for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
	return bytes;
}
export function str2buf(string) {
	var buf = Buffer.from(string);
	return new Uint8Array(buf);
}
export function concatUint8Arrays(array1, array2) {
	var arr = new Uint8Array(array1.length + array2.length);
	arr.set(array1);
	arr.set(array2, array1.length);
	return arr;
}
export function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint8Array(buf));
}
export function str2ab(str) {
	var buf = new ArrayBuffer(str.length);
	var bufView = new Uint8Array(buf);
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}
export function str2hex(str) {
	var hex = "";
	for (var i = 0; i < str.length; i++) {
		hex += "" + str.charCodeAt(i).toString(16);
	}
	return hex;
}
export function hex2str(hexx) {
	var hex = hexx.toString(); //force conversion
	var str = "";
	for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	return str;
}
export function randomString(length) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
export function isStringHex(string = "") {
	let hexRegEx = /([0-9]|[a-f])/gim;
	return typeof string === "string" && (string.match(hexRegEx) || []).length === string.length;
}

export function isLamdenKey(string) {
	if (/^[0-9a-fA-F]{64}$/.test(string)) return true;
	return false;
}

export function decodeInt(encodedInt: string) {
	let decodedInt = parseInt(Buffer.from(encodedInt, "base64").toString());
	return decodedInt;
}

export function decodeQuery(response: any) {
	let value: number | string | null;
	let type: T_QueryResponseDataType = response.info;
	if (type === "int") {
		value = parseInt(Buffer.from(response.value, "base64").toString());
	} else if (type === "decimal") {
		value = parseFloat(Buffer.from(response.value, "base64").toString());
	} else if (type === "str") {
		value = Buffer.from(response.value, "base64").toString();
	} else {
		value = null;
	}

	return value;
}

export function decodeStr(encodedStr) {
	let decodedBytes = Buffer.from(encodedStr, "base64");
	let value = decodedBytes.toString();
	return value;
}

export function decodeObj(encodedObj: string) {
	let decodedBytes = Buffer.from(encodedObj, "base64");
	let value = JSON.parse(decodedBytes.toString());
	return value;
}

export function sortObject(object: I_Payload): I_PayloadSorted {
	const orderedPayload = processObj(object) as I_Payload;
	return {
		orderedPayload: orderedPayload,
		jsonData: JSON.stringify(orderedPayload)
	};
}

export function sortObjKeys(unsorted) {
	const sorted = {};
	Object.keys(unsorted)
		.sort()
		.forEach((key) => (sorted[key] = unsorted[key]));
	return sorted;
}

function processObj(obj) {
	if (!isObject(obj)) throw new TypeError("Not a valid Object");
	try {
		obj = JSON.parse(JSON.stringify(obj));
	} catch (e) {
		throw new TypeError("Not a valid JSON Object");
	}
	return formatKeys(obj);
}

function formatKeys(unformatted: object) {
	Object.keys(unformatted).forEach((key) => {
		if (isArray(unformatted[key]))
			unformatted[key] = unformatted[key].map((item) => {
				if (isObject(item)) return formatKeys(item);
				return item;
			});
		if (isObject(unformatted[key])) unformatted[key] = formatKeys(unformatted[key]);
	});
	return sortObjKeys(unformatted);
}

function isArray(value) {
	if (getType(value) === "[object Array]") return true;
	return false;
}
const isObject = (value) => {
	if (getType(value) === "[object Object]") return true;
	return false;
};

function getType(value: any) {
	return Object.prototype.toString.call(value);
}

export function makePayload(payload_args: I_Payload) {
	return sortObject(payload_args);
}

export function makeTransaction(signature: string, sortedPayload: I_PayloadSorted): I_Transaction {
	return {
		metadata: {
			signature: signature
		},
		payload: sortedPayload.orderedPayload
	};
}

export function verifySignature(payload: I_PayloadSorted, wallet, signature: string) {
	const stringBuffer = Buffer.from(payload.jsonData);
	const stringArray = new Uint8Array(stringBuffer);
	return wallet.verify(this.sender, stringArray, this.signature);
}

export const stringifyTransaction = (tx: object) => Buffer.from(JSON.stringify(tx)).toString("hex");
