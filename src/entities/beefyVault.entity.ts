import { type BeefyStrategy, type BeefyVault, BigDecimal, type EvmOnEventContext, type Token } from 'envio';
import type { Hex } from 'viem';
import type { ChainId } from '../lib/chain';
import { InitializableStatus } from '../lib/initializableStatus';
import { getOrCreateBeefyVaultUnderlyingToken } from './vaultToken.entity';

export const beefyVaultId = ({ chainId, address }: { chainId: ChainId; address: Hex }) =>
    `${chainId}-${address.toLowerCase()}`;

export const getBeefyVault = async (context: EvmOnEventContext, chainId: ChainId, address: Hex) => {
    const id = beefyVaultId({ chainId, address });
    return await context.BeefyVault.get(id);
};

/**
 * Get vault by ID, returns null if not found
 */
export const getBeefyVaultById = async ({
    context,
    id,
}: {
    context: EvmOnEventContext;
    id: string;
}): Promise<BeefyVault | null> => {
    const vault = await context.BeefyVault.get(id);
    return vault ?? null;
};

/**
 * Update vault entity
 */
export const updateBeefyVault = async ({
    context,
    vault,
}: {
    context: EvmOnEventContext;
    vault: BeefyVault;
}): Promise<void> => {
    context.BeefyVault.set(vault);
};

export const createBeefyVault = async ({
    context,
    chainId,
    address,
    sharesToken,
    underlyingTokens,
    strategyAddress,
    vaultId,
    underlyingPlatform,
    initializedBlockNumber,
    initializedTimestamp,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    address: Hex;
    sharesToken: Token;
    underlyingTokens: Token[];
    strategyAddress: Hex;
    vaultId: string;
    underlyingPlatform: string;
    initializedBlockNumber: bigint;
    initializedTimestamp: bigint;
}): Promise<BeefyVault> => {
    const id = beefyVaultId({ chainId, address });
    context.log.debug('Getting or creating beefy vault', { id });
    const vault: BeefyVault = {
        id,
        chainId,
        address,
        sharesToken_id: sharesToken.id,
        strategy_id: `${chainId}-${strategyAddress.toLowerCase()}`,
        initializableStatus: InitializableStatus.INITIALIZED,
        underlyingPlatform,
        vaultId,
        lastBalanceBreakdownUpdateBlockNumber: initializedBlockNumber,
        lastBalanceBreakdownUpdateTimestamp: initializedTimestamp,
        sharesTokenTotalSupply: new BigDecimal(0),
        breakdownTokensOrder: underlyingTokens.map((token) => token.id),
    } as unknown as BeefyVault;

    context.BeefyVault.set(vault);

    // Create underlying token entities for all tokens
    await Promise.all(
        underlyingTokens.map((token) => getOrCreateBeefyVaultUnderlyingToken({ context, chainId, vault, token }))
    );

    await createBeefyStrategy({ context, chainId, strategyAddress, vault });

    return vault;
};

/**
 * Get all vaults for a chain
 */
export const getAllBeefyVaultsForChain = async ({
    context,
    chainId,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
}): Promise<BeefyVault[]> => {
    return await context.BeefyVault.getWhere.chainId.eq(chainId);
};

export const getBeefyStrategyId = ({ chainId, address }: { chainId: ChainId; address: Hex }) =>
    `${chainId}-${address.toLowerCase()}`;

export const createBeefyStrategy = async ({
    context,
    chainId,
    strategyAddress,
    vault,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    strategyAddress: Hex;
    vault: BeefyVault;
}): Promise<BeefyStrategy> => {
    const id = getBeefyStrategyId({ chainId, address: strategyAddress });
    context.log.debug('Getting or creating beefy strategy', { id });
    const strategy: BeefyStrategy = {
        id,
        chainId,
        address: strategyAddress,
        vault_id: vault.id,
        initializableStatus: InitializableStatus.INITIALIZED,
    } as unknown as BeefyStrategy;
    context.BeefyStrategy.set(strategy);
    return strategy;
};
