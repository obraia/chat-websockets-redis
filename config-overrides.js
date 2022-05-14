const path = require("path");

module.exports = {
  paths: function(paths, env) {
    paths.appIndexJs = path.resolve(__dirname, "./views/src/index.js");
    paths.appSrc = path.resolve(__dirname, "./views/src");
    paths.appPublic = path.resolve(__dirname, "./views/public");
    paths.appHtml = path.resolve(__dirname, "./views/public/index.html");
    return paths;
  },
};
