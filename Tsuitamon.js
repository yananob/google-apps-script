var Tsuitamon = {
  IS_DEBUG: false,
  APP_NAME: "Tsuitamon",
}

function Tsuitamon_main() {
  Logger.clear();
  Logger.log("--- " + Tsuitamon.APP_NAME + " start.");
  
  // check whether launch timing
  var dt = new Date();
  var dayOfWeek = dt.getDay();
  // launch only weekday
  if (dayOfWeek < 1 || 5 < dayOfWeek) {
    return;
  }
  // launch only daytime
  var hour = dt.getHours();
  if (hour < 7 || 19 < hour) {
    return;
  }
  
  var condition = {
    "keyword": "",
    "label": "notify-tsuitamon",
    "unread_only": true,
    "thread_count": 1,
  }
  var modifications = [
    {
      "from": "tsuitamon@tsuitamon.net",
      "contents": [
        {
          "remove": "『ツイタもん』[\\S\\s]+"
        },
      ]
    },
  ]
  Gmail2Line.execute(condition, Consts.TARGET_TKYN, modifications);

  Logger.log("--- " + Tsuitamon.APP_NAME + " end.");
  
  if (Tsuitamon.IS_DEBUG) {
    sendLog_(Tsuitamon.APP_NAME);
  }
}
