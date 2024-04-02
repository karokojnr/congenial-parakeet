const CustomerService = require("../services/customer-service");

module.exports = (app) => {
  const service = new CustomerService();
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;

    //handle subscribe events
    service.SubscribeEvents(payload);

    res.json(payload);
  });
};
