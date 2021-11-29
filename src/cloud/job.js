Moralis.Cloud.job("SendLowFundsEmail", async (request) => {
  const faucetAddress = "0x0b0e45269187dfa9cf5a7899eed437f197c9a680";
  [
    { db: "EthTokenBalance", network: "Kovan" },
    { db: "BscTokenBalance", network: "BSC Testnet" },
    { db: "PolygonTokenBalance", network: "Polygon Mumbai" },
  ].forEach(async (chainInfo) => {
    const { db, network } = chainInfo || {};
    const query = new Moralis.Query(db);
    query.equalTo("address", faucetAddress);
    const results = await query.find();
    if (results.length === 1) {
      const balance = parseInt(results[0].get("balance"));
      if (balance < 20 * 1e18) {
        Moralis.Cloud.sendEmail({
          to: "<ADMIN EMAIL>",
          subject: "[Reminder] LINK Faucet Low - " + network,
          html: "Your LINK balance is too low!",
        });
      }
    }
  });
});
