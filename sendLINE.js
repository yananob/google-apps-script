// Title:
//   sendLINE - （共通モジュール）LINE送信する
// Description:
//   指定したtargetに対して、LINEでメッセージ送信する
//   前提:
//     - LINE Notify https://notify-bot.line.me/ja/ でTOKENを取得していること

var SendLINE = {

  sendMessage: function (target, msg) {
    var formData = {
      'message': msg
    };
    var headers = {
      'Authorization': 'Bearer ' + Consts.LINE_TOKENS[target],
    };
    var options = {
      'contentType': "application/x-www-form-urlencoded",
      'headers': headers,
      'method' : 'post',
      'payload' : formData
    };

    resp = UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);

    return "[" + resp.getResponseCode() + "]" + resp.getContentText();
  }
}
