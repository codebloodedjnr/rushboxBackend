const config = require("../../../utils/config");
const priceestimatepayload = require("../payload/priceestimatepayload");

const apis = (req) => {
  return [
    {
      url: "https://commerce.errandlr.com/v2/estimate",
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${config.ERRANDLR_APIKEY}`,
        "Content-Type": "application/json",
      },
      body: priceestimatepayload.errandlr(req.order),
      name: "Errandlr",
    },
  ];
};

module.exports = { apis };
