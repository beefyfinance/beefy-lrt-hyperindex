import type { EvmOnEventContext, Investor } from 'envio';
import type { Hex } from 'viem';

export const investorId = ({ address }: { address: Hex }) => `${address.toLowerCase()}`;

export const getOrCreateInvestor = async ({
    context,
    address,
}: {
    context: EvmOnEventContext;
    address: Hex;
}): Promise<Investor> => {
    const id = investorId({ address });
    const existing = await context.Investor.get(id);
    if (existing) {
        return existing;
    }
    const entity: Investor = {
        id,
        address,
    } as unknown as Investor;
    context.Investor.set(entity);
    return entity;
};
