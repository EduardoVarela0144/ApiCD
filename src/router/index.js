const usersRouter = require("../api/user/user.routes");
const setRouter = require("../api/set/set.routes");
const rolRouter = require("../api/rol/rol.routes");
const gameRouter = require("../api/game/game.routes");
const dayGameNoteRouter = require("../api/dayGameNotes/dayGameNotes.routes");
const emailRouter = require("../api/email/email.routes");

const API_V1 = '/api/bab';

module.exports = (app) => {
    app.use(`${API_V1}/users`, usersRouter);
    app.use(`${API_V1}/set`, setRouter);
    app.use(`${API_V1}/rol`, rolRouter);
    app.use(`${API_V1}/game`, gameRouter);
    app.use(`${API_V1}/dayGameNote`, dayGameNoteRouter);
    app.use(`${API_V1}/`, emailRouter);
};
