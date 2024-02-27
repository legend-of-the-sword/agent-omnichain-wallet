import * as bitcoin from "bitcoinjs-lib";
import axios from "axios";
import * as bitcore from "bitcore-lib";
import crypto from "crypto";

export class Bitcoin {
  private network: bitcoin.networks.Network;
  private explorerUrl: string;

  constructor(config: {
    networkType: "bitcoin" | "testnet";
    explorerUrl: string;
  }) {
    this.network =
      config.networkType === "testnet"
        ? bitcoin.networks.testnet
        : bitcoin.networks.bitcoin;
    this.explorerUrl = config.explorerUrl;
  }

  async fetchBalance(address: string): Promise<string> {
    const utxos = await this.fetchUTXOs(address);
    return utxos.reduce((acc, utxo) => acc + utxo.value, 0).toString();
  }

  async fetchUTXOs(
    address: string
  ): Promise<Array<{ txid: string; vout: number; value: number }>> {
    try {
      const response = await axios.get(
        `${this.explorerUrl}address/${address}/utxo`
      );
      const utxos = response.data.map((utxo: any) => ({
        txid: utxo.txid,
        vout: utxo.vout,
        value: utxo.value,
      }));
      return utxos;
    } catch (error) {
      console.error("Failed to fetch UTXOs:", error);
      return [];
    }
  }

  async fetchFeeRate(): Promise<number> {
    const response = await axios.get(`${this.explorerUrl}fee-estimates`);
    const confirmationTarget = 6;
    if (response.data && response.data[confirmationTarget]) {
      return response.data[confirmationTarget];
    } else {
      throw new Error(
        `Fee rate data for ${confirmationTarget} blocks confirmation target is missing in the response`
      );
    }
  }

  async createTransaction(
    fromAddress: string,
    toAddress: string,
    amountToSend: number,
    changeAddress: string
  ) {
    const utxos = await this.fetchUTXOs(fromAddress);
    const feeRate = await this.fetchFeeRate();

    const psbt = new bitcoin.Psbt({ network: this.network });

    let totalInput = 0;
    utxos.forEach((utxo) => {
      totalInput += utxo.value;
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        nonWitnessUtxo: Buffer.alloc(0),
      });
    });

    psbt.addOutput({
      address: toAddress,
      value: amountToSend,
    });

    const estimatedSize = utxos.length * 148 + 2 * 34 + 10;
    const fee = estimatedSize * feeRate;

    const change = totalInput - amountToSend - fee;
    if (change > 0) {
      psbt.addOutput({
        address: changeAddress,
        value: change,
      });
    }

    // Implementing transaction signing
    utxos.forEach((utxo, index) => {
      const privateKey = this.getPrivateKeyForAddress(utxo.address);
      if (!privateKey) {
        throw new Error(`Missing private key for address ${utxo.address}`);
      }
      psbt.signInput(index, privateKey);
    });
    psbt.finalizeAllInputs();

    // Constructing the transaction hex
    const txHex = psbt.extractTransaction().toHex();

    console.log(`Transaction Fee: ${fee} satoshis`);
    // console.log(`Transaction Hex: ${txHex}`);
  }

  // Example usage
  // static async exampleUsage() {
  //   const bitcoinInstance = new Bitcoin({
  //     networkType: "testnet",
  //     explorerUrl: "https://api.blockcypher.com/v1/btc/test3/addrs/",
  //   });
  //   const fromAddress = "your_from_address";
  //   const toAddress = "recipient_address";
  //   const amountToSend = 100000;
  //   const changeAddress = "your_change_address";
  //   await bitcoinInstance.createTransaction(
  //     fromAddress,
  //     toAddress,
  //     amountToSend,
  //     changeAddress
  //   );
  // }

  // async createTransaction(
  //   fromAddress: string,
  //   toAddress: string,
  //   amountToSend: number,
  //   changeAddress: string
  // ) {
  //   const utxos = await this.fetchUTXOs(fromAddress);
  //   const feeRate = await this.fetchFeeRate();

  //   let transaction = new bitcore.Transaction()
  //     .from(
  //       utxos.map((utxo) => ({
  //         txId: utxo.txid,
  //         outputIndex: utxo.vout,
  //         address: fromAddress,
  //         script: new bitcore.Script(new bitcore.Address(fromAddress)).toHex(),
  //         satoshis: utxo.value,
  //       }))
  //     )
  //     .to(toAddress, amountToSend)
  //     .change(changeAddress)
  //     .feePerKb(feeRate * 1000); // Fee rate is specified in satoshis per kilobyte in bitcore-lib

  //   // Serialize the transaction to get its raw format
  //   const serializedTx = transaction.uncheckedSerialize();

  //   // Hash the serialized transaction using SHA-256
  //   const hash = crypto.createHash("sha256").update(serializedTx).digest("hex");

  //   // // Send the hash to the third-party service for signing
  //   // const signedHash = await this.sendHashToThirdPartyServiceForSigning(hash);

  //   // console.log(`Signed Hash: ${signedHash}`);
  // }
}