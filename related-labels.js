var relatedLabels = {
  iOS: /iOS|iPhone/i,
  Android: /Android/i,
  Server: /Server|Web|サーバー|ウェブ/i,
  Bug: /Bug|不具合|バグ|問題|クラッシュ/i
};

var obtainRelatedLabels = function(text) {
  var labels = [];
  for (label in relatedLabels) {
    if (text.match(relatedLabels[label])) {
      labels.push(label);
    }
  }
  return labels;
};

module.exports = obtainRelatedLabels;
