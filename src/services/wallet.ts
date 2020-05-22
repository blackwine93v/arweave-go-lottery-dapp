import Arweave from 'arweave/web';
import { JWKInterface } from 'arweave/node/lib/wallet';

const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  timeout: 18000,
});

class Wallet {
  address?: string;
  jwk?: JWKInterface;

  setJwk(jwk: JWKInterface) {
    this.jwk = jwk;
  }

  async getAddress() {
    if (this.address) return this.address;

    if (this.jwk) {
      const addr = await arweave.wallets.jwkToAddress(this.jwk);
      this.address = addr;
      return addr;
    } else {
      throw new Error('Missing key')
    }
  }

  async getBalance() {
    if (this.address) {
      const winston = await arweave.wallets.getBalance(this.address);
      return arweave.ar.winstonToAr(winston);
    } else {
      throw new Error('Missng address');
    }
  }

  async createTXStoreResult(lotteryRound: string, result: string) {
    if (this.jwk) {
      const transaction = await arweave.createTransaction({
        data: result,
      }, this.jwk);
      transaction.addTag('lottery-game-round', lotteryRound);
      await arweave.transactions.sign(transaction, this.jwk);
      const response = await arweave.transactions.post(transaction);

      return response;
    } else {
      throw new Error('Missng key');
    }
  }
}

export const wallet = new Wallet();