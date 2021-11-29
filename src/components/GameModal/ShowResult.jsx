import React from "react";
import { Space, Typography, Button } from "antd";

export default function ShowResult(props) {
  const { isCreator, handleClose } = props;

  return (
    <Space direction="vertical">
      <Typography.Text>
        {isCreator
          ? "Now wait for a Challenger to bet against you!"
          : "Now wait for the random result to come!"}
      </Typography.Text>
      <Button type="primary" style={{ width: "100%" }} onClick={handleClose}>
        Close
      </Button>
    </Space>
  );
}
