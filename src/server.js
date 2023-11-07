const Seeders = require("../seeders/Seeders");
var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const routesConfig = require("../src/router");
const { Server } = require("socket.io");

const Game = require("../src/api/game/Game");

const ROLES = require("../src/const/const");

var app = express();


// const io = new Server({
//   cors: {
//      origin: process.env.APP_WEB,
//   },
  
// });

// io.listen(process.env.SOCKET_PORT || 4000);


app.use(cors());

require("./database/datbase");
app.set("port", process.env.PORT || 3000);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

routesConfig(app);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
});

// Seeders.addRoles();

let currentQuestionIndex = 0;
let timer;
let totalTimeRemaining = 0;
let totalTimeRemainingTOTAL = 0;
let questions = [];
let playerResponses = {};
let correctAnswersCount = 0;
let waitingRoomPlayers = {};

// io.on("connection", (socket) => {
//   socket.on("startGame", async (gameId) => {
//     try {
//       const game = await Game.findById(gameId).populate("questions");

//       if (!game) {
//         throw new Error("No se encontró el juego");
//       }

//       const { questions: gameQuestions } = game;
//       questions = gameQuestions[0].questions;
//       const totalQuestions = questions.length;

//       totalTimeRemaining = 60;
//       totalTimeRemainingTOTAL = totalQuestions * 60;
//       const gameQuestion = questions[currentQuestionIndex];
//       const { question, hint, options } = gameQuestion;
//       const formattedOptions = options.map((option) => ({
//         option: option.option,
//         answer: option.answer,
//       }));

//       socket.join(gameId);

//       io.emit("gameStarted", {
//         question: {
//           question,
//           hint,
//           options: formattedOptions,
//         },
//         totalTime: totalTimeRemainingTOTAL,
//         gameId: gameId,
//         total: questions.length,
//         index: currentQuestionIndex,
//       });

//       startTimer();
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   socket.on("answerQuestion", ({ answer, user, pinGame }) => {
//     const correctAnswer = questions[currentQuestionIndex].options.find(
//       (option) => option.answer === true
//     ).option;

//     const isCorrect = answer === correctAnswer;

//     if (isCorrect) {
//       correctAnswersCount++;
//     }

//     const playerId = user._id;
//     playerResponses[playerId] = {
//       user,
//       pinGame,
//       correctAnswersCount,
//       total: questions.length,
//     };

//     socket.emit("answerResult", { isCorrect });
//   });

//   socket.on("disconnect", () => {});

//   socket.on("gameFinished", () => {
//     console.log("bye");

//     io.emit("gameSummary", {
//       playerResponses,
//       correctAnswersCount,
//     });

//     playerResponses = {};
//     correctAnswersCount = 0;
//   });

//   socket.on(
//     "joinWaitingRoom",
//     async ({ userId, name, lastName, img, pinGame, rol }) => {
//       const game = await Game.findById(pinGame).populate("questions");
//       console.log('Ingreso un usaurio', userId);

//       if (
//         !waitingRoomPlayers[game.owner.toString()] &&
//         rol.name !== ROLES.Leader
//       ) {
//         io.emit("getOut", { userId: userId });
//       }

//       if (!waitingRoomPlayers[userId]) {
//         if (rol.name === ROLES.Leader) {
//           waitingRoomPlayers[userId] = {
//             socketId: socket.id,
//             name,
//             lastName,
//             img,
//             pinGame,
//           };
//         } else {
//           if (waitingRoomPlayers[game.owner.toString()]) {
//             waitingRoomPlayers[userId] = {
//               socketId: socket.id,
//               name,
//               lastName,
//               img,
//               pinGame,
//             };
//           }
//         }
//       }

//       io.emit("waitingRoomPlayerList", Object.values(waitingRoomPlayers));
//     }
//   );

//   socket.on("leaveWaitingRoom", ({ userId }) => {
//     if (waitingRoomPlayers[userId]) {
//       delete waitingRoomPlayers[userId];
//     }

//     console.log("me sali");
//     console.log(waitingRoomPlayers);
//     io.emit("waitingRoomPlayerList", Object.values(waitingRoomPlayers));
//   });
// });

// function startTimer() {
//   if (currentQuestionIndex < questions.length) {
//     io.emit("timeRemaining", { timeRemaining: totalTimeRemaining });

//     timer = setInterval(() => {
//       totalTimeRemaining--;
//       io.emit("timeRemaining", { timeRemaining: totalTimeRemaining });

//       if (totalTimeRemaining <= 0) {
//         clearInterval(timer);
//         currentQuestionIndex++;

//         if (currentQuestionIndex < questions.length) {
//           const gameQuestion = questions[currentQuestionIndex];
//           const { question, hint, options } = gameQuestion;
//           const formattedOptions = options.map((option) => ({
//             option: option.option,
//             answer: option.answer,
//           }));

//           io.emit("nextQuestion", {
//             question: {
//               question,
//               hint,
//               options: formattedOptions,
//             },
//             timeRemaining: totalTimeRemaining,
//             total: questions.length,
//             index: currentQuestionIndex,
//           });
//           totalTimeRemaining = 60;
//           startTimer();
//         } else {
//           io.emit("gameFinished");
//           io.emit("gameSummary", {
//             playerResponses,
//             correctAnswersCount,
//           });
//         }
//       }
//     }, 1000);
//   }
// }

module.exports = app;
