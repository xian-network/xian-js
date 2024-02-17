import { I_NetworkSettings, I_Payload, I_PayloadSorted, I_SendTxResult, I_TxInfo } from "../types";
import { MasternodeAPI } from "./masternode-api";
export declare class TransactionBuilder {
    uid: string;
    sender: string;
    contract: string;
    method: string;
    kwargs: object;
    stampLimit: number;
    nonce: number;
    signature: string;
    transactionSigned: boolean;
    txSendResult: {
        errors: string[];
    };
    txBlockResult: object;
    txHash: string;
    chain_id: string;
    payload: I_Payload;
    sortedPayload: I_PayloadSorted;
    masternodeApi: MasternodeAPI;
    constructor(networkSettings: I_NetworkSettings, txInfo: I_TxInfo);
    private sign;
    send(sk: string): Promise<I_SendTxResult>;
}
//# sourceMappingURL=transaction-builder.d.ts.map