import type { BeefyRewardPool, BeefyVault, EvmOnEventContext, Token } from 'envio';
import type { Hex } from 'viem';
import type { ChainId } from '../lib/chain';
import { InitializableStatus } from '../lib/initializableStatus';

export const beefyRewardPoolId = ({ chainId, address }: { chainId: ChainId; address: Hex }) =>
    `${chainId}-${address.toLowerCase()}`;

export const getBeefyRewardPool = async (context: EvmOnEventContext, chainId: ChainId, address: Hex) => {
    const id = beefyRewardPoolId({ chainId, address });
    return await context.BeefyRewardPool.get(id);
};

export const createBeefyRewardPool = async ({
    context,
    chainId,
    address,
    vault,
    rcowToken,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    address: Hex;
    vault: BeefyVault;
    rcowToken: Token;
}): Promise<BeefyRewardPool> => {
    const id = beefyRewardPoolId({ chainId, address });
    const entity: BeefyRewardPool = {
        id,
        chainId,
        address,
        vault_id: vault.id,
        rcowToken_id: rcowToken.id,
        initializableStatus: InitializableStatus.INITIALIZED,
    } as unknown as BeefyRewardPool;
    context.BeefyRewardPool.set(entity);
    return entity;
};
