// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PUMAToken
 * @dev Token ERC20 para el sistema de recompensas de CriptoUNAM
 * @author CriptoUNAM Team
 */
contract PUMAToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {
    
    // Eventos
    event RewardMinted(address indexed to, uint256 amount, string reason);
    event RewardBurned(address indexed from, uint256 amount, string reason);
    event RewardTransferred(address indexed from, address indexed to, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount, string mission);
    
    // Estructuras
    struct Reward {
        uint256 amount;
        string reason;
        uint256 timestamp;
        bool claimed;
    }
    
    struct Mission {
        string id;
        string title;
        uint256 reward;
        bool active;
        uint256 deadline;
    }
    
    // Variables de estado
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billón de tokens
    uint256 public constant REWARD_RATE = 100; // 100 tokens por recompensa base
    uint256 public totalRewardsDistributed;
    uint256 public totalRewardsBurned;
    
    // Mapeos
    mapping(address => Reward[]) public userRewards;
    mapping(string => Mission) public missions;
    mapping(address => uint256) public userLevel;
    mapping(address => uint256) public userExperience;
    mapping(address => string[]) public userBadges;
    
    // Arrays
    string[] public missionIds;
    address[] public rewardHolders;
    
    // Modificadores
    modifier onlyRewardManager() {
        require(hasRole(REWARD_MANAGER_ROLE, msg.sender), "Not authorized to manage rewards");
        _;
    }
    
    // Roles
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");
    bytes32 public constant MISSION_MANAGER_ROLE = keccak256("MISSION_MANAGER_ROLE");
    
    constructor() ERC20("PUMA Token", "PUMA") {
        _mint(msg.sender, 10000000 * 10**18); // 10 millones de tokens iniciales
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(REWARD_MANAGER_ROLE, msg.sender);
        _setupRole(MISSION_MANAGER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mintear tokens de recompensa
     * @param to Dirección del destinatario
     * @param amount Cantidad de tokens
     * @param reason Razón de la recompensa
     */
    function mintReward(
        address to, 
        uint256 amount, 
        string memory reason
    ) external onlyRewardManager nonReentrant {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        _mint(to, amount);
        totalRewardsDistributed += amount;
        
        // Agregar a historial de recompensas
        userRewards[to].push(Reward({
            amount: amount,
            reason: reason,
            timestamp: block.timestamp,
            claimed: true
        }));
        
        // Actualizar experiencia
        _updateExperience(to, amount);
        
        emit RewardMinted(to, amount, reason);
    }
    
    /**
     * @dev Quemar tokens de recompensa
     * @param from Dirección del usuario
     * @param amount Cantidad de tokens
     * @param reason Razón de la quema
     */
    function burnReward(
        address from, 
        uint256 amount, 
        string memory reason
    ) external onlyRewardManager nonReentrant {
        require(from != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(from) >= amount, "Insufficient balance");
        
        _burn(from, amount);
        totalRewardsBurned += amount;
        
        emit RewardBurned(from, amount, reason);
    }
    
    /**
     * @dev Transferir tokens de recompensa
     * @param to Dirección del destinatario
     * @param amount Cantidad de tokens
     */
    function transferReward(
        address to, 
        uint256 amount
    ) external nonReentrant {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, to, amount);
        
        emit RewardTransferred(msg.sender, to, amount);
    }
    
    /**
     * @dev Completar misión y reclamar recompensa
     * @param missionId ID de la misión
     */
    function completeMission(string memory missionId) external nonReentrant {
        Mission storage mission = missions[missionId];
        require(mission.active, "Mission not active");
        require(block.timestamp <= mission.deadline, "Mission expired");
        require(bytes(mission.id).length > 0, "Mission does not exist");
        
        // Mintear recompensa
        _mint(msg.sender, mission.reward);
        totalRewardsDistributed += mission.reward;
        
        // Actualizar experiencia
        _updateExperience(msg.sender, mission.reward);
        
        // Desactivar misión
        mission.active = false;
        
        emit RewardClaimed(msg.sender, mission.reward, missionId);
    }
    
    /**
     * @dev Crear nueva misión
     * @param missionId ID de la misión
     * @param title Título de la misión
     * @param reward Recompensa en tokens
     * @param deadline Fecha límite
     */
    function createMission(
        string memory missionId,
        string memory title,
        uint256 reward,
        uint256 deadline
    ) external onlyRole(MISSION_MANAGER_ROLE) {
        require(bytes(missionId).length > 0, "Mission ID required");
        require(reward > 0, "Reward must be greater than 0");
        require(deadline > block.timestamp, "Invalid deadline");
        
        missions[missionId] = Mission({
            id: missionId,
            title: title,
            reward: reward,
            active: true,
            deadline: deadline
        });
        
        missionIds.push(missionId);
    }
    
    /**
     * @dev Actualizar nivel del usuario
     * @param user Dirección del usuario
     * @param newLevel Nuevo nivel
     */
    function updateUserLevel(address user, uint256 newLevel) external onlyRewardManager {
        require(user != address(0), "Invalid address");
        require(newLevel > 0, "Level must be greater than 0");
        
        userLevel[user] = newLevel;
    }
    
    /**
     * @dev Agregar insignia al usuario
     * @param user Dirección del usuario
     * @param badge Nombre de la insignia
     */
    function addBadge(address user, string memory badge) external onlyRewardManager {
        require(user != address(0), "Invalid address");
        require(bytes(badge).length > 0, "Badge name required");
        
        userBadges[user].push(badge);
    }
    
    /**
     * @dev Obtener recompensas del usuario
     * @param user Dirección del usuario
     * @return Array de recompensas
     */
    function getUserRewards(address user) external view returns (Reward[] memory) {
        return userRewards[user];
    }
    
    /**
     * @dev Obtener insignias del usuario
     * @param user Dirección del usuario
     * @return Array de insignias
     */
    function getUserBadges(address user) external view returns (string[] memory) {
        return userBadges[user];
    }
    
    /**
     * @dev Obtener información del usuario
     * @param user Dirección del usuario
     * @return balance Balance actual
     * @return level Nivel actual
     * @return experience Experiencia actual
     * @return badgeCount Cantidad de insignias
     */
    function getUserInfo(address user) external view returns (
        uint256 balance,
        uint256 level,
        uint256 experience,
        uint256 badgeCount
    ) {
        return (
            balanceOf(user),
            userLevel[user],
            userExperience[user],
            userBadges[user].length
        );
    }
    
    /**
     * @dev Obtener estadísticas del token
     * @return totalSupply Suministro total
     * @return totalRewards Total de recompensas distribuidas
     * @return totalBurned Total de tokens quemados
     * @return missionCount Cantidad de misiones
     */
    function getTokenStats() external view returns (
        uint256 totalSupply,
        uint256 totalRewards,
        uint256 totalBurned,
        uint256 missionCount
    ) {
        return (
            totalSupply(),
            totalRewardsDistributed,
            totalRewardsBurned,
            missionIds.length
        );
    }
    
    /**
     * @dev Pausar el contrato
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Despausar el contrato
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Actualizar experiencia del usuario
     * @param user Dirección del usuario
     * @param amount Cantidad de experiencia a agregar
     */
    function _updateExperience(address user, uint256 amount) internal {
        userExperience[user] += amount;
        
        // Calcular nuevo nivel (cada 1000 XP = 1 nivel)
        uint256 newLevel = userExperience[user] / 1000;
        if (newLevel > userLevel[user]) {
            userLevel[user] = newLevel;
        }
    }
    
    /**
     * @dev Hook antes de transferir
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
}
