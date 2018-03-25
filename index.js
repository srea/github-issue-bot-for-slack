const Botkit = require("botkit");
const Request = require("request");
var rp = require("request-promise");

var createIssue = function(title, body, labels) {
  var options = {
    uri: "https://api.github.com/repos/srea/github-issue-bot-for-slack/issues",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Bot"
    },
    auth: {
      user: process.env.GITHUB_USER,
      password: process.env.GITHUB_ACCESS_TOKEN
    },
    body: {
      title: title,
      body: body,
      labels: labels
    },
    json: true
  };

  return rp(options);
};

const LabelPattern = {
  iOS: /iOS|iPhone/i,
  Android: /Android/i,
  Server: /Server|Web|サーバー|ウェブ/i,
  Bug: /Bug|不具合|バグ|問題|クラッシュ/i
};

var obtainRelatedLabels = function(text) {
  var labels = [];
  for (label in LabelPattern) {
    if (text.match(LabelPattern[label])) {
      console.log(LabelPattern[label]);
      labels.push(label);
    }
  }
  return labels;
};

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
      createIssue(title, body, labels)
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
