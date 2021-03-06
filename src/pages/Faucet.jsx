import React, { useState } from "react";
import { Typography, InputNumber, Space, Button } from "antd";
import { useMoralis } from "react-moralis";
import { useWeb3Contract } from "hooks/useWeb3Contract";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import ERC20BasicABI from "../contracts/ERC20Basic.json";
import deployedContracts from "../list/deployedContracts.json";

export default function Faucet() {
  const [betValue, setBetValue] = useState(0);
  const { abi } = ERC20BasicABI;
  const { Moralis } = useMoralis();
  const { walletAddress, chainId } = useMoralisDapp();
  const { runContractFunction, isRunning, isLoading } = useWeb3Contract({
    abi,
    contractAddress: deployedContracts[chainId]?.erc20Basic,
    functionName: "mint",
    params: {
      to: walletAddress,
      amount: Moralis.Units.Token(betValue, 18),
    },
  });

  /**
   *
   * @param {number} value - Value inputted in the `InputNumber`
   */
  const onChange = (value) => {
    setBetValue(value);
  };

  return (
    <div>
      <Typography.Title level={1}>Request Testnet BET</Typography.Title>
      <div style={{ width: "60%", fontSize: "18px" }}>
        <Typography.Text>
          Get up to <b>100 testnet BET</b> for your account on one of the
          supported blockchain testnets so you can use our betting protocol and
          place a bet. Note that you need some native token to mint new testnet
          BET.
        </Typography.Text>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "2rem" }}
      >
        <Space
          size="large"
          style={{ display: "flex", alignItems: "center", fontSize: "20px" }}
        >
          <InputNumber
            size="large"
            bordered
            value={betValue}
            onChange={onChange}
            max={100}
            style={{ width: "20vw" }}
          />
          <Typography.Text>BET</Typography.Text>
        </Space>
        <Button
          type="primary"
          size="large"
          style={{ width: "25vw", marginTop: "2rem" }}
          onClick={() => runContractFunction()}
          disabled={isRunning || isLoading || betValue <= 0}
        >
          Request Testnet BET
        </Button>
      </div>
    </div>
  );
}
