var rp = require("request-promise");
var createGithubIssue = function(title, body, labels) {
  var options = {
    uri: "https://api.github.com/repos/" + process.env.GITHUB_REPO + "/issues",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Bot"
    },
    auth: {
      user: process.env.GITHUB_USER,
      password: process.env.GITHUB_ACCESS_TOKEN
    },
    json: {
      title: title,
      body: body,
      labels: labels
    }
  };

  return rp(options);
};
module.exports = createGithubIssue;
