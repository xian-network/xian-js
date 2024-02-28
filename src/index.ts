import { TransactionBuilder } from "./lib/transaction-builder";
import { Encoder } from "./lib/encoder";
import { Keystore } from "./lib/keystore";
import { MasternodeAPI } from "./lib/masternode-api";
import * as Wallet from "./lib/wallet";
import * as Utils from "./lib/helpers";
import { Buffer } from "buffer";

globalThis.Buffer = Buffer;

export {
	TransactionBuilder,
	MasternodeAPI,
	Wallet,
	Keystore,
	Encoder,
	Utils
};

export default {
	TransactionBuilder,
	MasternodeAPI,
	Wallet,
	Keystore,
	Encoder,
	Utils
};
