const Botkit = require("botkit");
const createGithubIssue = require("./github-issues");
const obtainRelatedLabels = require("./related-labels");

if (!process.env.SLACK_BOT_TOKEN) {
  console.log("Error: Specify token in environment");
  process.exit(1);
}

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
  var askTitle = function(err, convo) {
    convo.ask("タイトルを記入してください", function(response, convo) {
      askDescription(response, convo);
      convo.next();
    });
  };
  var askDescription = function(response, convo) {
    var title = response.text;

    convo.ask("コメントを記入してください", function(response, convo) {
      var body = response.text;
      var labels = obtainRelatedLabels(title + body);
      createGithubIssue(title, body, labels)
        .then(function(response) {
          convo.say("作成しました\n" + response.html_url);
          convo.next();
        })
        .catch(function(error) {
          convo.say("error");
          convo.next();
        });
    });
  };
  bot.startConversation(message, askTitle);
  console.log(message.user);
});
