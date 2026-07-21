import type { EvmOnEventContext, Token } from 'envio';
import type { Hex } from 'viem';
import { getTokenMetadataEffect } from '../effects/token.effects';
import type { ChainId } from '../lib/chain';

export const tokenId = ({ chainId, tokenAddress }: { chainId: ChainId; tokenAddress: Hex }) =>
    `${chainId}-${tokenAddress.toLowerCase()}`;

export const getOrCreateToken = async ({
    context,
    chainId,
    tokenAddress,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    tokenAddress: Hex;
}): Promise<Token> => {
    const id = tokenId({ chainId, tokenAddress });
    const maybeExistingToken = await context.Token.get(id);
    if (maybeExistingToken) {
        return maybeExistingToken;
    }

    const tokenMetadata = await context.effect(getTokenMetadataEffect, {
        tokenAddress: tokenAddress,
        chainId: chainId,
    });

    return await context.Token.getOrCreate({
        id,
        chainId,
        address: tokenAddress,
        name: tokenMetadata.name,
        symbol: tokenMetadata.symbol,
        decimals: tokenMetadata.decimals,
    });
};

/**
 * Get token by ID, returns null if not found
 */
export const getToken = async ({ context, id }: { context: EvmOnEventContext; id: string }): Promise<Token | null> => {
    const token = await context.Token.get(id);
    return token ?? null;
};

export const getTokenOrThrow = async ({ context, id }: { context: EvmOnEventContext; id: string }): Promise<Token> => {
    const token = await context.Token.get(id);
    if (!token) {
        throw new Error(`Token ${id} not found`);
    }
    return token;
};
