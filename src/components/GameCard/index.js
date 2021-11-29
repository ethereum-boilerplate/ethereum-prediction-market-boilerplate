import React, { useMemo, useEffect } from "react";
import { Card, Typography, Button, Space, Skeleton } from "antd";
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";
import moment from "moment";
import { getEllipsisTxt } from "helpers/formatters";
import { useWeb3Contract } from "hooks/useWeb3Contract";
import BettingGameABI from "contracts/BettingGame.json";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { networkConfigs } from "helpers/networks";
import isZeroAddress from "helpers/validators";

export default function CardIndex(props) {
  const { cardTitle, handleChallenge } = props;
  const { isInitialized, isAuthenticated } = useMoralis();
  const { walletAddress, chainId } = useMoralisDapp();
  const Web3Api = useMoralisWeb3Api();
  const { abi } = BettingGameABI;

  const {
    fetch: runGetTokenMetadata,
    data: getTokenMetadata,
    isLoading: isGettingTokenMetadataLoading,
    isFetching: isGettingTokenMetadataFetching,
  } = useMoralisWeb3ApiCall(Web3Api.token.getTokenMetadata);

  /**
   * @description Get Betting Game Info Details to be displayed
   */
  const {
    runContractFunction: runGetBettingGameInfo,
    contractResponse,
    isLoading: isGetBettingGameLoading,
    isRunning: isGetBettingGameRunning,
  } = useWeb3Contract({
    abi,
    functionName: "getBettingGameInfo",
    contractAddress: cardTitle,
    params: {},
  });

  /**
   * @description Withdraw ERC20 tokens (reward) from the BettingGame for winners only
   */
  const {
    runContractFunction: runWithdraw,
    isLoading: isWithdrawLoading,
    isRunning: isWithdrawRunning,
  } = useWeb3Contract({
    abi,
    functionName: "withdraw",
    contractAddress: cardTitle,
    params: {},
  });

  const isFetching = useMemo(
    () =>
      isGetBettingGameLoading ||
      isGetBettingGameRunning ||
      isGettingTokenMetadataFetching ||
      isGettingTokenMetadataLoading,
    [
      isGetBettingGameLoading,
      isGetBettingGameRunning,
      isGettingTokenMetadataLoading,
      isGettingTokenMetadataFetching,
    ]
  );

  const isContractResponseValid = useMemo(
    () => contractResponse && Object.keys(contractResponse).length === 10,
    [contractResponse]
  );

  const isCreator = useMemo(
    () =>
      isContractResponseValid &&
      contractResponse[0].toLowerCase() === walletAddress,
    [isContractResponseValid, contractResponse, walletAddress]
  );

  const isChallenger = useMemo(
    () =>
      isContractResponseValid &&
      contractResponse[1].toLowerCase() === walletAddress,
    [isContractResponseValid, contractResponse, walletAddress]
  );

  const isWinner = useMemo(
    () =>
      isContractResponseValid &&
      contractResponse[6].toLowerCase() === walletAddress,
    [isContractResponseValid, contractResponse, walletAddress]
  );

  const isWithdrawn = useMemo(
    () => isContractResponseValid && contractResponse[7],
    [isContractResponseValid, contractResponse]
  );

  const isExpired = useMemo(
    () =>
      isContractResponseValid &&
      moment().isAfter(moment.unix(parseInt(contractResponse[4]))),
    [isContractResponseValid, contractResponse]
  );

  useEffect(() => {
    if (cardTitle && isInitialized) {
      runGetBettingGameInfo();
    }
    // eslint-disable-next-line
  }, [cardTitle, isInitialized, isAuthenticated]);

  useEffect(() => {
    if (isContractResponseValid && !isZeroAddress(contractResponse[5])) {
      runGetTokenMetadata({
        params: { chain: chainId, addresses: contractResponse[5] },
      });
    }
    // eslint-disable-next-line
  }, [isContractResponseValid, contractResponse]);

  return (
    <Card
      title={getEllipsisTxt(cardTitle, 15)}
      bordered
      hoverable
      style={{ marginBottom: "2rem" }}
    >
      <Skeleton loading={isFetching}>
        {isContractResponseValid && isAuthenticated ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "2rem",
                fontSize: "16px",
              }}
            >
              <Typography.Text type="secondary" style={{ fontSize: "16px" }}>
                Creator
              </Typography.Text>
              <Typography.Text>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`${networkConfigs[chainId].blockExplorerUrl}address/${contractResponse[0]}`}
                >
                  {isCreator ? "You" : getEllipsisTxt(contractResponse[0])}
                </a>
              </Typography.Text>

              <Typography.Text
                type="secondary"
                style={{ fontSize: "16px", marginTop: "1rem" }}
              >
                Challenger:
              </Typography.Text>
              <Typography.Text>
                {!isZeroAddress(contractResponse[1]) ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${networkConfigs[chainId].blockExplorerUrl}address/${contractResponse[1]}`}
                  >
                    {isChallenger ? "You" : getEllipsisTxt(contractResponse[1])}
                  </a>
                ) : (
                  "-"
                )}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: "16px", marginTop: "1rem" }}
              >
                Sides
              </Typography.Text>
              <Typography.Text>{contractResponse[2]}</Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: "16px", marginTop: "1rem" }}
              >
                Status
              </Typography.Text>
              <Typography.Text>
                {contractResponse[3] === "0" ? "OPEN" : "CLOSED"}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: "16px", marginTop: "1rem" }}
              >
                Expiry Time
              </Typography.Text>
              <Typography.Text>
                {moment
                  .unix(parseInt(contractResponse[4]))
                  .format("MMM DD, YYYY HH:mm")}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: "16px", marginTop: "1rem" }}
              >
                Deposit Asset
              </Typography.Text>
              <Typography.Text>
                {!isZeroAddress(contractResponse[5]) &&
                getTokenMetadata &&
                getTokenMetadata?.length === 1 ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${networkConfigs[chainId].blockExplorerUrl}address/${contractResponse[5]}`}
                  >
                    {getTokenMetadata[0]?.symbol} ({getTokenMetadata[0]?.name})
                  </a>
                ) : (
                  "-"
                )}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: "16px", marginTop: "1rem" }}
              >
                Winner
              </Typography.Text>
              <Typography.Text>
                {!isZeroAddress(contractResponse[6]) ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${networkConfigs[chainId].blockExplorerUrl}address/${contractResponse[6]}`}
                  >
                    {isWinner ? "You" : getEllipsisTxt(contractResponse[6])}
                  </a>
                ) : (
                  "-"
                )}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: "16px", marginTop: "1rem" }}
              >
                Creator Roles
              </Typography.Text>
              <Typography.Text>
                {contractResponse[8] !== "0" ? contractResponse[8] : "-"}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: "16px", marginTop: "1rem" }}
              >
                Challenger Roles
              </Typography.Text>
              <Typography.Text>
                {contractResponse[9] !== "0" ? contractResponse[9] : "-"}
              </Typography.Text>
            </div>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                size="large"
                type="default"
                style={{ width: "100%" }}
                onClick={() =>
                  window.open(
                    `${networkConfigs[chainId].blockExplorerUrl}address/${cardTitle}`
                  )
                }
              >
                View Details
              </Button>
              {contractResponse[3] === "0" ? (
                <Button
                  size="large"
                  disabled={isCreator || isExpired}
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={() =>
                    handleChallenge({
                      sides: contractResponse[2],
                      status: contractResponse[3],
                      expiryTime: contractResponse[4],
                      depositTokenAddress: contractResponse[5],
                      bettingGameAddress: cardTitle,
                    })
                  }
                >
                  {isExpired
                    ? "EXPIRED"
                    : isCreator
                    ? "WAIT FOR CHALLENGER"
                    : "BET"}
                </Button>
              ) : (
                <Button
                  size="large"
                  disabled={
                    !isWinner ||
                    isWithdrawn ||
                    isWithdrawRunning ||
                    isWithdrawLoading
                  }
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={() => runWithdraw()}
                >
                  {isWinner
                    ? isWithdrawn
                      ? "WITHDRAWN"
                      : "WITHDRAW"
                    : "YOU LOSE"}
                </Button>
              )}
            </Space>
          </>
        ) : (
          <Button
            size="large"
            type="default"
            style={{ width: "100%" }}
            onClick={() =>
              window.open(
                `${networkConfigs[chainId].blockExplorerUrl}address/${cardTitle}`
              )
            }
          >
            View Details
          </Button>
        )}
      </Skeleton>
    </Card>
  );
}
