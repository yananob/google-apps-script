// Title:
//   AutoCrawler - 指定URLを自動で叩く
// Description:
//   指定したURLを自動で叩く

var AutoCrawler = {
    APP_NAME: "autoCrawler",
    
    crawlUrl: function (url) {
      var pages = UrlFetchApp.fetch(url);
      var contents = pages.getContentText();
    }
  }
  
  function autoCrawler_main() {
    Logger.clear();
    Logger.log("--- " + AutoCrawler.APP_NAME + " start.");
    
    cnt = Math.random() * 3;
    Logger.log("  loop cnt: " + cnt);
    for (var i = 0; i < cnt; i++) {
      AutoCrawler.crawlUrl(Consts.AutoCrawler_URL);
    }
  
    Logger.log("--- " + AutoCrawler.APP_NAME + " end.");
    
    sendLog_(AutoCrawler.APP_NAME);
  
  }
  