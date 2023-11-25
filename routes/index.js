const pageRouter = require('./page.r')

function route(app) {
    app.use('/', pageRouter);
}

module.exports = route