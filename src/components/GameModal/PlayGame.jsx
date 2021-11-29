import React, { useMemo } from "react";
import { Space, Typography, Button } from "antd";
import { useWeb3Contract } from "hooks/useWeb3Contract";
import BettingGameABI from "contracts/BettingGame.json";

export default function PlayGame(props) {
  const { handleNext, isCreator, bettingGameAddress } = props;
  const { abi: bettingGameABI } = BettingGameABI;

  /**
   * @description Play the betting game
   */
  const {
    runContractFunction: runPlayGame,
    isLoading: isPlayingLoading,
    isRunning: isPlayingRunning,
  } = useWeb3Contract({
    abi: bettingGameABI,
    contractAddress: bettingGameAddress,
    functionName: "play",
    params: {},
  });

  const disableButton = useMemo(
    () => isPlayingLoading || isPlayingRunning,
    [isPlayingLoading, isPlayingRunning]
  );

  return (
    <Space direction="vertical" align="center" size="middle">
      <Typography.Text>
        If the sum of your bet result and your challenger's is{" "}
        <b>{isCreator ? "EVEN" : "ODD"}</b>, you WIN!
      </Typography.Text>
      <Typography.Text>Otherwise, you LOSE</Typography.Text>
      <Button
        type="primary"
        disabled={disableButton}
        loading={disableButton}
        style={{ width: "100%" }}
        onClick={() => {
          runPlayGame({ onSuccess: () => handleNext() });
        }}
      >
        Bet now!
      </Button>
    </Space>
  );
}
