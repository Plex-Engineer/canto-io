import { parseUnits } from "ethers/lib/utils";
import { maxWithdrawalInUnderlying } from "pages/lending/utils/supplyWithdrawLimits";

// test("Max withdrawal in underlying", () => {
//   const testCases = [
//     {
//       used: parseUnits("1000", 18),
//       limit: parseUnits("10000", 18),
//       collateralFactor: parseUnits("0.5", 18),
//       percentOfLimit: 100,
//       price: parseUnits("1", 18),
//       tokenDecimals: 18,
//       expected: parseUnits("4500", 18),
//     },
//   ];
//   for (const testCase of testCases) {
//     const test = maxWithdrawalInUnderlying(
//       testCase.used,
//       testCase.limit,
//       testCase.collateralFactor,
//       testCase.percentOfLimit,
//       testCase.price,
//       testCase.tokenDecimals
//     );
//     expect(test).toEqual(testCase.expected);
//   }
// });
