const applicationRouter = require('./applicationRoute');
const authRouter = require('./authRoute');
const opportunityRouter = require('./opportunityRoute');
const placeRouter = require('./placeRoute');
const subscriptionRouter = require('./subscriptionRoute');
const userRouter = require('./userRoute');

const mountRoutes = (app) => {
  app.use('/applications', applicationRouter);
  app.use('/auth', authRouter);
  app.use('/opportunities', opportunityRouter);
  app.use('/places', placeRouter);
  app.use('/subscribe', subscriptionRouter);
  app.use('/users', userRouter);
};

module.exports = mountRoutes;
