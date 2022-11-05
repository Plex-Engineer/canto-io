import { BigNumber, Contract, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { comptrollerAbi } from "global/config/abi";
import { ADDRESSES } from "global/config/addresses";
import { CantoMainnet, CantoTestnet } from "global/config/networks";
import { TOKENS } from "global/config/tokenInfo";
import { UserLMTokenDetails } from "../config/interfaces";
import { UserLPTokenInfo } from "./useLPUserData";

export async function getHypotheticalLiquidityCantoPrice(
  account: string,
  chainId: number,
  lmTokens?: UserLMTokenDetails[],
  lpTokens?: UserLPTokenInfo[],
  cantoPrice?: string
) {
  if (!lmTokens || !lpTokens || !cantoPrice) {
    return;
  }
  account = "0x8915da99B69e84DE6C97928d378D9887482C671c";
  const onTestnet = chainId == CantoTestnet.chainId;
  const providerURL = onTestnet ? CantoTestnet.rpcUrl : CantoMainnet.rpcUrl;
  const provider = new ethers.providers.JsonRpcProvider(providerURL);
  const comptrollerAdd = onTestnet
    ? ADDRESSES.testnet.Comptroller
    : ADDRESSES.cantoMainnet.Comptroller;
  const Comptroller = new Contract(comptrollerAdd, comptrollerAbi, provider);
  const [, accountLiquidity, shortfall] = await Comptroller.getAccountLiquidity(
    account
  );

  if (!shortfall.isZero()) {
    console.log("in liquidation already");
    return;
  }

  const cantolmToken = lmTokens.find(
    (token) => token.data.underlying.symbol == TOKENS.cantoMainnet.CANTO.symbol
  );
  const cantoSupply = cantolmToken?.collateral
    ? cantolmToken.supplyBalanceinNote
        .mul(cantolmToken.collateralFactor)
        .div(BigNumber.from(10).pow(18))
    : BigNumber.from(0);
  const cantoBorrow = cantolmToken?.borrowBalanceinNote ?? BigNumber.from(0);
  let LPSupply = BigNumber.from(0);
  let LPBorrow = BigNumber.from(0);
  lpTokens.forEach((token) => {
    if (isCantoToken(token.data.LPAddress, onTestnet)) {
      if (!token.borrow.balance.isZero()) {
        LPBorrow = LPBorrow.add(token.borrow.balance).mul(
          token.data.priceInNote
        );
      }
      if (token.supply.collateral && token.supply.balance) {
        LPSupply = LPSupply.add(
          token.supply.balance
            .mul(token.supply.collateralFactor)
            .div(BigNumber.from(10).pow(18))
        );
      }
    }
  });
  console.log(cantoBorrow, cantoSupply, LPBorrow, LPSupply);
  console.log(
    getCantoPriceChangeForLiquidation(
      accountLiquidity,
      cantoSupply,
      cantoBorrow,
      LPSupply,
      LPBorrow
    )
  );
  return getCantoPriceChangeForLiquidation(
    accountLiquidity,
    cantoSupply,
    cantoBorrow,
    LPSupply,
    LPBorrow
  );
}

function isCantoToken(address: string, onTestnet: boolean) {
  const tokenList = onTestnet ? TOKENS.cantoTestnet : TOKENS.cantoMainnet;
  return [
    tokenList.WCANTO.address,
    tokenList.CantoAtom.address,
    tokenList.CantoETH.address,
    tokenList.CantoNote.address,
  ].includes(address);
}

function liquidityChange(
  supply: BigNumber,
  priceChange: number,
  collateralFactor: BigNumber
) {
  return supply
    .mul(priceChange)
    .mul(collateralFactor)
    .div(BigNumber.from(10).pow(18));
}

function getCantoPriceChangeForLiquidation(
  liquidity: BigNumber,
  cantoSupply: BigNumber,
  cantoBorrow: BigNumber,
  LPSupply: BigNumber,
  LPBorrow: BigNumber
) {
  if (
    LPBorrow.isZero() &&
    cantoBorrow.isZero() &&
    !(cantoSupply.isZero() || LPSupply.isZero()) //no borrows, just supply
  ) {
    return (
      Number(formatUnits(liquidity)) /
      Number(formatUnits(LPSupply.div(2).add(cantoSupply)))
    );
  } else if (
    !(cantoBorrow.isZero() && LPBorrow.isZero()) && //no supply, just borrows
    cantoSupply.isZero() &&
    LPSupply.isZero()
  ) {
    return (
      Number(formatUnits(liquidity)) /
      Number(formatUnits(LPBorrow.div(2).add(cantoBorrow)))
    );
  }
  return 0;
}

//will be in terms of percent change of canto price
function priceChangeOfLPRelativeToCanto(
  reserveA: BigNumber,
  reserveB: BigNumber,
  decimalsA: number,
  decimalsB: number,
  priceCanto: number,
  priceChangeCanto: number,
  totalLP: BigNumber,
  iniitalPriceLP: number
) {
  const hypotheticalPriceNonCantoAsset =
    Number(
      formatUnits(
        reserveB.mul(BigNumber.from(10).pow(decimalsB)).div(reserveA),
        decimalsA
      )
    ) *
    priceCanto *
    (1 + priceChangeCanto);

  const newPriceLP =
    Number(formatUnits(reserveA)) * priceCanto * (1 + priceChangeCanto) +
    (Number(formatUnits(reserveB, decimalsB)) *
      hypotheticalPriceNonCantoAsset) /
      Number(formatUnits(totalLP));
  return (newPriceLP - iniitalPriceLP) / iniitalPriceLP;
}
