// Title:
//   SendYoD - "Yome of the Day"を日々メールする
// Description:
//   「俺の嫁が可愛い」様 https://oreno-yome.com/ から、ランダムに選んだ投稿をメールします。

var YomeOfTheDay = {
  APP_NAME: "yomeOfTheDay",
  
  MAX_NUMBER: 3200,
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
    contents = contents.replace(/いいなと思ったら、「可愛いね」のボタンをクリックしてくださいね。/g, "");
    
    contents = contents.replace(/<p.*?>/g, "\n");
    contents = contents.replace(/<[^>]+>/g, "");
    
    return contents;
  },

  send: function (num, contents) {
    var today = new Date().toLocaleDateString("en-US");
    
    var title = "Yome of the Day";
    var contents = "No." + num + "\n"
    + contents+ "\n"
    + this.pageUrl(num);
    
    SendLINE.sendMessage(Consts.TARGET_NOBU, title + "\n" + contents);
  }
}

function YomeOfTheDay_main() {
  Logger.clear();
  Logger.log("--- " + YomeOfTheDay.APP_NAME + " start.");
  
  var retry_cnt = 0;
  while (true) {
    var num = parseInt(Math.random() * YomeOfTheDay.MAX_NUMBER);
    var contents = YomeOfTheDay.fetchDatas(num);
    if (contents != null) {
      break;
    }
    retry_cnt += 1;
    if (retry_cnt > YomeOfTheDay.MAX_RETRY_CNT) {
      break;
    }
  }
  Logger.log(" id(" + num + ") was selected.");
  
  YomeOfTheDay.send(num, contents);
  
  Logger.log("--- " + YomeOfTheDay.APP_NAME + " end.");
  
//  sendLog_(YomeOfTheDay.APP_NAME);
}
