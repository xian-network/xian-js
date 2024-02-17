import { I_NetworkSettings, I_SendTxResult, I_Transaction } from "../types";
export declare class MasternodeAPI {
    hosts: string[];
    constructor(network_settings: I_NetworkSettings);
    validateProtocol(host: string): string;
    validateHosts(hosts: string[]): string[];
    get host(): string;
    get url(): string;
    getContractInfo(contractName: string): Promise<string | number>;
    getVariable(contract: string, variable: string): Promise<string | number>;
    getContractMethods(contractName: any): Promise<any>;
    getContractVariables(contractName: any): Promise<any>;
    pingServer(): Promise<any>;
    getCurrencyBalance(vk: string): Promise<any>;
    contractExists(contractName: any): Promise<boolean>;
    broadcastTx(tx: I_Transaction): Promise<I_SendTxResult>;
    getNonce(vk: string): Promise<number>;
    getTransaction(hash: string): Promise<import("axios").AxiosResponse<any, any>>;
    getNodeInfo(): Promise<import("axios").AxiosResponse<any, any>>;
    getLastetBlock(): Promise<import("axios").AxiosResponse<any, any>>;
}
//# sourceMappingURL=masternode-api.d.ts.map