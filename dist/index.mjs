var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/lib/wallet.ts
var wallet_exports = {};
__export(wallet_exports, {
  create_wallet: () => create_wallet,
  format_to_keys: () => format_to_keys,
  generate_keys: () => generate_keys,
  get_vk: () => get_vk,
  keys_to_format: () => keys_to_format,
  new_wallet: () => new_wallet,
  new_wallet_bip39: () => new_wallet_bip39,
  sign: () => sign,
  validateMnemonic: () => validateMnemonic2,
  verify: () => verify
});

// src/lib/helpers.ts
var helpers_exports = {};
__export(helpers_exports, {
  ab2str: () => ab2str,
  buf2hex: () => buf2hex,
  concatUint8Arrays: () => concatUint8Arrays,
  decodeInt: () => decodeInt,
  decodeObj: () => decodeObj,
  decodeQuery: () => decodeQuery,
  decodeStr: () => decodeStr,
  decryptObject: () => decryptObject,
  decryptStrHash: () => decryptStrHash,
  encryptObject: () => encryptObject,
  encryptStrHash: () => encryptStrHash,
  hex2buf: () => hex2buf,
  hex2str: () => hex2str,
  isLamdenKey: () => isLamdenKey,
  isStringHex: () => isStringHex,
  makePayload: () => makePayload,
  makeTransaction: () => makeTransaction,
  randomString: () => randomString,
  sortObjKeys: () => sortObjKeys,
  sortObject: () => sortObject,
  str2ab: () => str2ab,
  str2buf: () => str2buf,
  str2hex: () => str2hex,
  stringifyTransaction: () => stringifyTransaction,
  verifySignature: () => verifySignature
});
import nodeCryptoJs from "node-cryptojs-aes";
var { CryptoJS, JsonFormatter } = nodeCryptoJs;
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
  } catch (e) {
    return false;
  }
}
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
  } catch (e) {
    return false;
  }
}
function buf2hex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
}
function hex2buf(hexString) {
  var bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (var i = 0; i < bytes.length; i++)
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  return bytes;
}
function str2buf(string) {
  var buf = Buffer.from(string);
  return new Uint8Array(buf);
}
function concatUint8Arrays(array1, array2) {
  var arr = new Uint8Array(array1.length + array2.length);
  arr.set(array1);
  arr.set(array2, array1.length);
  return arr;
}
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
function str2hex(str) {
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    hex += "" + str.charCodeAt(i).toString(16);
  }
  return hex;
}
function hex2str(hexx) {
  var hex = hexx.toString();
  var str = "";
  for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
function randomString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
function isStringHex(string = "") {
  let hexRegEx = /([0-9]|[a-f])/gim;
  return typeof string === "string" && (string.match(hexRegEx) || []).length === string.length;
}
function isLamdenKey(string) {
  if (/^[0-9a-fA-F]{64}$/.test(string))
    return true;
  return false;
}
function decodeInt(encodedInt) {
  let decodedBytes = Buffer.from(encodedInt, "base64");
  let value = decodedBytes.readInt32BE(0);
  return value;
}
function decodeQuery(response) {
  let value;
  let type = response.info;
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
function decodeStr(encodedStr) {
  let decodedBytes = Buffer.from(encodedStr, "base64");
  let value = decodedBytes.toString();
  return value;
}
function decodeObj(encodedObj) {
  let decodedBytes = Buffer.from(encodedObj, "base64");
  let value = JSON.parse(decodedBytes.toString());
  return value;
}
function sortObject(object) {
  const orderedPayload = processObj(object);
  return {
    orderedPayload,
    jsonData: JSON.stringify(orderedPayload)
  };
}
function sortObjKeys(unsorted) {
  const sorted = {};
  Object.keys(unsorted).sort().forEach((key) => sorted[key] = unsorted[key]);
  return sorted;
}
function processObj(obj) {
  if (!isObject(obj))
    throw new TypeError("Not a valid Object");
  try {
    obj = JSON.parse(JSON.stringify(obj));
  } catch (e) {
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
var isObject = (value) => {
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
function makeTransaction(signature, sortedPayload) {
  return {
    metadata: {
      signature
    },
    payload: sortedPayload.orderedPayload
  };
}
function verifySignature(payload, wallet, signature) {
  const stringBuffer = Buffer.from(payload.jsonData);
  const stringArray = new Uint8Array(stringBuffer);
  return wallet.verify(this.sender, stringArray, this.signature);
}
var stringifyTransaction = (tx) => Buffer.from(JSON.stringify(tx)).toString("hex");

// src/lib/wallet.ts
import nacl from "tweetnacl";
import * as bip39 from "bip39";
import bip32 from "ed25519-hd-key";
var create_wallet = (args = {}) => {
  let { sk, keepPrivate, seed } = args;
  let vk;
  if (sk) {
    vk = get_vk(sk);
  } else {
    let keyPair = new_wallet(seed);
    vk = keyPair.vk;
    sk = keyPair.sk;
  }
  const wallet = () => {
    return {
      sign: (msg) => sign(sk, msg),
      verify: (msg, sig) => verify(vk, msg, sig),
      vk,
      sk: !keepPrivate ? sk : void 0
    };
  };
  return wallet();
};
function generate_keys(seed = null) {
  var kp = null;
  if (seed == null) {
    kp = nacl.sign.keyPair();
  } else {
    kp = nacl.sign.keyPair.fromSeed(seed);
  }
  return {
    sk: new Uint8Array(kp["secretKey"].slice(0, 32)),
    vk: new Uint8Array(kp["secretKey"].slice(32, 64))
  };
}
function get_vk(sk) {
  var kp = format_to_keys(sk);
  var kpf = keys_to_format(kp);
  return kpf.vk;
}
function format_to_keys(sk) {
  var skf = hex2buf(sk);
  var kp = generate_keys(skf);
  return kp;
}
function keys_to_format(kp) {
  return {
    vk: buf2hex(kp.vk),
    sk: buf2hex(kp.sk)
  };
}
function new_wallet(seed = null) {
  const keys = generate_keys(seed);
  return keys_to_format(keys);
}
function generate_keys_bip39(seed = void 0, derivationIndex = 0) {
  let finalSeed;
  let finalMnemonic;
  if (seed !== void 0) {
    finalSeed = seed;
  } else {
    finalMnemonic = bip39.generateMnemonic(256);
    finalSeed = bip39.mnemonicToSeedSync(finalMnemonic).toString("hex");
  }
  const derivationPath = "m/44'/789'/" + derivationIndex + "'/0'/0'";
  const { key, chainCode } = bip32.derivePath(derivationPath, finalSeed, 2147483648);
  const privateKey = key.toString("hex");
  const publicKey = bip32.getPublicKey(key, false).toString("hex");
  if (publicKey !== get_vk(privateKey)) {
    throw Error("Bip32 public key does not match with Lamden public key!");
  }
  if (finalMnemonic !== void 0) {
  }
  return {
    sk: privateKey,
    vk: publicKey,
    derivationIndex,
    seed: seed !== void 0 ? null : finalSeed,
    mnemonic: seed !== void 0 ? null : finalMnemonic
  };
}
function new_wallet_bip39(seed = void 0, derivationIndex = 0) {
  return generate_keys_bip39(seed, derivationIndex);
}
function sign(sk, msg) {
  var kp = format_to_keys(sk);
  var jsnacl_sk = concatUint8Arrays(kp.sk, kp.vk);
  return buf2hex(nacl.sign.detached(msg, jsnacl_sk));
}
function verify(vk, msg, sig) {
  var vkb = hex2buf(vk);
  var sigb = hex2buf(sig);
  var msgb = msg;
  if (Object.prototype.toString.call(msgb) === "[object String]")
    msgb = str2buf(msg);
  try {
    return nacl.sign.detached.verify(msgb, sigb, vkb);
  } catch (_a) {
    return false;
  }
}
function validateMnemonic2(mnemonic, wordList) {
  return bip39.validateMnemonic(mnemonic, wordList);
}

// src/lib/masternode-api.ts
import axios from "axios";

// src/lib/encoder.ts
import BigNumber from "bignumber.js";
BigNumber.config({ RANGE: [-30, 30], EXPONENTIAL_AT: 1e9 });
BigNumber.set({ DECIMAL_PLACES: 30, ROUNDING_MODE: BigNumber.ROUND_DOWN });
function Encoder(type, value) {
  const throwError = (val) => {
    throw new Error(`Error encoding ${val} to ${type}`);
  };
  const countDecimals = (n) => {
    if (Math.floor(n) === n)
      return 0;
    try {
      return n.toString().split(".")[1].length;
    } catch (e) {
      return 0;
    }
  };
  const isString = (val) => typeof val === "string" || val instanceof String;
  const isArray2 = (val) => val && typeof val === "object" && val.constructor === Array;
  const isObject2 = (val) => val && typeof val === "object" && val.constructor === Object;
  const isDate = (val) => val instanceof Date;
  const isBoolean = (val) => typeof val === "boolean";
  const isNumber = (val) => {
    if (isArray2(val))
      return false;
    return !isNaN(encodeBigNumber(val).toNumber());
  };
  const isInteger = (val) => {
    if (!isNumber(val))
      return false;
    if (countDecimals(val) === 0)
      return true;
    return false;
  };
  const encodeInt = (val) => {
    if (!isNumber(val))
      throwError(val);
    else
      return parseInt(val);
  };
  const isFloat = (val) => {
    if (!isNumber(val))
      return false;
    if (countDecimals(val) === 0)
      return false;
    return true;
  };
  const encodeFloat = (val) => {
    if (!isNumber(val))
      throwError(val);
    if (!BigNumber.isBigNumber(val))
      val = new BigNumber(val);
    return { __fixed__: val.toFixed(30).replace(/^0+(\d)|(\d)0+$/gm, "$1$2") };
  };
  const encodeNumber = (val) => {
    if (!isNumber(val))
      throwError(val);
    if (isFloat(val)) {
      if (!BigNumber.isBigNumber(val))
        val = new BigNumber(val);
      return { __fixed__: val.toFixed(30).replace(/^0+(\d)|(\d)0+$/gm, "$1$2") };
    }
    if (isInteger(val))
      return parseInt(val);
  };
  const encodeBigNumber = (val) => {
    if (!BigNumber.isBigNumber(val))
      val = new BigNumber(val);
    return val;
  };
  const encodeBool = (val) => {
    if (isBoolean(val))
      return val;
    if (val === "true" || val === 1)
      return true;
    if (val === "false" || val === 0)
      return false;
    throwError(val);
  };
  const encodeStr = (val) => {
    if (isString(val))
      return val;
    if (isDate(val))
      return val.toISOString();
    return JSON.stringify(val);
  };
  const encodeDateTime = (val) => {
    val = !isDate(val) ? new Date(val) : val;
    if (!isDate(val))
      throwError(val);
    return {
      __time__: [
        val.getUTCFullYear(),
        val.getUTCMonth(),
        val.getUTCDate(),
        val.getUTCHours(),
        val.getUTCMinutes(),
        val.getUTCSeconds(),
        val.getUTCMilliseconds()
      ]
    };
  };
  const encodeTimeDelta = (val) => {
    const time = isDate(val) ? val.getTime() : new Date(val).getTime();
    const days = time / 1e3 / 60 / 60 / 24;
    const seconds = (time - days * 24 * 60 * 60 * 1e3) / 1e3;
    return { __delta__: [days, seconds] };
  };
  const encodeList = (val) => {
    if (isArray2(val))
      return parseObject(val);
    try {
      val = JSON.parse(val);
    } catch (e) {
      throwError(val);
    }
    if (isArray2(val))
      return parseObject(val);
    throwError(val);
  };
  const encodeDict = (val) => {
    if (isObject2(val))
      return parseObject(val);
    try {
      val = JSON.parse(val);
    } catch (e) {
      throwError(val);
    }
    if (isObject2(val))
      return parseObject(val);
    throwError(val);
  };
  const encodeObject = (val) => {
    try {
      return encodeList(val);
    } catch (e) {
      return encodeDict(val);
    }
  };
  function parseObject(obj) {
    const encode = (k, v) => {
      if (k === "datetime" || k === "datetime.datetime")
        return Encoder("datetime.datetime", v);
      if (k === "timedelta" || k === "datetime.timedelta")
        return Encoder("datetime.timedelta", v);
      if (k !== "__fixed__" && isFloat(v))
        return encodeFloat(v);
      return v;
    };
    const fixDatetime = (k, v) => {
      const isDatetimeObject = (val) => {
        let datetimeTypes = ["datetime.datetime", "datetime", "datetime.timedelta", "timedelta"];
        return Object.keys(val).length === 1 && datetimeTypes.filter((f) => f === Object.keys(val)[0]).length > 0;
      };
      if (v.constructor === Array) {
        v.map((val) => {
          if (Object.keys(val).length === 1 && isDatetimeObject(v))
            return val[Object.keys(val)[0]];
          return val;
        });
      }
      if (v.constructor === Object) {
        if (Object.keys(v).length === 1 && isDatetimeObject(v))
          return v[Object.keys(v)[0]];
      }
      return v;
    };
    let encodeValues = JSON.stringify(obj, encode);
    return JSON.parse(encodeValues, fixDatetime);
  }
  const encoder = {
    str: encodeStr,
    string: encodeStr,
    float: encodeFloat,
    int: encodeInt,
    bool: encodeBool,
    boolean: encodeBool,
    dict: encodeDict,
    list: encodeList,
    Any: () => value,
    "datetime.timedelta": encodeTimeDelta,
    "datetime.datetime": encodeDateTime,
    timedelta: encodeTimeDelta,
    datetime: encodeDateTime,
    number: encodeNumber,
    object: encodeObject,
    bigNumber: encodeBigNumber
  };
  if (Object.keys(encoder).includes(type))
    return encoder[type](value);
  else
    throw new Error(`Error: ${type} is not a valid encoder type.`);
}
Encoder.BigNumber = BigNumber;

// src/lib/masternode-api.ts
var MasternodeAPI = class {
  constructor(network_settings) {
    if (typeof network_settings !== "object" || Object.keys(network_settings).length === 0)
      throw new Error(`Expected Object and got Type: ${typeof network_settings}`);
    if (!Array.isArray(network_settings.masternode_hosts) || network_settings.masternode_hosts.length === 0)
      throw new Error(`HOSTS Required (Type: Array)`);
    this.hosts = this.validateHosts(network_settings.masternode_hosts);
  }
  validateProtocol(host) {
    let protocols = ["https://", "http://"];
    if (protocols.map((protocol) => host.includes(protocol)).includes(true))
      return host;
    throw new Error("Host String must include http:// or https://");
  }
  validateHosts(hosts) {
    return hosts.map((host) => this.validateProtocol(host.toLowerCase()));
  }
  get host() {
    return this.hosts[Math.floor(Math.random() * this.hosts.length)];
  }
  get url() {
    return this.host;
  }
  getContractInfo(contractName) {
    return __async(this, null, function* () {
      const { data } = yield axios.post(`${this.host}/abci_query?path="/contract/${contractName}"`);
      return decodeQuery(data.result.response);
    });
  }
  getVariable(contract, variable) {
    return __async(this, null, function* () {
      let path = `/get/${contract}.${variable}/`;
      const url = `${this.host}/abci_query?path="${path}"`;
      const { data } = yield axios.post(url);
      const result = data.result.response;
      let decoded = decodeQuery(result);
      return decoded;
    });
  }
  getContractMethods(contractName) {
    return __async(this, null, function* () {
      const { data } = yield axios.post(`${this.host}/abci_query?path="/contract_methods/${contractName}"`);
      return JSON.parse(decodeQuery(data.result.response));
    });
  }
  getContractVariables(contractName) {
    return __async(this, null, function* () {
      const { data } = yield axios.post(`${this.host}/abci_query?path="/contract_vars/${contractName}"`);
      return JSON.parse(decodeQuery(data.result.response));
    });
  }
  pingServer() {
    return __async(this, null, function* () {
      const { data } = yield axios.post(`${this.host}/abci_query?path="/ping/"`);
      return JSON.parse(decodeQuery(data.result.response));
    });
  }
  getCurrencyBalance(vk) {
    return __async(this, null, function* () {
      let balanceRes = yield this.getVariable("currency", `balances:${vk}`);
      if (!balanceRes)
        return Encoder("bigNumber", 0);
      if (balanceRes)
        return Encoder("bigNumber", balanceRes);
      return Encoder("bigNumber", balanceRes.toString());
    });
  }
  contractExists(contractName) {
    return __async(this, null, function* () {
      const contract = yield this.getContractInfo(contractName);
      if (contract)
        return true;
      return false;
    });
  }
  broadcastTx(tx) {
    return __async(this, null, function* () {
      const txString = stringifyTransaction(tx);
      const url = `${this.host}/broadcast_tx_commit?tx="${txString}"`;
      const { data } = yield axios.get(url);
      const { check_tx, deliver_tx, hash } = data.result;
      const result_data = deliver_tx.data ? decodeObj(deliver_tx.data) : null;
      const check = check_tx.code === 0;
      const deliver = deliver_tx.code === 0;
      return { success: check && deliver, data: result_data, hash };
    });
  }
  getNonce(vk) {
    return __async(this, null, function* () {
      const path = `/abci_query?path="/get_next_nonce/${vk}"`;
      const url = `${this.host}${path}`;
      const { data } = yield axios.post(url);
      const value = data.result.response.value;
      if (value === "AA==")
        return 0;
      const decoded = decodeInt(value);
      return decoded;
    });
  }
  getTransaction(hash) {
    return axios.get(`${this.host}/tx?hash="0x${hash}"`);
  }
  getNodeInfo() {
    return axios.get(`${this.host}/status`);
  }
  getLastetBlock() {
    return __async(this, null, function* () {
      return axios.get(`${this.host}/block`);
    });
  }
};

// src/lib/transaction-builder.ts
var TransactionBuilder = class {
  constructor(networkSettings, txInfo) {
    this.kwargs = {};
    this.transactionSigned = false;
    this.txSendResult = { errors: [] };
    this.txBlockResult = {};
    if (typeof txInfo !== "object" || Object.keys(txInfo).length === 0)
      throw new Error(`txInfo object not found`);
    if (typeof txInfo.senderVk !== "string" || !/^[0-9a-fA-F]+$/.test(txInfo.senderVk))
      throw new Error(`Sender Public Key Required (Type: Hex String)`);
    if (typeof txInfo.contractName !== "string" || txInfo.contractName.trim() === "")
      throw new Error(`Contract Name Required (Type: String)`);
    if (typeof txInfo.methodName !== "string" || txInfo.methodName.trim() === "")
      throw new Error(`Method Required (Type: String)`);
    if (typeof txInfo.stampLimit !== "number" || !Number.isInteger(txInfo.stampLimit))
      throw new Error(`Stamps Limit Required (Type: Integer)`);
    if (txInfo.nonce) {
      if (!Number.isInteger(txInfo.nonce))
        throw new Error(`arg[6] Nonce is required to be an Integer, type ${typeof txInfo.nonce} was given`);
      this.nonce = txInfo.nonce;
    }
    this.sender = txInfo.senderVk;
    this.masternodeApi = new MasternodeAPI(networkSettings);
    this.contract = txInfo.contractName;
    this.method = txInfo.methodName;
    if (typeof txInfo.kwargs === "object") {
      this.kwargs = txInfo.kwargs;
    }
    this.stampLimit = txInfo.stampLimit;
    this.chain_id = networkSettings.chain_id;
    this.payload = {
      sender: txInfo.senderVk,
      contract: txInfo.contractName,
      function: txInfo.methodName,
      kwargs: txInfo.kwargs,
      stamps_supplied: txInfo.stampLimit,
      chain_id: txInfo.chain_id,
      nonce: txInfo.nonce ? txInfo.nonce : void 0
      // user may set the nonce manually.
    };
  }
  sign(sk, sortedPayload) {
    const stringBuffer = Buffer.from(sortedPayload.jsonData);
    const stringArray = new Uint8Array(stringBuffer);
    return sign(sk, stringArray);
  }
  send(sk) {
    return __async(this, null, function* () {
      try {
        if (!this.payload.nonce) {
          this.payload.nonce = yield this.masternodeApi.getNonce(this.sender);
        }
        this.sortedPayload = makePayload(this.payload);
        const signature = this.sign(sk, this.sortedPayload);
        const tx = makeTransaction(signature, this.sortedPayload);
        let response = yield this.masternodeApi.broadcastTx(tx);
        return response;
      } catch (e) {
        return {
          success: false,
          error: e
        };
      }
    });
  }
};

// src/lib/keystore.ts
var Keystore = class {
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
  constructor(arg = void 0) {
    this.KEYSTORE_VERSION = "1.0";
    this.password = null;
    this.encryptedData = null;
    this.keyList = /* @__PURE__ */ (() => {
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
        keyList.forEach((keyInfo) => {
          let newWallet = create_wallet({ sk: keyInfo.sk, keepPrivate: true });
          newWallet = __spreadValues(__spreadValues({}, newWallet), keyInfo);
          delete newWallet.sk;
          wallets.push(newWallet);
        });
      };
      const createKeystore = (password, hint = void 0) => {
        return JSON.stringify({
          data: encryptObject(password, { version: outerClass.KEYSTORE_VERSION, keyList }),
          w: !hint ? "" : encryptStrHash("n1ahcKc0lb", hint)
        });
      };
      const decryptKeystore = (password, data) => {
        let decrypted = decryptObject(password, data);
        if (decrypted) {
          if (!Array.isArray(decrypted.keyList)) {
            throw new Error("Invalid keyList format. Expected an array.");
          }
          decrypted.keyList.forEach((keyInfo) => {
            if (typeof keyInfo.sk !== "string" || keyInfo.sk.trim() === "") {
              throw new Error("Invalid private key format. Expected a non-empty string.");
            }
          });
          decrypted.keyList.forEach((keyInfo) => addKey(keyInfo));
          outerClass.version = decrypted.version;
        } else {
          throw new Error("Incorrect Keystore Password.");
        }
      };
      return {
        getWallets: () => wallets,
        getWallet: (vk) => wallets.find((wallet) => wallet.vk === vk),
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
    keyList.forEach((key) => this.addKey(key));
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
    if (typeof keyInfo !== "object" || Object.keys(keyInfo).length === 0) {
      throw new Error("keyInfo must be an object with keys.");
    }
    if (typeof keyInfo.sk !== "string" || keyInfo.sk.trim() === "") {
      throw new Error("Private key (sk) must be a non-empty string.");
    }
    if (typeof keyInfo.vk === "string" && keyInfo.vk.trim() !== "") {
      delete keyInfo.vk;
    }
    this.keyList.addKey(keyInfo);
  }
  /**
   * Load the keystore with the data from an existing keystore
   * @param {string} keystoreData The contents of an existing encrypted keystore file
   */
  addKeystoreData(keystoreData) {
    if (typeof keystoreData === "string")
      keystoreData = JSON.parse(keystoreData);
    if (typeof this.validateKeyStore === "function" && this.validateKeyStore(keystoreData)) {
      this.encryptedData = keystoreData;
    }
  }
  /**
   * Returns the password hint in a keystore file
   * @param {String|undefined} keystoreData The contents of an existing encrypted keystore file if one wasn't supplied to the constructor
   */
  getPasswordHint(keystoreData = void 0) {
    if (!this.encryptedData && !keystoreData)
      throw new Error("No keystore data found.");
    if (keystoreData) {
      if (typeof keystoreData === "string")
        keystoreData = JSON.parse(keystoreData);
    } else
      keystoreData = this.encryptedData;
    if (keystoreData.w)
      return decryptStrHash("n1ahcKc0lb", keystoreData.w);
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
    if (typeof keystoreData !== "object" || Object.keys(keystoreData).length === 0) {
      throw new Error("Keystore data must be an object with keys.");
    }
    try {
      let encryptedData = JSON.parse(keystoreData.data);
      if (!encryptedData.ct || !encryptedData.iv || !encryptedData.s) {
        throw new Error("This is not a valid keystore file.");
      }
    } catch (e) {
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
  createKeystore(password, hint = void 0) {
    if (typeof password !== "string" || password.trim() === "") {
      throw new Error("Password must be a non-empty string.");
    }
    if (hint && (typeof hint !== "string" || hint.trim() === "")) {
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
  decryptKeystore(password, keystoreData = void 0) {
    if (keystoreData)
      this.addKeystoreData(keystoreData);
    if (!this.encryptedData)
      throw new Error("No keystoreData to decrypt.");
    try {
      this.keyList.decryptKeystore(password, this.encryptedData.data);
    } catch (e) {
      throw new Error("Incorrect Keystore Password.");
    }
  }
};

// src/index.ts
import { Buffer as Buffer2 } from "buffer";
globalThis.Buffer = Buffer2;
var src_default = {
  TransactionBuilder,
  MasternodeAPI,
  Wallet: wallet_exports,
  Keystore,
  Encoder,
  Utils: helpers_exports
};
export {
  src_default as default
};
//# sourceMappingURL=index.mjs.map