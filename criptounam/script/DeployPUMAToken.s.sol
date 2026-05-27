// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/PUMAToken.sol";

/**
 * Variables de entorno:
 *   PRIVATE_KEY    — deployer (también recibe INITIAL_MINT). USA HARDWARE WALLET / KEYSTORE en mainnet.
 *   INITIAL_ADMIN  — opcional, default: address(PRIVATE_KEY). USAR MULTISIG en mainnet.
 *   INITIAL_MINT   — opcional, default: 10_000_000e18 (wei). No superar MAX_SUPPLY (1_000_000_000e18).
 *
 * Dry-run (no broadcast, simulado contra el RPC):
 *   forge script script/DeployPUMAToken.s.sol:DeployPUMAToken --rpc-url $ARBITRUM_RPC_URL
 *
 * Arbitrum One (mainnet, chainId 42161) — broadcast + verificación con Arbiscan:
 *   forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
 *     --rpc-url $ARBITRUM_RPC_URL \
 *     --broadcast \
 *     --verify \
 *     --verifier etherscan \
 *     --verifier-url https://api.arbiscan.io/api \
 *     --etherscan-api-key $ARBISCAN_API_KEY \
 *     --slow
 *
 * SIEMPRE ejecuta el dry-run primero y revisa: gas total, nonce, address resultante.
 */
contract DeployPUMAToken is Script {
    function run() external returns (PUMAToken token) {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(privateKey);

        address initialAdmin = vm.envOr("INITIAL_ADMIN", deployer);
        uint256 initialMint = vm.envOr("INITIAL_MINT", uint256(10_000_000 * 1e18));

        vm.startBroadcast(privateKey);
        token = new PUMAToken(initialAdmin, initialMint);
        vm.stopBroadcast();

        console2.log("PUMAToken deployed at:", address(token));
        console2.log("initialAdmin:", initialAdmin);
        console2.log("initialMint:", initialMint);
    }
}
