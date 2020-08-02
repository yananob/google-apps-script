var SendIijmio = {
  
  sendRest: function () {
    var headers = {
      'X-IIJmio-Developer': Consts.IIJMIO.DEVELOPER_ID,
      'X-IIJmio-Authorization': Consts.IIJMIO.TOKEN,
    };
    var options = {
      'contentType': "application/x-www-form-urlencoded",
      'headers': headers,
      'method' : 'get',
    };

    resp = UrlFetchApp.fetch('https://api.iijmio.jp/mobile/d/v2/log/packet/', options);

    return resp.getContentText();
  }
}
