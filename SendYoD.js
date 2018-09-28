// Title: SendYoD - "Yome of the Day"を日々メールする
// Description:
// 「俺の嫁が可愛い」様 https://oreno-yome.com/ から、ランダムに選んだ投稿をメールします。

var SendYoD = {
  APP_NAME: "sendYoD",
  
  MAX_NUMBER: 3100,
  BASE_URL: "https://oreno-yome.com/archives/",
  
  RETRY_MAX_CNT: 5,
  
  pageUrl: function (num) {
    return this.BASE_URL + num;
  },
  
  fetchDatas: function (num) {
    try {
      var pages = UrlFetchApp.fetch(this.pageUrl(num));
    } catch (e) {
      return null;
    }
    var contents = pages.getContentText();
    
    contents = contents.replace(/[\s\S]+<article .+?>([\s\S]+)<\/article>[\s\S]+/m, '$1');
    contents = contents.replace(/<div class='yuzo_related_post .+?'>[\s\S]+<\/div>/mg, '');
    
    return contents;
  },

  sendMail: function (num, contents) {
    var today = new Date().toLocaleDateString("en-US");
    
    var title = "Yome of the Day";
    var contents = "No." + num
    + "<p>" + contents+ "</p>"
    + "<p>" + this.pageUrl(num) + "</p>";
    
    MailApp.sendEmail({
      to: Consts.SendYoD_MAILTO,
      subject: title,
      htmlBody: contents
    });
  }
}

function sendYoD_main() {
  Logger.clear();
  Logger.log("--- " + SendYoD.APP_NAME + " start.");
  
  var retry_cnt = 0;
  while (true) {
    var num = parseInt(Math.random() * SendYoD.MAX_NUMBER);
    var contents = SendYoD.fetchDatas(num);
    if (contents != null) {
      break;
    }
    retry_cnt += 1;
    if (retry_cnt > SendYoD.MAX_RETRY_CNT) {
      break;
    }
  }
  Logger.log(" id(" + num + ") was selected.");
  
  SendYoD.sendMail(num, contents);
  
  Logger.log("--- " + SendYoD.APP_NAME + " end.");
  
  sendLog_(SendYoD.APP_NAME);
}
