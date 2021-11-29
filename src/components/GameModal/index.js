import React, { useEffect, useState } from "react";
import { Modal, Steps } from "antd";
import BurnToken from "./BurnToken";
import DepositAsset from "./DepositAsset";
import PlayGame from "./PlayGame";
import ShowResult from "./ShowResult";

export default function GameModal(props) {
  const { visible, handleClose, isCreator, initialValues } = props;
  const {
    sides: initialSides,
    depositTokenAddress: initialDepositAsset,
    bettingGameAddress: initialBettingGameAddress,
  } = initialValues || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sides, setSides] = useState(1);
  const [bettingGameAddress, setBettingGameAddress] = useState("");

  useEffect(() => {
    if (initialSides) {
      setSides(initialSides);
    }
    // eslint-disable-next-line
  }, [initialSides]);

  useEffect(() => {
    if (initialBettingGameAddress) {
      setBettingGameAddress(initialBettingGameAddress);
    }
    // eslint-disable-next-line
  }, [bettingGameAddress]);

  return (
    <Modal
      title="Create New Game"
      centered
      visible={visible}
      closable={false}
      width={1000}
      footer={null}
    >
      <Steps current={currentIndex}>
        <Steps.Step
          title="Burn BET"
          description={`Burn your token to ${
            isCreator ? "create a game." : "challenge the game."
          }`}
        />
        <Steps.Step
          title="Deposit ERC20"
          description={
            isCreator
              ? "Select your asset to place a bet on."
              : "Deposit you asset before placing a bet."
          }
        />
        <Steps.Step
          title="Try your luck!"
          description="It's all up to the blockchain now!"
        />
      </Steps>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "3rem",
        }}
      >
        {currentIndex === 0 && (
          <BurnToken
            sides={sides}
            isCreator={isCreator}
            handleInputNumberChange={(value) => setSides(value)}
            handleBettingGameAddress={(res) => setBettingGameAddress(res ?? "")}
            bettingGameAddress={initialBettingGameAddress ?? bettingGameAddress}
            handleNext={() => setCurrentIndex((i) => i + 1)}
          />
        )}
        {currentIndex === 1 && (
          <DepositAsset
            initialDepositAsset={initialDepositAsset}
            sides={sides}
            isCreator={isCreator}
            handleNext={() => setCurrentIndex((i) => i + 1)}
            bettingGameAddress={initialBettingGameAddress ?? bettingGameAddress}
          />
        )}
        {currentIndex === 2 && (
          <PlayGame
            isCreator={isCreator}
            handleNext={() => setCurrentIndex((i) => i + 1)}
            bettingGameAddress={initialBettingGameAddress ?? bettingGameAddress}
          />
        )}
        {currentIndex === 3 && (
          <ShowResult
            isCreator={isCreator}
            handleClose={handleClose}
            bettingGameAddress={bettingGameAddress}
          />
        )}
      </div>
    </Modal>
  );
}
