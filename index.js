import app from "./server.js";

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

//export default server;