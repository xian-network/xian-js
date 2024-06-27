import { I_NetworkSettings } from "../types";
import { EventEmitter } from "./event-emitter";
import { MasternodeAPI } from "./masternode-api";

export class Network {
    classname: string;
    type: string;
    online: boolean;
    version: number; // TODO: remove
    events: any;
    masternode_hosts: string[];
    currencySymbol: string;
    name: string;
    blockExplorer: string;
    api : MasternodeAPI;

  constructor(networkInfoObj: I_NetworkSettings) {
    if (typeof networkInfoObj !== 'object' || Object.keys(networkInfoObj).length === 0)
      throw new Error(`Expected Network Info Object and got Type: ${typeof networkInfoObj}`);
    if (!Array.isArray(networkInfoObj.masternode_hosts) || networkInfoObj.masternode_hosts.length === 0)
      throw new Error(`HOSTS Required (Type: Array)`);

    this.classname = 'Network'
    this.version = 1
    this.events = new EventEmitter();
    this.masternode_hosts = this.validateHosts(networkInfoObj.masternode_hosts);
    this.currencySymbol = "XIAN"
    this.name = networkInfoObj.chain_id
    this.online = false;

    try {
      this.api = new MasternodeAPI(networkInfoObj);
    } catch (e) {
      throw new Error(e);
    }
  }

  vaidateProtocol(host: string) {
    let protocols = ["https://", "http://"];
    if (protocols.map((protocol) => host.includes(protocol)).includes(true)) return host;
    throw new Error("Host String must include http:// or https://");
  }

  validateHosts(hosts: string[]) {
    return hosts.map((host) => this.vaidateProtocol(host.toLowerCase()));
  }

  getNetworkVersion(){
    return 1
  }

  async ping(): Promise<boolean> {
    this.online = await this.api.pingServer();
    this.events.emit("online", this.online);
    return this.online;
  }

  get host() {
    return this.masternode_hosts[Math.floor(Math.random() * this.masternode_hosts.length)];
  }

  get url() {
    return this.host;
  }

  getNetworkInfo() {
    return {
      name: this.name,
      type: this.type,
      hosts: this.masternode_hosts,
      blockservice_hosts: [],
      url: this.url,
      online: this.online,
      version: this.version
    };
  }

  async pingServer() {
      return await this.api.pingServer();
  }

  async getVariable(contractName:string, variableName:string, key:string) {
      let res = await this.api.getVariable(contractName, `${variableName}:${key}`);
      if (res) {
        return {
          value: res
        }
      } else {
        return {error: "key or variable not exists"}
      }
    }

  async getCurrencyBalance(vk) {
    return await this.getVariable("currency", "balances", vk)
  }

  async getContractInfo(contractName) {
      return await this.api.getContractInfo(contractName);
  }

  async contractExists(contractName) {
      return await this.api.getContractInfo(contractName);
  }

  async getLastetBlock() {
      return await this.api.getLastetBlock();
  }

}
