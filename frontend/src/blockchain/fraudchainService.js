import { ethers } from 'ethers';
import VotingABI from './VotingABI.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const NETWORK_ID = import.meta.env.VITE_METHAMASK_NETWORK_ID || '11155111';

export class VotingBlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.userAddress = null;
  }

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.userAddress = accounts[0];
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Check network
      const network = await this.provider.getNetwork();
      if (network.chainId.toString() !== NETWORK_ID) {
        await this.switchNetwork();
      }

      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VotingABI,
        this.signer
      );

      return this.userAddress;
    } catch (error) {
      throw error;
    }
  }

  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(NETWORK_ID).toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${parseInt(NETWORK_ID).toString(16)}`,
              chainName: 'Sepolia',
              rpcUrls: [import.meta.env.VITE_SEPOLIA_RPC_URL],
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
            },
          ],
        });
      }
    }
  }

  async getCandidates() {
    if (!this.contract) throw new Error('Wallet not connected');
    return await this.contract.getCandidates();
  }

  async castVote(candidateId) {
    if (!this.contract) throw new Error('Wallet not connected');
    const tx = await this.contract.vote(candidateId);
    return await tx.wait();
  }

  async hasVoted() {
    if (!this.contract) throw new Error('Wallet not connected');
    return await this.contract.voters(this.userAddress);
  }

  async getResults() {
    if (!this.contract) throw new Error('Wallet not connected');
    const candidates = await this.contract.getCandidates();
    const results = [];

    for (const candidate of candidates) {
      const votes = await this.contract.getVotes(candidate.id);
      results.push({
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        image: candidate.image,
        voteCount: Number(votes),
      });
    }

    return results;
  }

  async startElection() {
    if (!this.contract) throw new Error('Wallet not connected');
    const tx = await this.contract.startElection();
    return await tx.wait();
  }

  async endElection() {
    if (!this.contract) throw new Error('Wallet not connected');
    const tx = await this.contract.endElection();
    return await tx.wait();
  }

  async getElectionStatus() {
    if (!this.contract) throw new Error('Wallet not connected');
    return await this.contract.getElectionStatus();
  }

  async addCandidate(name, party, image) {
    if (!this.contract) throw new Error('Wallet not connected');
    const tx = await this.contract.addCandidate(name, party, image);
    return await tx.wait();
  }

  disconnectWallet() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.userAddress = null;
  }
}

export const blockchainService = new VotingBlockchainService();
