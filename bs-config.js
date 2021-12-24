module.exports = {
  files: ["./dist/*.html", "./dist/**/*.css", "dist/**/*.js"],
  server: {
    baseDir: "./dist/",
  },
  startPath: "index.html",
  port: 3000,
  serveStatic: [],
};
