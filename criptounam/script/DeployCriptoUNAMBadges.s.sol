// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/CriptoUNAMBadges.sol";

/**
 * Variables de entorno:
 *   PRIVATE_KEY    — deployer
 *   INITIAL_ADMIN  — opcional, default: address(PRIVATE_KEY). USAR MULTISIG en mainnet.
 *
 * Dry-run:
 *   forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges --rpc-url $ARBITRUM_RPC_URL
 *
 * Arbitrum One (chainId 42161) — broadcast + verificación con Arbiscan:
 *   forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges \
 *     --rpc-url $ARBITRUM_RPC_URL \
 *     --broadcast \
 *     --verify \
 *     --verifier etherscan \
 *     --verifier-url https://api.arbiscan.io/api \
 *     --etherscan-api-key $ARBISCAN_API_KEY \
 *     --slow
 *
 * Tras desplegar, otorga MINTER_ROLE a la wallet operativa (idealmente multisig) y
 * usa `MintCriptoUNAMBadge.s.sol` para emisiones on-chain.
 */
contract DeployCriptoUNAMBadges is Script {
    function run() external returns (CriptoUNAMBadges badges) {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(privateKey);
        address initialAdmin = vm.envOr("INITIAL_ADMIN", deployer);

        vm.startBroadcast(privateKey);
        badges = new CriptoUNAMBadges(initialAdmin);
        vm.stopBroadcast();

        console2.log("CriptoUNAMBadges deployed at:", address(badges));
        console2.log("initialAdmin:", initialAdmin);
    }
}
