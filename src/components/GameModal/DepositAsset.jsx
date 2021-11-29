import React, { useState, useMemo, useEffect } from "react";
import { Space, Typography, Select, Button } from "antd";
import { useWeb3Contract } from "hooks/useWeb3Contract";
import ERC20ABI from "contracts/ERC20.json";
import PriceConverterABI from "contracts/PriceConverter.json";
import BettingGameABI from "contracts/BettingGame.json";
import deployedContracts from "list/deployedContracts.json";
import chainlinkPriceFeeds from "list/chainlinkPriceFeeds.json";
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
    bettingGameAddress,
    isCreator,
  } = props;
  const { chainId } = useMoralisDapp();
  const { fetchNativeTokenPrice, nativeTokenPrice } = useNativeTokenPrice();
  const { abi: erc20ABI } = ERC20ABI;
  const { abi: priceConverterABI } = PriceConverterABI;
  const { abi: bettingGameABI } = BettingGameABI;
  const [isApproved, setIsApproved] = useState(false);
  const [isDeposited, setIsDeposited] = useState(false);
  const [depositAsset, setDepositAsset] = useState("native");

  /**
   * @description Get pricing for ETH/BSC/MATIC to UNI/LINK/DAI
   */
  const {
    contractResponse: depositAmount,
    runContractFunction: runGetPriceConverter,
    isLoading: isPriceConverterLoading,
    isRunning: isPriceConverterRunning,
  } = useWeb3Contract({
    abi: priceConverterABI,
    contractAddress: deployedContracts[chainId].priceConverter,
    functionName: "getDerivedPrice",
    params: {
      _base: chainlinkPriceFeeds[chainId]?.native?.usd,
      _quote: chainlinkPriceFeeds[chainId][depositAsset]?.usd,
      _decimals: 18,
    },
  });

  /**
   * @description Approve ERC20 token before depositing into smart contract
   */
  const {
    runContractFunction: runApprove,
    isLoading: isApproveLoading,
    isRunning: isApproveRunning,
  } = useWeb3Contract({
    abi: erc20ABI,
    contractAddress: erc20TokenAddress[chainId][depositAsset],
    functionName: "approve",
    params: {
      spender: bettingGameAddress,
      amount: depositAmount ?? 0,
    },
  });

  /**
   * @description Deposit ERC20 token to BettingGame smart contract
   */
  const {
    runContractFunction: runDeposit,
    isLoading: isDepositLoading,
    isRunning: isDepositRunning,
  } = useWeb3Contract({
    abi: bettingGameABI,
    contractAddress: bettingGameAddress,
    functionName: "deposit",
    params: {
      _tokenAddress: erc20TokenAddress[chainId][depositAsset],
      _baseAddress: chainlinkPriceFeeds[chainId]?.native?.usd,
      _quoteAddress: chainlinkPriceFeeds[chainId][depositAsset]?.usd,
    },
  });

  const disableButton = useMemo(
    () =>
      isPriceConverterLoading ||
      isPriceConverterRunning ||
      isApproveRunning ||
      isApproveLoading ||
      isDepositLoading ||
      isDepositRunning,
    [
      isPriceConverterLoading,
      isPriceConverterRunning,
      isApproveLoading,
      isApproveRunning,
      isDepositLoading,
      isDepositRunning,
    ]
  );

  useEffect(() => {
    if (depositAsset !== "native") {
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
      fetchNativeTokenPrice(options());
      // Fetch from Chainlink Price Feeds
      runGetPriceConverter();
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
            runDeposit({
              onSuccess: () => setIsDeposited(true),
            });
          } else {
            runApprove({
              onSuccess: () => setIsApproved(true),
            });
          }
        }}
      >
        {isApproved ? "Deposit" : "Approve"}
      </Button>
    </Space>
  );
}
