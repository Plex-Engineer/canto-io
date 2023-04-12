import { Connector, useEthers } from '@usedapp/core'
import { providers } from 'ethers'
import { ConnectorEvent, ConnectorUpdateData } from '@usedapp/core'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk/dist/src/sdk';

export class SafeConnector implements Connector {
  public provider?: providers.Web3Provider
  public Safe: any
  public Sdk: any
  public readonly name = 'Safe'

  readonly update = new ConnectorEvent<ConnectorUpdateData>()

  private async init() {
    if (this.provider) return
    const sdk = new SafeAppsSDK();
    const safe = await sdk.safe.getInfo();
    const provider = new providers.Web3Provider(new SafeAppProvider(safe, sdk));
    this.provider=provider
    this.Safe = safe
    this.Sdk = sdk
    return provider
  }

  async connectEagerly(): Promise<void> {
    try {
      await this.init()
      const accounts: string[] = [this.Safe.safeAddress]
      const chainId: string = this.Safe.chainId.toString()
      this.update.emit({ chainId: parseInt(chainId), accounts })
    } catch (e) {
      console.debug(e)
    }
  }

  async activate(): Promise<void> {
    try {
      await this.init()
      const accounts: string[] = [this.Safe.safeAddress]
      const chainId: string = this.Safe.chainId.toString()
      this.update.emit({ chainId: parseInt(chainId), accounts })
    } catch (e: any) {
      console.log(e)
      throw new Error('Could not activate connector: ' + (e.message ?? ''))
    }
  }

  async deactivate(): Promise<void> {
    this.provider = undefined
  }
}