var SendIijmio = {
  
    TOKEN: "xxx",  
    // replace this when authentication error
    //   https://api.iijmio.jp/mobile/d/v1/authorization/?response_type=token&client_id=xxx&state=example_state&redirect_uri=https://hoge.wordpress.com/
    //   Use "access_token" in responsed url
    
    sendRest: function () {
      var headers = {
        'X-IIJmio-Developer': 'xxx',
        'X-IIJmio-Authorization': this.TOKEN,
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
  