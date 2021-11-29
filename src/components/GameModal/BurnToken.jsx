import React, { useState, useMemo, useEffect } from "react";
import { Space, Typography, InputNumber, Button } from "antd";
// import { useMoralis, useMoralisQuery } from "react-moralis";
// import { useWeb3Contract } from "hooks/useWeb3Contract";
// import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
// import ERC20BasicABI from "../../contracts/ERC20Basic.json";
// import BettingGameRegistryABI from "../../contracts/BettingGameRegistry.json";
// import BettingGameABI from "../../contracts/BettingGame.json";
// import deployedContracts from "../../list/deployedContracts.json";
// import database from "../../list/database.json";

export default function BurnToken(props) {
  const {
    sides,
    // bettingGameAddress,
    handleInputNumberChange,
    // handleBettingGameAddress,
    handleNext,
    isCreator,
  } = props;
  // const { chainId } = useMoralisDapp();
  // const { Moralis } = useMoralis();
  // const { abi: erc20BasicABI } = ERC20BasicABI;
  // const { abi: bettingGameRegistryABI } = BettingGameRegistryABI;
  // const { abi: bettingGameABI } = BettingGameABI;
  const [isApproved] = useState(false);
  const [isBurnt] = useState(false);
  // const [transactionHash, setTransactionHash] = useState();

  /**
   * [useMoralisQuery]
   * @description Fetch `BettingGameCreated` event data from DB using `transaction_hash`
   */

  /**
   * [useWeb3Contract]
   * @description Approve ERC20 token before burning it
   *
   * @function approve
   * @contractAddress ERC20Basic
   * @param spender - If `isCreator` is true, then the `BettingGameRegistry`, otherwise `bettingGameAddress`
   * @param amount - The amount of BET needs to be approved for burning (0.01 * sides in wei)
   */

  /**
   * [useWeb3Contract]
   * @description Create a new Betting Game as a Creator
   *
   * @function createGame
   * @contractAddress BettingGameRegistry smart contract address
   * @param _sides - The number of sides (imagine a dice)
   */

  /**
   * [useWeb3Contract]
   * @description Register Address as Challenger for the Game
   *
   * @function challenge
   * @contractAddress `bettingGameAddress`
   */

  const disableButton = useMemo(() => false, []);

  // useEffect(() => {
  //   if (
  //     bettingGameData &&
  //     bettingGameData?.length === 1 &&
  //     bettingGameAddress === "" &&
  //     isBurnt &&
  //     isCreator
  //   ) {
  //     const { attributes } = bettingGameData[0];
  //     const { bettingGameAddress: res } = attributes;
  //     handleBettingGameAddress(res);
  //     handleNext();
  //   }
  //   // eslint-disable-next-line
  // }, [bettingGameData, bettingGameAddress, isBurnt]);

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
              // Run Create Game
            } else {
              // Run Challenge
            }
          } else {
            // Run Approve
          }
        }}
        style={{ width: "100%" }}
      >
        {isApproved ? "Burn" : "Approve"}
      </Button>
    </Space>
  );
}
