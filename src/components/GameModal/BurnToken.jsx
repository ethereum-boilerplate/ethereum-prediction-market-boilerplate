import React, { useState, useMemo, useEffect } from "react";
import { Space, Typography, InputNumber, Button } from "antd";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useWeb3Contract } from "hooks/useWeb3Contract";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import ERC20BasicABI from "../../contracts/ERC20Basic.json";
import BettingGameRegistryABI from "../../contracts/BettingGameRegistry.json";
import BettingGameABI from "../../contracts/BettingGame.json";
import deployedContracts from "../../list/deployedContracts.json";
import database from "../../list/database.json";

export default function BurnToken(props) {
  const {
    sides,
    bettingGameAddress,
    handleInputNumberChange,
    handleBettingGameAddress,
    handleNext,
    isCreator,
  } = props;
  const { chainId } = useMoralisDapp();
  const { Moralis } = useMoralis();
  const { abi: erc20BasicABI } = ERC20BasicABI;
  const { abi: bettingGameRegistryABI } = BettingGameRegistryABI;
  const { abi: bettingGameABI } = BettingGameABI;
  const [isApproved, setIsApproved] = useState(false);
  const [isBurnt, setIsBurnt] = useState(false);
  const [transactionHash, setTransactionHash] = useState();

  /**
   * @description Fetch `BettingGameCreated` event data from DB
   */
  const {
    data: bettingGameData,
    isFetching: isBettingGameFetching,
    isLoading: isBettingGameLoading,
  } = useMoralisQuery(
    database[chainId]?.bettingGameCreated,
    (query) => query.equalTo("transaction_hash", transactionHash),
    [transactionHash, chainId]
  );

  /**
   * @description Approve ERC20 token before burning it
   */
  const {
    runContractFunction: runApprove,
    isLoading: isApproveLoading,
    isRunning: isApproveRunning,
  } = useWeb3Contract({
    abi: erc20BasicABI,
    contractAddress: deployedContracts[chainId].erc20Basic,
    functionName: "approve",
    params: {
      spender: isCreator
        ? deployedContracts[chainId].bettingGameRegistry
        : bettingGameAddress,
      amount: Moralis.Units.Token(0.01 * sides, 18),
    },
  });

  /**
   * @description Create a new Betting Game as a Creator
   */
  const {
    runContractFunction: runCreateGame,
    isLoading: isCreateGameLoading,
    isRunning: isCreateGameRunning,
  } = useWeb3Contract({
    abi: bettingGameRegistryABI,
    contractAddress: deployedContracts[chainId].bettingGameRegistry,
    functionName: "createGame",
    params: {
      _sides: sides,
    },
  });

  /**
   * @description Register Address as Challenger for the Game
   */
  const {
    runContractFunction: runChallenge,
    isLoading: isChallengeLoading,
    isRunning: isChallengeRunning,
  } = useWeb3Contract({
    abi: bettingGameABI,
    contractAddress: bettingGameAddress ?? "",
    functionName: "challenge",
    params: {},
  });

  const disableButton = useMemo(
    () =>
      isApproveLoading ||
      isApproveRunning ||
      isCreateGameLoading ||
      isCreateGameRunning ||
      isChallengeLoading ||
      isChallengeRunning ||
      isBettingGameFetching ||
      isBettingGameLoading,
    [
      isApproveLoading,
      isApproveRunning,
      isCreateGameLoading,
      isCreateGameRunning,
      isChallengeLoading,
      isChallengeRunning,
      isBettingGameFetching,
      isBettingGameLoading,
    ]
  );

  useEffect(() => {
    if (
      bettingGameData &&
      bettingGameData?.length === 1 &&
      bettingGameAddress === "" &&
      isBurnt &&
      isCreator
    ) {
      const { attributes } = bettingGameData[0];
      const { bettingGameAddress: res } = attributes;
      handleBettingGameAddress(res);
      handleNext();
    }
    // eslint-disable-next-line
  }, [bettingGameData, bettingGameAddress, isBurnt]);

  useEffect(() => {
    if (isBurnt && !isCreator) {
      handleNext();
    }
    // eslint-disable-next-line
  }, [isBurnt]);

  return (
    <Space direction="vertical" size="middle" style={{ fontSize: "16px" }}>
      {isCreator ? (
        <>
          <Typography.Text>Choose the number of sides</Typography.Text>
          <InputNumber
            min={1}
            value={sides}
            onChange={handleInputNumberChange}
            style={{ width: "100%" }}
            disabled={isApproved}
          />
        </>
      ) : (
        <Typography.Text>
          Burn your token to participate as a Challenger
        </Typography.Text>
      )}
      <Button
        type="primary"
        disabled={disableButton}
        onClick={() => {
          if (isApproved) {
            if (isCreator) {
              runCreateGame({
                onSuccess: (result) => {
                  const { transactionHash } = result;
                  setTransactionHash(transactionHash);
                  setIsBurnt(true);
                },
              });
            } else {
              runChallenge({
                onSuccess: () => setIsBurnt(true),
              });
            }
          } else {
            runApprove({
              onSuccess: () => setIsApproved(true),
            });
          }
        }}
        style={{ width: "100%" }}
      >
        {isApproved ? "Burn" : "Approve"}
      </Button>
    </Space>
  );
}
