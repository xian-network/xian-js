import { I_Payload, I_PayloadSorted, I_Transaction } from "../types";
/**
 * Encrypt a Javascript object with a string password
 * The object passed must pass JSON.stringify or the method will fail.
 *
 * @param {string} password  A password to encrypt the object with
 * @param {Object} obj A javascript object (must be JSON compatible)
 * @return {string} Encrypted string
 */
export declare function encryptObject(password: string, obj: object): any;
/**
 *  Decrypt an Object using a password string
 *
 *  @param {string} password  A password to encrypt the object with
 *  @param {string} objString A javascript object as JSON string
 *  @return {string} Encrypted string
 */
export declare function decryptObject(password: string, objString: string): any;
/**
 * Encrypt a string using a password string
 *
 * @param {string} password  A password to encrypt the object with
 * @param {string} string A string to be password encrypted
 * @return {string} Encrypted string
 */
export declare function encryptStrHash(password: any, string: any): any;
/**
 * Decrypt a string using a password string
 *
 * @param {string} password  A password to encrypt the object with
 * @param {string} encryptedString A string to decrypt
 * @return {string} Decrypted string
 */
export declare function decryptStrHash(password: any, encryptedString: any): any;
export declare function buf2hex(buffer: any): any;
export declare function hex2buf(hexString: any): Uint8Array;
export declare function str2buf(string: any): Uint8Array;
export declare function concatUint8Arrays(array1: any, array2: any): Uint8Array;
export declare function ab2str(buf: any): any;
export declare function str2ab(str: any): ArrayBuffer;
export declare function str2hex(str: any): string;
export declare function hex2str(hexx: any): string;
export declare function randomString(length: any): string;
export declare function isStringHex(string?: string): boolean;
export declare function isLamdenKey(string: any): boolean;
export declare function decodeInt(encodedInt: any): number;
export declare function decodeQuery(response: any): string | number;
export declare function decodeStr(encodedStr: any): string;
export declare function decodeObj(encodedObj: string): any;
export declare function sortObject(object: I_Payload): I_PayloadSorted;
export declare function sortObjKeys(unsorted: any): {};
export declare function makePayload(payload_args: I_Payload): I_PayloadSorted;
export declare function makeTransaction(signature: string, sortedPayload: I_PayloadSorted): I_Transaction;
export declare function verifySignature(payload: I_PayloadSorted, wallet: any, signature: string): any;
export declare const stringifyTransaction: (tx: object) => string;
//# sourceMappingURL=helpers.d.ts.map