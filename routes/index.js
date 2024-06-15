const applicationRouter = require('./applicationRoute');
const authRouter = require('./authRoute');
const offerRouter = require('./offerRoute');
const opportunityRouter = require('./opportunityRoute');
const placeRouter = require('./placeRoute');
const requirementRouter = require('./requirementRoute');
const subscriptionRouter = require('./subscriptionRoute');
const userRouter = require('./userRoute');

const mountRoutes = (app) => {
  app.use('/applications', applicationRouter);
  app.use('/auth', authRouter);
  app.use('/offers', offerRouter);
  app.use('/opportunities', opportunityRouter);
  app.use('/places', placeRouter);
  app.use('/requirements', requirementRouter);
  app.use('/subscribe', subscriptionRouter);
  app.use('/users', userRouter);
};

module.exports = mountRoutes;
