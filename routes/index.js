const authRouter = require('./authRoute');
const opportunityRouter = require('./opportunityRoute');
const placeRouter = require('./placeRoute');

const mountRoutes = (app) => {
  app.use('/auth', authRouter);
  app.use('/opportunities', opportunityRouter);
  app.use('/places', placeRouter);
};

module.exports = mountRoutes;
