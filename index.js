const Botkit = require("botkit");
const createGithubIssue = require("./github-issues");
const fetchGithubContent = require("./github-content");
const obtainRelatedLabels = require("./related-labels");

if (!process.env.SLACK_BOT_TOKEN) {
  console.log("Error: Specify token in environment");
  process.exit(1);
}

var generatePrefixText = function (user) {

  return "### 起票者\n\n![icon](" + user.profile.image_72 + ")" + user.real_name + "\n\n";
};

const controller = Botkit.slackbot({
  debug: false
});

controller
  .spawn({
    token: process.env.SLACK_BOT_TOKEN
  })
  .startRTM(function (err) {
    if (err) {
      throw new Error(err);
    }
  });

controller.hears("(.*)", ["direct_mention", "mention"], function (bot, message) {
  var from;

  bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: "eyes"
    },
    function (error, _) {
      if (error) {
        bot.botkit.log("Failed to add emoji reaction:", error);
      }
    }
  );

  bot.api.users.info({
    user: message.user
  }, function (err, info) {
    var title = message.text;
    var labels = obtainRelatedLabels(title);
    var prefixText = generatePrefixText(info.user);
    fetchGithubContent()
      .then(function (body) {
        body = prefixText + body;
        return createGithubIssue(title, body, labels);
      })
      .then(function (response) {
        bot.reply(message, "<@" + message.user + "> :writing_hand: " + response.html_url);
      })
      .catch(function (error) {
        bot.reply(message, "error :cry:");
      });
  });
});