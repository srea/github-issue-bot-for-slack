var relatedLabels = {
  "バグ: iOS": 'iOS|iPhone',
  "バグ: Android": 'Android',
  "バグ: Server": 'Server|Web|サーバー|ウェブ|API'
};

var obtainRelatedLabels = function(text) {
  var labels = ["エスカレーション", "バグ"];
  for (label in relatedLabels) {
    if (text.match(new RegExp(relatedLabels[label], 'i'))) {
      labels.push(label);
    }
  }
  return labels;
};

module.exports = obtainRelatedLabels;
