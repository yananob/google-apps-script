// Title:
//   sendLINE - (common module) send LINE mssage
// Description:
//   Send LINE message for specified target
// Premise:
//   - Already acquired OKEN at LINE Notify https://notify-bot.line.me/ja/
//   - Need setting values in myconsts.js

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
