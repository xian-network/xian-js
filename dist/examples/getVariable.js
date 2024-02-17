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
const masternode_api_1 = require("../lib/masternode-api");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let network_info = {
            chain_id: "xian-testnet-1",
            type: "testnet",
            masternode_hosts: ["http://135.181.96.77:26657"]
        };
        const masternode_api = new masternode_api_1.MasternodeAPI(network_info);
        const balance = yield masternode_api.getVariable("currency", "balances:ee06a34cf08bf72ce592d26d36b90c79daba2829ba9634992d034318160d49f9");
        console.log({ balance });
    });
}
main();
