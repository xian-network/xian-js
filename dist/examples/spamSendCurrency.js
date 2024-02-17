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
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_builder_1 = require("../lib/transaction-builder");
const wallet_1 = require("../lib/wallet");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = (0, wallet_1.create_wallet)({ sk: "cd6cc45ffe7cebf09c6c6025575d50bb42c6c70c07e1dbc5150aaadc98705c2b" });
        const sk = wallet.sk;
        const vk = wallet.vk;
        console.log({ sk, vk });
        let network_info = {
            chain_id: "xian-testnet-2",
            type: "testnet",
            masternode_hosts: ["http://135.181.96.77:26657"]
        };
        let tx_info = {
            senderVk: wallet.vk,
            chain_id: network_info.chain_id,
            contractName: "currency",
            methodName: "approve",
            kwargs: {
                to: "burn",
                amount: 1
            },
            stampLimit: 50000 // Max stamps to be used. Could use less, won't use more.
        };
        // const send_res = await transaction.send(sk);
        // console.log({ send_res });
        function recurseSend(i = 10000, finishTx = 10100) {
            tx_info.nonce = i + 1;
            const transaction = new transaction_builder_1.TransactionBuilder(network_info, tx_info);
            const send_res = transaction.send(sk);
            setTimeout(() => {
                if (i < finishTx) {
                    recurseSend(i + 1, finishTx);
                }
            }, 10);
        }
        recurseSend();
    });
}
main();
