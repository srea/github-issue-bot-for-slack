const Botkit = require("botkit");
const createGithubIssue = require("./github-issues");
const fetchGithubContent= require("./github-content");
const obtainRelatedLabels = require("./related-labels");

if (!process.env.SLACK_BOT_TOKEN) {
  console.log("Error: Specify token in environment");
  process.exit(1);
}

var obtainTemplate = function(from) {
         
	return "# 起票者\n\n@" + from + " (slack)\n\n";
};

const controller = Botkit.slackbot({
  debug: false
});

controller
  .spawn({
    token: process.env.SLACK_BOT_TOKEN
  })
  .startRTM(function(err) {
    if (err) {
      throw new Error(err);
    }
  });

controller.hears("(.*)", ["direct_mention", "mention"], function(bot, message) {
  var from;

  bot.api.reactions.add(
    {
      timestamp: message.ts,
      channel: message.channel,
      name: "eyes"
    },
    function(error, _) {
      if (error) {
        bot.botkit.log("Failed to add emoji reaction:", error);
      }
    }
  );

  bot.api.users.info({ user: message.user }, function(err, info) {
    from = info.user.name;
    var title = message.text;
    var labels = obtainRelatedLabels(title);
    var body = obtainTemplate(from);
    fetchGithubContent()
    createGithubIssue(title, body, labels)
      .then(function(response) {
        bot.reply(message, "<@"+message.user+"> :writing_hand: " + response.html_url);
      })
      .catch(function(error) {
        bot.reply(message, "error :cry:");
      });
  });
});
