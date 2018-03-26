const Botkit = require("botkit");
const createGithubIssue = require("./github-issues");
const obtainRelatedLabels = require("./related-labels");

if (!process.env.SLACK_BOT_TOKEN) {
  console.log("Error: Specify token in environment");
  process.exit(1);
}

var obtainTemplate = function(labels) {
  if (labels.indexOf("バグ") != -1) {
    return "# 説明\n\n# 再現手順\n\n# スクリーンショット\n\n## プラットフォーム\n\n- [ ] iOS\n- [ ] Android\n- [ ] Server\n\n## 環境\n\n- [ ] Production\n- [ ] Staging\n- [ ] Development\n\n## その他\n\n- App Version: v\n\n(* 個人情報は載せないようにご注意下さい)";
  }
  return ""
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

controller.hears(new RegExp("^issue(.*)", "i"), ["ambient"], function(
  bot,
  message
) {
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
  var splitText = message.text.split(/\r\n|\r|\n/);
  var title = splitText[1];
  splitText.shift();
  splitText.shift();
  var body = splitText.join("\n");
  var labels = obtainRelatedLabels(title + body);
  createGithubIssue(title, body, labels)
    .then(function(response) {
      bot.reply(message, "作成しました\n" + response.html_url);
    })
    .catch(function(error) {
      convo.say("error");
    });
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
    var body = "slack @" + from + " より\n\n" + obtainTemplate(labels);
    createGithubIssue(title, body, labels)
      .then(function(response) {
        bot.reply(message, "詳細を記入してください :bow: \n" + response.html_url);
      })
      .catch(function(error) {
        bot.reply(message, "error :cry:");
      });
  });
});
