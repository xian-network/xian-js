import { TransactionBuilder } from "./lib/transaction-builder";
import { Encoder } from "./lib/encoder";
import { Keystore } from "./lib/keystore";
import { MasternodeAPI } from "./lib/masternode-api";
import * as Wallet from "./lib/wallet";
import * as Utils from "./lib/helpers";
import { Buffer } from "buffer";
import { I_NetworkSettings, T_NetworkType, I_TxInfo, I_BroadcastTxResult, I_CheckTx, I_DeliverTx } from "./types";
import { Network } from "./lib/network";

globalThis.Buffer = Buffer;

export {
	TransactionBuilder,
	MasternodeAPI,
	Wallet,
	Keystore,
	Encoder,
	Utils,
	Network,
};

export type {
	I_NetworkSettings,
	T_NetworkType,
	I_TxInfo,
	I_BroadcastTxResult,
	I_CheckTx,
	I_DeliverTx
}

export default {
	TransactionBuilder,
	MasternodeAPI,
	Wallet,
	Keystore,
	Encoder,
	Utils,
	Network
};
