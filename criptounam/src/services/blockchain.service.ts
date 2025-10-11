// Servicio para integración con blockchain
import { ethers } from 'ethers'
import { ENV_CONFIG } from '../config/env'

// ABI del contrato PUMAToken
const PUMATOKEN_ABI = [
  "function mintReward(address to, uint256 amount, string memory reason) external",
  "function burnReward(address from, uint256 amount, string memory reason) external",
  "function transferReward(address to, uint256 amount) external",
  "function completeMission(string memory missionId) external",
  "function createMission(string memory missionId, string memory title, uint256 reward, uint256 deadline) external",
  "function updateUserLevel(address user, uint256 newLevel) external",
  "function addBadge(address user, string memory badge) external",
  "function getUserRewards(address user) external view returns (tuple(uint256 amount, string reason, uint256 timestamp, bool claimed)[])",
  "function getUserBadges(address user) external view returns (string[])",
  "function getUserInfo(address user) external view returns (uint256 balance, uint256 level, uint256 experience, uint256 badgeCount)",
  "function getTokenStats() external view returns (uint256 totalSupply, uint256 totalRewards, uint256 totalBurned, uint256 missionCount)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "event RewardMinted(address indexed to, uint256 amount, string reason)",
  "event RewardBurned(address indexed from, uint256 amount, string reason)",
  "event RewardTransferred(address indexed from, address indexed to, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 amount, string mission)"
]

export interface BlockchainConfig {
  rpcUrl: string
  chainId: number
  contractAddress: string
  privateKey?: string
}

export interface UserBlockchainData {
  balance: string
  level: number
  experience: number
  badgeCount: number
  rewards: Array<{
    amount: string
    reason: string
    timestamp: number
    claimed: boolean
  }>
  badges: string[]
}

export interface TokenStats {
  totalSupply: string
  totalRewards: string
  totalBurned: string
  missionCount: number
}

export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider
  private contract: ethers.Contract
  private wallet?: ethers.Wallet
  private signer?: ethers.Signer

  constructor(config: BlockchainConfig) {
    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl)
    this.contract = new ethers.Contract(config.contractAddress, PUMATOKEN_ABI, this.provider)
    
    if (config.privateKey) {
      this.wallet = new ethers.Wallet(config.privateKey, this.provider)
      this.signer = this.wallet
    }
  }

  // Conectar wallet del usuario
  async connectWallet(): Promise<ethers.providers.Web3Provider> {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      return provider
    } else {
      throw new Error('MetaMask no está instalado')
    }
  }

  // Obtener signer del usuario
  async getUserSigner(): Promise<ethers.Signer> {
    const provider = await this.connectWallet()
    return provider.getSigner()
  }

  // Obtener balance del usuario
  async getUserBalance(userAddress: string): Promise<string> {
    try {
      const balance = await this.contract.balanceOf(userAddress)
      return ethers.utils.formatEther(balance)
    } catch (error) {
      console.error('Error obteniendo balance:', error)
      return '0'
    }
  }

  // Obtener información completa del usuario
  async getUserInfo(userAddress: string): Promise<UserBlockchainData> {
    try {
      const [balance, level, experience, badgeCount] = await this.contract.getUserInfo(userAddress)
      const rewards = await this.contract.getUserRewards(userAddress)
      const badges = await this.contract.getUserBadges(userAddress)

      return {
        balance: ethers.utils.formatEther(balance),
        level: level.toNumber(),
        experience: experience.toNumber(),
        badgeCount: badgeCount.toNumber(),
        rewards: rewards.map((reward: any) => ({
          amount: ethers.utils.formatEther(reward.amount),
          reason: reward.reason,
          timestamp: reward.timestamp.toNumber(),
          claimed: reward.claimed
        })),
        badges: badges
      }
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error)
      throw error
    }
  }

  // Mintear recompensa (solo admin)
  async mintReward(
    to: string, 
    amount: string, 
    reason: string
  ): Promise<ethers.providers.TransactionResponse> {
    try {
      if (!this.signer) {
        throw new Error('No hay signer configurado')
      }

      const contractWithSigner = this.contract.connect(this.signer)
      const amountWei = ethers.utils.parseEther(amount)
      
      const tx = await contractWithSigner.mintReward(to, amountWei, reason)
      return tx
    } catch (error) {
      console.error('Error minteando recompensa:', error)
      throw error
    }
  }

  // Quemar tokens (solo admin)
  async burnReward(
    from: string, 
    amount: string, 
    reason: string
  ): Promise<ethers.providers.TransactionResponse> {
    try {
      if (!this.signer) {
        throw new Error('No hay signer configurado')
      }

      const contractWithSigner = this.contract.connect(this.signer)
      const amountWei = ethers.utils.parseEther(amount)
      
      const tx = await contractWithSigner.burnReward(from, amountWei, reason)
      return tx
    } catch (error) {
      console.error('Error quemando tokens:', error)
      throw error
    }
  }

  // Transferir tokens entre usuarios
  async transferReward(
    to: string, 
    amount: string
  ): Promise<ethers.providers.TransactionResponse> {
    try {
      const signer = await this.getUserSigner()
      const contractWithSigner = this.contract.connect(signer)
      const amountWei = ethers.utils.parseEther(amount)
      
      const tx = await contractWithSigner.transferReward(to, amountWei)
      return tx
    } catch (error) {
      console.error('Error transfiriendo tokens:', error)
      throw error
    }
  }

  // Completar misión
  async completeMission(missionId: string): Promise<ethers.providers.TransactionResponse> {
    try {
      const signer = await this.getUserSigner()
      const contractWithSigner = this.contract.connect(signer)
      
      const tx = await contractWithSigner.completeMission(missionId)
      return tx
    } catch (error) {
      console.error('Error completando misión:', error)
      throw error
    }
  }

  // Crear misión (solo admin)
  async createMission(
    missionId: string,
    title: string,
    reward: string,
    deadline: number
  ): Promise<ethers.providers.TransactionResponse> {
    try {
      if (!this.signer) {
        throw new Error('No hay signer configurado')
      }

      const contractWithSigner = this.contract.connect(this.signer)
      const rewardWei = ethers.utils.parseEther(reward)
      
      const tx = await contractWithSigner.createMission(missionId, title, rewardWei, deadline)
      return tx
    } catch (error) {
      console.error('Error creando misión:', error)
      throw error
    }
  }

  // Actualizar nivel del usuario (solo admin)
  async updateUserLevel(user: string, newLevel: number): Promise<ethers.providers.TransactionResponse> {
    try {
      if (!this.signer) {
        throw new Error('No hay signer configurado')
      }

      const contractWithSigner = this.contract.connect(this.signer)
      const tx = await contractWithSigner.updateUserLevel(user, newLevel)
      return tx
    } catch (error) {
      console.error('Error actualizando nivel:', error)
      throw error
    }
  }

  // Agregar insignia (solo admin)
  async addBadge(user: string, badge: string): Promise<ethers.providers.TransactionResponse> {
    try {
      if (!this.signer) {
        throw new Error('No hay signer configurado')
      }

      const contractWithSigner = this.contract.connect(this.signer)
      const tx = await contractWithSigner.addBadge(user, badge)
      return tx
    } catch (error) {
      console.error('Error agregando insignia:', error)
      throw error
    }
  }

  // Obtener estadísticas del token
  async getTokenStats(): Promise<TokenStats> {
    try {
      const [totalSupply, totalRewards, totalBurned, missionCount] = await this.contract.getTokenStats()
      
      return {
        totalSupply: ethers.utils.formatEther(totalSupply),
        totalRewards: ethers.utils.formatEther(totalRewards),
        totalBurned: ethers.utils.formatEther(totalBurned),
        missionCount: missionCount.toNumber()
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  // Escuchar eventos del contrato
  async listenToEvents(callback: (event: any) => void): Promise<void> {
    try {
      // Escuchar evento de recompensa minteada
      this.contract.on('RewardMinted', (to, amount, reason, event) => {
        callback({
          type: 'RewardMinted',
          to,
          amount: ethers.utils.formatEther(amount),
          reason,
          transactionHash: event.transactionHash
        })
      })

      // Escuchar evento de recompensa quemada
      this.contract.on('RewardBurned', (from, amount, reason, event) => {
        callback({
          type: 'RewardBurned',
          from,
          amount: ethers.utils.formatEther(amount),
          reason,
          transactionHash: event.transactionHash
        })
      })

      // Escuchar evento de recompensa transferida
      this.contract.on('RewardTransferred', (from, to, amount, event) => {
        callback({
          type: 'RewardTransferred',
          from,
          to,
          amount: ethers.utils.formatEther(amount),
          transactionHash: event.transactionHash
        })
      })

      // Escuchar evento de misión completada
      this.contract.on('RewardClaimed', (user, amount, mission, event) => {
        callback({
          type: 'RewardClaimed',
          user,
          amount: ethers.utils.formatEther(amount),
          mission,
          transactionHash: event.transactionHash
        })
      })
    } catch (error) {
      console.error('Error escuchando eventos:', error)
      throw error
    }
  }

  // Detener escucha de eventos
  removeAllListeners(): void {
    this.contract.removeAllListeners()
  }

  // Obtener configuración de red
  getNetworkConfig() {
    return {
      chainId: ENV_CONFIG.CHAIN_ID || 1,
      rpcUrl: ENV_CONFIG.RPC_URL || 'https://mainnet.infura.io/v3/' + ENV_CONFIG.INFURA_ID,
      contractAddress: ENV_CONFIG.PUMA_TOKEN_ADDRESS || '',
      explorerUrl: ENV_CONFIG.EXPLORER_URL || 'https://etherscan.io'
    }
  }
}

// Instancia global del servicio
export const blockchainService = new BlockchainService({
  rpcUrl: ENV_CONFIG.RPC_URL || 'https://mainnet.infura.io/v3/' + ENV_CONFIG.INFURA_ID,
  chainId: ENV_CONFIG.CHAIN_ID || 1,
  contractAddress: ENV_CONFIG.PUMA_TOKEN_ADDRESS || '',
  privateKey: ENV_CONFIG.ADMIN_PRIVATE_KEY
})

export default BlockchainService
