import type { ClockTick, EvmOnEventContext } from 'envio';
import type { ChainId } from '../lib/chain';

/**
 * Generate ClockTick ID: chainId + roundedTimestamp + period
 */
export const clockTickId = ({
    chainId,
    roundedTimestamp,
    period,
}: {
    chainId: ChainId;
    roundedTimestamp: bigint;
    period: bigint;
}): string => {
    return `${chainId}-${roundedTimestamp.toString()}-${period.toString()}`;
};

/**
 * Get ClockTick by ID
 */
export const getClockTick = async ({
    context,
    chainId,
    roundedTimestamp,
    period,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    roundedTimestamp: bigint;
    period: bigint;
}): Promise<ClockTick | null> => {
    const id = clockTickId({ chainId, roundedTimestamp, period });
    const clockTick = await context.ClockTick.get(id);
    return clockTick ?? null;
};

/**
 * Create or get existing ClockTick
 */
export const createClockTick = async ({
    context,
    chainId,
    roundedTimestamp,
    period,
    timestamp,
    blockNumber,
}: {
    context: EvmOnEventContext;
    chainId: ChainId;
    roundedTimestamp: bigint;
    period: bigint;
    timestamp: bigint;
    blockNumber: bigint;
}): Promise<ClockTick> => {
    const id = clockTickId({ chainId, roundedTimestamp, period });
    const existing = await context.ClockTick.get(id);

    if (existing) {
        return existing;
    }

    const clockTick: ClockTick = {
        id,
        period,
        roundedTimestamp,
        timestamp,
        blockNumber,
    } as unknown as ClockTick;

    context.ClockTick.set(clockTick);
    return clockTick;
};
