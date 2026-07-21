import type { BeefyVault, BeefyVaultBreakdownToken, BeefyVaultUnderlyingToken, EvmOnEventContext, Token } from 'envio';
import type { ChainId } from '../lib/chain';

export const beefyVaultUnderlyingTokenId = ({
    chainId,
    vault,
    token,
}: {
    chainId: ChainId;
    vault: BeefyVault;
    token: Token;
}): string => `${chainId}-${vault.address.toLowerCase()}-${token.address.toLowerCase()}`;

export const getOrCreateBeefyVaultUnderlyingToken = async ({
    context,
    chainId,
    vault,
    token,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    vault: BeefyVault;
    token: Token;
}): Promise<BeefyVaultUnderlyingToken> => {
    const id = beefyVaultUnderlyingTokenId({ chainId, vault, token });
    const existing = await context.BeefyVaultUnderlyingToken.get(id);
    if (existing) return existing;
    const entity: BeefyVaultUnderlyingToken = {
        id,
        chainId,
        vault_id: vault.id,
        token_id: token.id,
    } as unknown as BeefyVaultUnderlyingToken;
    context.BeefyVaultUnderlyingToken.set(entity);
    return entity;
};

export const beefyVaultBreakdownTokenId = ({
    chainId,
    vault,
    token,
}: {
    chainId: ChainId;
    vault: BeefyVault;
    token: Token;
}): string => `${chainId}-${vault.address.toLowerCase()}-${token.address.toLowerCase()}`;

export const getOrCreateBeefyVaultBreakdownToken = async ({
    context,
    chainId,
    vault,
    token,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    vault: BeefyVault;
    token: Token;
}): Promise<BeefyVaultBreakdownToken> => {
    const id = beefyVaultBreakdownTokenId({ chainId, vault, token });
    const existing = await context.BeefyVaultBreakdownToken.get(id);
    if (existing) return existing;
    const entity: BeefyVaultBreakdownToken = {
        id,
        chainId,
        vault_id: vault.id,
        token_id: token.id,
    } as unknown as BeefyVaultBreakdownToken;
    context.BeefyVaultBreakdownToken.set(entity);
    return entity;
};
