// JSON Server module
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
// Add this before server.use(router)
server.use(
  // Add custom route here if needed
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/api/question_d/:id": "/question_d/:id",
  })
);
server.use((req, res, next) => {
  if (req.originalUrl.startsWith("/question_d/")) {
    const id = parseInt(req.originalUrl.split("/").pop(), 10);

    const question_detail = router.db
      .get("questions")
      ?.__wrapped__?.question_detail.find((ele) => ele.id == id);

    const questions = router.db
      .get("questions")
      ?.__wrapped__?.questions.find((ele) => ele.id == id);

    if (question_detail && questions) {
      // Merge question_d with question
      const mergedQuestion = { ...questions, ...question_detail };
      res.jsonp(mergedQuestion);
    } else {
      res.status(404).jsonp({ error: "Not found" });
    }
  } else {
    // Continue with the regular JSON Server behavior
    next();
  }
});
server.use(router);
server.listen(5000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
