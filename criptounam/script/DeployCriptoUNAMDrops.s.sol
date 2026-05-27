// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/CriptoUNAMDrops.sol";

/**
 * Deploy de CriptoUNAMDrops (coordinador PUMA + Badges con código compartido).
 *
 * Variables de entorno:
 *   PRIVATE_KEY        — deployer
 *   INITIAL_ADMIN      — opcional, default: address(PRIVATE_KEY). USAR MULTISIG en mainnet.
 *   PUMA_TOKEN         — dirección de PUMAToken ya desplegado
 *   BADGES_CONTRACT    — dirección de CriptoUNAMBadges ya desplegado
 *
 * Dry-run:
 *   forge script script/DeployCriptoUNAMDrops.s.sol:DeployCriptoUNAMDrops --rpc-url $ARBITRUM_RPC_URL
 *
 * Arbitrum One (chainId 42161):
 *   forge script script/DeployCriptoUNAMDrops.s.sol:DeployCriptoUNAMDrops \
 *     --rpc-url $ARBITRUM_RPC_URL \
 *     --broadcast \
 *     --verify \
 *     --verifier etherscan \
 *     --verifier-url https://api.arbiscan.io/api \
 *     --etherscan-api-key $ARBISCAN_API_KEY \
 *     --slow
 *
 * Tras el deploy hay que otorgar roles cruzados (NO los hace este script para no
 * forzar que el deployer sea el admin de PUMA/Badges):
 *   cast send $PUMA_TOKEN "grantRole(bytes32,address)" \
 *     $(cast keccak "REWARD_MANAGER_ROLE") $DROPS_ADDRESS \
 *     --rpc-url $ARBITRUM_RPC_URL --private-key $ADMIN_KEY
 *
 *   cast send $BADGES_CONTRACT "grantRole(bytes32,address)" \
 *     $(cast keccak "MINTER_ROLE") $DROPS_ADDRESS \
 *     --rpc-url $ARBITRUM_RPC_URL --private-key $ADMIN_KEY
 *
 * Sin esos dos roles, claimDrop() revertirá al intentar mintear.
 */
contract DeployCriptoUNAMDrops is Script {
    function run() external returns (CriptoUNAMDrops drops) {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(privateKey);
        address initialAdmin = vm.envOr("INITIAL_ADMIN", deployer);
        address pumaToken = vm.envAddress("PUMA_TOKEN");
        address badgesContract = vm.envAddress("BADGES_CONTRACT");

        require(pumaToken != address(0), "PUMA_TOKEN required");
        require(badgesContract != address(0), "BADGES_CONTRACT required");

        vm.startBroadcast(privateKey);
        drops = new CriptoUNAMDrops(initialAdmin, pumaToken, badgesContract);
        vm.stopBroadcast();

        console2.log("CriptoUNAMDrops deployed at:", address(drops));
        console2.log("initialAdmin:", initialAdmin);
        console2.log("puma:", pumaToken);
        console2.log("badges:", badgesContract);
        console2.log("");
        console2.log("Next: grant REWARD_MANAGER_ROLE on PUMA and MINTER_ROLE on Badges to Drops:");
        console2.log("  cast send <PUMA>   grantRole(bytes32,address) <REWARD_MANAGER_ROLE> <DROPS>");
        console2.log("  cast send <BADGES> grantRole(bytes32,address) <MINTER_ROLE>         <DROPS>");
    }
}
