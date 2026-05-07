import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  userRole: null,
  userEmail: null,
  userId: null,
  token: null,

  login: (email, role, userId, token) =>
    set({
      isAuthenticated: true,
      userRole: role,
      userEmail: email,
      userId,
      token,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      userRole: null,
      userEmail: null,
      userId: null,
      token: null,
    }),

  setOTPVerified: (isVerified) =>
    set({ isOTPVerified: isVerified }),
}));

export const useElectionStore = create((set) => ({
  electionStatus: 'NOT_STARTED',
  candidates: [],
  votes: [],
  totalVoters: 0,
  winner: null,
  hasVoted: false,

  setElectionStatus: (status) => set({ electionStatus: status }),
  setCandidates: (candidates) => set({ candidates }),
  setVotes: (votes) => set({ votes }),
  setTotalVoters: (count) => set({ totalVoters: count }),
  setWinner: (winner) => set({ winner }),
  setHasVoted: (voted) => set({ hasVoted: voted }),
}));

export const useBlockchainStore = create((set) => ({
  walletConnected: false,
  userAddress: null,
  networkId: null,
  txHash: null,

  connectWallet: (address, networkId) =>
    set({
      walletConnected: true,
      userAddress: address,
      networkId,
    }),

  disconnectWallet: () =>
    set({
      walletConnected: false,
      userAddress: null,
      networkId: null,
    }),

  setTxHash: (hash) => set({ txHash: hash }),
}));
