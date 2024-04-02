const CustomerService = require("../services/customer-service");

module.exports = (app) => {
  const service = new CustomerService();
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;

    service.SubscribeEvents(payload);

    res.json(payload);
  });
};
