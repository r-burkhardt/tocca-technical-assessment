
const userProfileRoutes = require('./user_profile_routes');

module.exports = function (app, db) {
    userProfileRoutes(app, db);
};