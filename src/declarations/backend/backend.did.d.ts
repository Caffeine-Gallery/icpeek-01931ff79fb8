import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface PriceData { 'timestamp' : bigint, 'price' : number }
export interface _SERVICE {
  'addPriceData' : ActorMethod<[number], undefined>,
  'getPriceHistory' : ActorMethod<[], Array<PriceData>>,
  'init' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
