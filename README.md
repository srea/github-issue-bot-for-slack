![LICENSE](https://img.shields.io/github/license/srea/github-issue-bot-for-slack.svg)

# github-issue-bot-for-slack
You can create new issue by interactive conversation with bot from slack.

```
$ git clone git@github.com:srea/github-issue-bot-for-slack.git
$ cd github-issue-bot-for-slack
$ npm install
$ SLACK_BOT_TOKEN=xxx GITHUB_USER=xxx GITHUB_REPO=xxx/xxx GITHUB_ACCESS_TOKEN=xxx node index.js
```

use forever

```
$ npm install -g forever
$ SLACK_BOT_TOKEN=xxx GITHUB_USER=xxx GITHUB_REPO=xxx/xxx GITHUB_ACCESS_TOKEN=xxx forever start index.js
```

# screenshot