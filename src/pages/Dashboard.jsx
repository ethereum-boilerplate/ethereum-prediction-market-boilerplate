import React, { useState, useMemo } from "react";
import { Typography, Row, Col, Space } from "antd";
// import { useMoralis, useMoralisQuery } from "react-moralis";
import GameCard from "components/GameCard";
import GameModal from "components/GameModal";
// import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
// import database from "list/database.json";

const styles = {
  wrapper: {
    width: "100%",
  },
  title: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
};

export default function Dashboard() {
  const [visible, setVisible] = useState(false);
  const [initialModalValues, setInitialModalValues] = useState({});
  // const { isInitalized } = useMoralis();
  // const { walletAddress, chainId } = useMoralisDapp();

  /**
   * [useMoralisQuery]
   * @description Fetch Betting Game Data from `BettingGameCreated`s Table
   * that the `creator` !== `walletAddress`
   */

  /**
   * @description Formatting Betting Game data for UI rendering
   */
  const bettingGameData = useMemo(() => [], []);

  return (
    <>
      <GameModal
        visible={visible}
        handleClose={() => setVisible(false)}
        initialValues={initialModalValues}
      />
      <div style={styles.wrapper}>
        <div style={styles.title}>
          <Typography.Title level={1}>
            Place d'BET. Win d'Game.
          </Typography.Title>
          <Typography.Text style={{ fontSize: "20px" }}>
            Try your luck fairly in a fairer and more trustless manner.
          </Typography.Text>
        </div>
        <Row gutter={16} style={{ marginTop: "2rem" }}>
          {bettingGameData && bettingGameData.length > 0 ? (
            bettingGameData.map((address, key) => {
              return (
                <Col span={8} key={key}>
                  <GameCard
                    cardTitle={address}
                    handleChallenge={(data) => {
                      setInitialModalValues(data);
                      setVisible(true);
                    }}
                  />
                </Col>
              );
            })
          ) : (
            <Space style={{ ...styles.title, fontSize: "18px" }}>
              <Typography.Text>No Challenge Game Found.</Typography.Text>
            </Space>
          )}
        </Row>
      </div>
    </>
  );
}
