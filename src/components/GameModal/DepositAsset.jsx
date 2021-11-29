import React, { useState, useMemo, useEffect } from "react";
import { Space, Typography, Select, Button } from "antd";
// import { useWeb3Contract } from "hooks/useWeb3Contract";
// import ERC20ABI from "contracts/ERC20.json";
// import PriceConverterABI from "contracts/PriceConverter.json";
// import BettingGameABI from "contracts/BettingGame.json";
// import deployedContracts from "list/deployedContracts.json";
// import chainlinkPriceFeeds from "list/chainlinkPriceFeeds.json";
import erc20TokenAddress from "list/erc20TokenAddress.json";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { networkConfigs } from "helpers/networks";
import isZeroAddress from "helpers/validators";
import useNativeTokenPrice from "hooks/useNativeTokenPrice";

export default function DepositAsset(props) {
  const {
    initialDepositAsset,
    sides,
    handleNext,
    // bettingGameAddress,
    isCreator,
  } = props;
  const { chainId } = useMoralisDapp();
  const { /*fetchNativeTokenPrice*/ nativeTokenPrice } = useNativeTokenPrice();
  // const { abi: erc20ABI } = ERC20ABI;
  // const { abi: priceConverterABI } = PriceConverterABI;
  // const { abi: bettingGameABI } = BettingGameABI;
  const [isApproved] = useState(false);
  const [isDeposited] = useState(false);
  const [depositAsset, setDepositAsset] = useState("native");

  /**
   * [useWeb3Contract]
   * @description Get pricing for ETH/BSC/MATIC to UNI/LINK/DAI
   *
   * @function getDerivedPrice
   * @contractAddress Price Converter smart contract address
   * @param _base - Chainlink Native/USD price feeds address
   * @param _quote - Chainlink Depoit Asset(UNI/LINK/DAI)/USD price feeds address
   * @param _decimals - 18
   */

  /**
   * [useWeb3Contract]
   * @description Approve ERC20 token before depositing into smart contract
   *
   * @function approve
   * @contractAddress ERC20 token address (UNI/LINK/DAI)
   * @param spender - Betting Game Smart Contract address (`bettingGameAddress`)
   * @param amount - Token amount want to be deposited (in wei); Get the value from `runPriceConverter` result
   */

  /**
   * [useWeb3Contract]
   * @description Deposit ERC20 token to BettingGame smart contract
   *
   * @function deposit
   * @contractAddress Betting Game smart contract address (`bettingGameAddress`)
   * @param _tokenAddress - ERC20 token address (UNI/LINK/DAI)
   * @param _baseAddress - Chainlink Native/USD price feeds address
   * @param _quoteAddress - Chainlink Depoit Asset(UNI/LINK/DAI)/USD price feeds address
   */

  const disableButton = useMemo(() => false, []);

  useEffect(() => {
    if (depositAsset !== "native") {
      // eslint-disable-next-line
      const options = () => {
        switch (chainId) {
          case "0x61":
            return {
              exchange: "pancakeswap-v2",
              address: erc20TokenAddress["0x38"][depositAsset],
            };
          case "0x13881":
            return {
              exchange: "quickswap",
              address: erc20TokenAddress["0x89"][depositAsset],
            };
          case "0x2a":
          default:
            return {
              exchange: "uniswap-v3",
              address: erc20TokenAddress["0x1"][depositAsset],
            };
        }
      };

      // Fetch for Web3 API
      // fetchNativeTokenPrice(options());
      // Fetch from Chainlink Price Feeds
      // runGetPriceConverter();
    }
    // eslint-disable-next-line
  }, [depositAsset]);

  useEffect(() => {
    if (initialDepositAsset && !isZeroAddress(initialDepositAsset)) {
      const getDepositAsset = Object.keys(erc20TokenAddress[chainId]).find(
        (erc20) =>
          erc20TokenAddress[chainId][erc20].toLowerCase() ===
          initialDepositAsset.toLowerCase()
      );
      setDepositAsset(getDepositAsset);
    }
    // eslint-disable-next-line
  }, [initialDepositAsset]);

  useEffect(() => {
    if (isDeposited) {
      handleNext();
    }
    // eslint-disable-next-line
  }, [isDeposited]);

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ display: "flex", alignItems: "center" }}
    >
      <Typography.Text style={{ fontSize: "20px" }}>
        {isCreator
          ? "Choose ERC20 you want to deposit"
          : "Deposit your ERC20 token"}
      </Typography.Text>
      {!isCreator && (
        <Typography.Text>
          Prepare some <b>{depositAsset?.toUpperCase()}</b> before depositing
          it.
        </Typography.Text>
      )}
      {isCreator && (
        <Select
          style={{ minWidth: "200px" }}
          value={depositAsset === "native" ? "" : depositAsset}
          onChange={(value) => setDepositAsset(value)}
          disabled={isApproved}
        >
          {chainId === "0x2a" && (
            <Select.Option value="uni">Uniswap (UNI)</Select.Option>
          )}
          {chainId !== "0x13881" && (
            <Select.Option value="link">Chainlink (LINK)</Select.Option>
          )}
          <Select.Option value="dai">Dai Stablecoin (DAI)</Select.Option>
        </Select>
      )}
      {depositAsset !== "native" && nativeTokenPrice ? (
        <Typography.Text style={{ fontSize: "16px" }}>
          You will deposit approximately{" "}
          <b>
            {((1 / nativeTokenPrice) * sides * 0.01).toFixed(3)}{" "}
            {depositAsset?.toUpperCase()} ({sides * 0.01}{" "}
            {networkConfigs[chainId]?.currencySymbol})
          </b>
        </Typography.Text>
      ) : (
        <></>
      )}
      <Button
        type="primary"
        style={{ width: "100%" }}
        disabled={disableButton}
        onClick={() => {
          if (isApproved) {
            // Run Deposit
          } else {
            // Run Approve
          }
        }}
      >
        {isApproved ? "Deposit" : "Approve"}
      </Button>
    </Space>
  );
}
