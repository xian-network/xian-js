"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasternodeAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("./helpers");
const encoder_1 = require("./encoder");
class MasternodeAPI {
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
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.post(`${this.host}/abci_query?path="/contract/${contractName}"`);
            return (0, helpers_1.decodeQuery)(data.result.response);
        });
    }
    getVariable(contract, variable) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = `/get/${contract}.${variable}/`;
            const url = `${this.host}/abci_query?path="${path}"`;
            const { data } = yield axios_1.default.post(url);
            const result = data.result.response;
            let decoded = (0, helpers_1.decodeQuery)(result);
            return decoded;
        });
    }
    getContractMethods(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.post(`${this.host}/abci_query?path="/contract_methods/${contractName}"`);
            return JSON.parse((0, helpers_1.decodeQuery)(data.result.response));
        });
    }
    getContractVariables(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.post(`${this.host}/abci_query?path="/contract_vars/${contractName}"`);
            return JSON.parse((0, helpers_1.decodeQuery)(data.result.response));
        });
    }
    pingServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.post(`${this.host}/abci_query?path="/ping/"`);
            return JSON.parse((0, helpers_1.decodeQuery)(data.result.response));
        });
    }
    getCurrencyBalance(vk) {
        return __awaiter(this, void 0, void 0, function* () {
            let balanceRes = yield this.getVariable("currency", `balances:${vk}`);
            if (!balanceRes)
                return (0, encoder_1.Encoder)("bigNumber", 0);
            if (balanceRes)
                return (0, encoder_1.Encoder)("bigNumber", balanceRes);
            return (0, encoder_1.Encoder)("bigNumber", balanceRes.toString());
        });
    }
    contractExists(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this.getContractInfo(contractName);
            if (contract)
                return true;
            return false;
        });
    }
    broadcastTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const txString = (0, helpers_1.stringifyTransaction)(tx);
            const url = `${this.host}/broadcast_tx_commit?tx="${txString}"`;
            const { data } = yield axios_1.default.get(url);
            const { check_tx, deliver_tx, hash } = data.result;
            const result_data = deliver_tx.data ? (0, helpers_1.decodeObj)(deliver_tx.data) : null;
            const check = check_tx.code === 0;
            const deliver = deliver_tx.code === 0;
            return { success: check && deliver, data: result_data, hash };
        });
    }
    getNonce(vk) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/abci_query?path="/get_next_nonce/${vk}"`;
            const url = `${this.host}${path}`;
            const { data } = yield axios_1.default.post(url);
            const value = data.result.response.value;
            if (value === "AA==")
                return 0;
            const decoded = (0, helpers_1.decodeInt)(value);
            return decoded;
        });
    }
    getTransaction(hash) {
        return axios_1.default.get(`${this.host}/tx?hash="0x${hash}"`);
    }
    getNodeInfo() {
        return axios_1.default.get(`${this.host}/status`);
    }
    getLastetBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.get(`${this.host}/block`);
        });
    }
}
exports.MasternodeAPI = MasternodeAPI;
