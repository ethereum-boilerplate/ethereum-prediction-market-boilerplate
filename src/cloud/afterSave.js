[
  {
    db: "BettingGameCreatedKovan",
    network: "Kovan",
    url: "https://api.defender.openzeppelin.com/autotasks/68e20b58-a683-4fbd-951d-f23d7540feae/runs/webhook/0fbbed21-c3f0-4410-ada7-3a12cf7526d2/3MTT8CzdFgtbfoxPVLEqYr",
  },
  {
    db: "BettingGameCreatedBSCTestnet",
    network: "BSC Testnet",
    url: "https://api.defender.openzeppelin.com/autotasks/356cb682-3402-4648-925c-279168befe12/runs/webhook/0fbbed21-c3f0-4410-ada7-3a12cf7526d2/NexXACFmQPT7j7G2JSMQa2",
  },
  {
    db: "BettingGameCreatedPolygonMumbai",
    network: "Polygon Mumbai",
    url: "https://api.defender.openzeppelin.com/autotasks/d1b0e80e-981e-4ad9-8624-13a682896a7a/runs/webhook/0fbbed21-c3f0-4410-ada7-3a12cf7526d2/LadatW2zr98uu9NDAsdYBn",
  },
].forEach((chainInfo) => {
  const { db, network, url } = chainInfo || {};
  Moralis.Cloud.afterSave(db, async function (request) {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get("confirmed");
    if (confirmed) {
      const transferAddress = request.object.get("bettingGameAddress");
      Moralis.Cloud.httpRequest({
        method: "POST",
        url,
        body: { transferAddress },
        headers: {
          "Content-Type": "application/json",
        },
        followRedirects: true,
      }).then(
        function () {
          logger.info(
            "Successfully sent LINK to " + transferAddress + " - " + network
          );
        },
        function (httpResponse) {
          logger.error(
            "Request failed with response code " + httpResponse.status
          );
          logger.info(JSON.stringify(httpResponse));
        }
      );
    }
  });
});
