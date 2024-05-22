const ShoppingService = require("../services/shopping-service");
const UserAuth = require("./middlewares/auth");
const { SubscribeToMessages, PublishMessage } = require("../utils");
const { CUSTOMER_BINDING_KEY } = require("../config");

module.exports = (app, channel) => {
  const service = new ShoppingService();

  SubscribeToMessages(channel, service);

  // * Cart
  app.post("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { product_id, qty } = req.body;
    const { data } = await service.AddCartItem(_id, product_id, qty);
    res.status(200).json(data);
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;
    const { data } = await service.RemoveCartItem(_id, productId);
    res.status(200).json(data);
  });

  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const data = await service.GetCart(_id);
    return res.status(200).json(data);
  });

  // * Orders
  app.post("/order", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;
    const { data } = await service.PlaceOrder({ _id, txnNumber });
    const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");
    PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(payload));
    return res.status(200).json(data);
  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.GetOrders(_id);
    res.status(200).json(data);
  });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/shoping : I am Shopping Service" });
  });
};
