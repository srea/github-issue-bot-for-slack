var rp = require("request-promise");
var fetchGithubContent = function () {
    var options = {
        method: 'GET',
        url: 'https://api.github.com/repos/' + process.env.GITHUB_REPO + '/contents/ISSUE_TEMPLATE/bug_template.md',
        qs: {
            ref: 'master'
        },
        headers: {
            'Cache-Control': 'no-cache',
            Accept: 'application/vnd.github.v3.raw',
            'User-Agent': 'brooklyn-issue-bot',
        },
        auth: {
            user: process.env.GITHUB_USER,
            password: process.env.GITHUB_ACCESS_TOKEN
        },
    };
    return request(options);
};
module.exports = fetchGithubContent;
