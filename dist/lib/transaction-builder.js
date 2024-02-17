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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBuilder = void 0;
const wallet = __importStar(require("./wallet"));
const helpers_1 = require("./helpers");
const masternode_api_1 = require("./masternode-api");
class TransactionBuilder {
    constructor(networkSettings, txInfo) {
        /**
         * Validate Data
         */
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
        /**
         * Define Variables
         */
        this.sender = txInfo.senderVk;
        this.masternodeApi = new masternode_api_1.MasternodeAPI(networkSettings);
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
            nonce: txInfo.nonce ? txInfo.nonce : undefined // user may set the nonce manually.
        };
    }
    sign(sk, sortedPayload) {
        const stringBuffer = Buffer.from(sortedPayload.jsonData);
        const stringArray = new Uint8Array(stringBuffer);
        return wallet.sign(sk, stringArray);
    }
    send(sk) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If the user didn't supply a nonce, get one from a node.
                if (!this.payload.nonce) {
                    this.payload.nonce = yield this.masternodeApi.getNonce(this.sender);
                }
                this.sortedPayload = (0, helpers_1.makePayload)(this.payload);
                // Sign the transaction
                const signature = this.sign(sk, this.sortedPayload);
                //Serialize transaction
                const tx = (0, helpers_1.makeTransaction)(signature, this.sortedPayload);
                //Send transaction to the masternode
                let response = yield this.masternodeApi.broadcastTx(tx);
                return response;
            }
            catch (e) {
                return {
                    success: false,
                    error: e
                };
            }
        });
    }
}
exports.TransactionBuilder = TransactionBuilder;
