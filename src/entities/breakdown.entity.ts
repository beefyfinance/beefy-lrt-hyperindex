import type {
    BeefyVault,
    BigDecimal,
    EvmOnEventContext,
    InvestorPosition,
    InvestorPositionBalanceBreakdown,
    VaultBalanceBreakdown,
} from 'envio';
import type { ChainId } from '../lib/chain';

export const getVaultBalanceBreakdownId = ({
    chainId,
    vault,
    blockNumber,
}: {
    chainId: ChainId;
    vault: BeefyVault;
    blockNumber: bigint;
}): string => `${chainId}-${vault.address.toLowerCase()}-${blockNumber.toString()}`;

export const createVaultBalanceBreakdown = async ({
    context,
    chainId,
    vault,
    blockNumber,
    blockTimestamp,
    balances,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    vault: BeefyVault;
    blockNumber: bigint;
    blockTimestamp: bigint;
    balances: BigDecimal[];
}): Promise<VaultBalanceBreakdown> => {
    const id = getVaultBalanceBreakdownId({ chainId, vault, blockNumber });
    context.log.debug('Getting or creating vault balance breakdown', { id });
    const entity: VaultBalanceBreakdown = {
        id,
        chainId,
        vault_id: vault.id,
        blockNumber,
        blockTimestamp,
        balances,
    } as unknown as VaultBalanceBreakdown;
    context.VaultBalanceBreakdown.set(entity);
    return entity;
};

export const getInvestorPositionBalanceBreakdownId = ({
    investorPosition,
    blockNumber,
}: {
    investorPosition: InvestorPosition;
    blockNumber: bigint;
}): string => `${investorPosition.id}-${blockNumber.toString()}`;

export const upsertInvestorPositionBalanceBreakdown = async ({
    context,
    chainId,
    investorPosition,
    balances,
    timeWeightedBalances,
    blockTimestamp,
    blockNumber,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    investorPosition: InvestorPosition;
    balances: BigDecimal[];
    timeWeightedBalances: BigDecimal[];
    blockTimestamp: bigint;
    blockNumber: bigint;
}): Promise<InvestorPositionBalanceBreakdown> => {
    const id = getInvestorPositionBalanceBreakdownId({ investorPosition, blockNumber });

    const entity: InvestorPositionBalanceBreakdown = {
        id,
        chainId,
        investorPosition_id: investorPosition.id,
        balances,
        timeWeightedBalances,
        lastUpdateTimestamp: blockTimestamp,
        lastUpdateBlock: blockNumber,
    } as unknown as InvestorPositionBalanceBreakdown;

    context.InvestorPositionBalanceBreakdown.set(entity);
    return entity;
};
