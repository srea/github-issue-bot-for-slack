const Botkit = require('botkit');
const Request = require('request');

if (!process.env.SLACK_BOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

const controller = Botkit.slackbot({
    debug: false
});

controller.spawn({
    token: process.env.SLACK_BOT_TOKEN
}).startRTM(function (err) {
    if (err) {
        throw new Error(err);
    }
});

controller.hears('a(.*)', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    var bot = bot;
    var askFlavor = function (err, convo) {
        convo.ask('タイトルをお願いします。', function (response, convo) {
            askSize(response, convo);
            convo.next();
        });
    };
    var askSize = function (response, convo) {

        var title = response.text;

        convo.ask('詳細な説明をお願いします。', function (response, convo) {

            var body = response.text;

            // from BOT Label
            // add ios label when if ios keyword in message, 
            //ヘッダーを定義
            var headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'Bot'
            }

            var json = {
                "title": title,
                "body": body
            }

            //オプションを定義
            var options = {
                url: 'https://api.github.com/repos/srea/github-issue-bot-for-slack/issues',
                method: 'POST',
                headers: headers,
                auth: {
                    user: process.env.GITHUB_USER,
                    password: process.env.GITHUB_ACCESS_TOKEN,
                },
                json: json
            }

            //リクエスト送信
            Request(options, function (error, response, body) {
                console.log(response.html_url);
            });
            convo.say("");
            convo.next();
        });
    };
    bot.startConversation(message, askFlavor);
    console.log(message.user);
});

