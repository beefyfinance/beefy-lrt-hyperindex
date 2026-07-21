import { type BeefyVault, BigDecimal, type EvmOnEventContext, type Investor, type InvestorPosition } from 'envio';
import type { ChainId } from '../lib/chain';

export const investorPositionId = ({
    chainId,
    vault,
    investor,
}: {
    chainId: ChainId;
    vault: BeefyVault;
    investor: Investor;
}) => `${chainId}-${vault.address.toLowerCase()}-${investor.address.toLowerCase()}`;

export const getOrCreateInvestorPosition = async ({
    context,
    chainId,
    vault,
    investor,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    vault: BeefyVault;
    investor: Investor;
}): Promise<InvestorPosition> => {
    const id = investorPositionId({ chainId, vault, investor });
    const existing = await context.InvestorPosition.get(id);
    if (existing) return existing;
    return await context.InvestorPosition.getOrCreate({
        id,
        chainId,
        investor_id: investor.id,
        vault_id: vault.id,
        directSharesBalance: new BigDecimal(0),
        rewardPoolSharesBalance: new BigDecimal(0),
        totalSharesBalance: new BigDecimal(0),
        lastBalanceBreakdownBalances: [],
        lastBalanceBreakdownTimeWeightedBalances: [],
        lastBalanceBreakdownTimestamp: BigInt(0),
        lastBalanceBreakdownBlock: BigInt(0),
    });
};

/**
 * Get all investor positions for a vault
 */
export const getAllInvestorPositionsForVault = async ({
    context,
    vault,
}: {
    context: EvmOnEventContext;
    vault: BeefyVault;
}): Promise<InvestorPosition[]> => {
    return await context.InvestorPosition.getWhere({ vault_id: { _eq: vault.id } });
};

/**
 * Update investor position entity
 */
export const updateInvestorPosition = async ({
    context,
    investorPosition,
}: {
    context: EvmOnEventContext;
    investorPosition: InvestorPosition;
}): Promise<void> => {
    context.InvestorPosition.set(investorPosition);
};
