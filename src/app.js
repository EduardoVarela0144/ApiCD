require('dotenv').config()
const app = require("./server");
const port = app.get("port");
app.listen(port, () => {
  console.log(`Welcome to Bab api listening on port ${port}`);
});
