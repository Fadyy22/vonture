const authRoute = require('./authRoute');
const opportunityRoute = require('./opportunityRoute');
const placeRoute = require('./placeRoute');

const mountRoutes = (app) => {
  app.use('/auth', authRoute);
  app.use('/opportunities', opportunityRoute);
  app.use('/place', placeRoute);
};

module.exports = mountRoutes;
