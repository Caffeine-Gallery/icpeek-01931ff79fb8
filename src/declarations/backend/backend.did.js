export const idlFactory = ({ IDL }) => {
  const PriceData = IDL.Record({
    'timestamp' : IDL.Int,
    'price' : IDL.Float64,
  });
  return IDL.Service({
    'addPriceData' : IDL.Func([IDL.Float64], [], []),
    'getPriceHistory' : IDL.Func([], [IDL.Vec(PriceData)], ['query']),
    'init' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
