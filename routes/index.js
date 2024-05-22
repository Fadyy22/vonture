const authRouter = require('./authRoute');
const opportunityRouter = require('./opportunityRoute');
const subscriptionRouter = require('./subscriptionRoute');
const placeRouter = require('./placeRoute');

const mountRoutes = (app) => {
  app.use('/auth', authRouter);
  app.use('/opportunities', opportunityRouter);
  app.use('/subscribe', subscriptionRouter);
  app.use('/places', placeRouter);
};

module.exports = mountRoutes;
