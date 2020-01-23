var SendVoiceByAutoRemote = {
    IS_DEBUG: false,
    APP_NAME: "sendAutoRemote",
    IGNORE_SENDERS: ["xxx@gmail.com"],
    AUTOREMOTE_URL: "http://autoremotejoaomgcd.appspot.com/sendmessage",
    AUTOREMOTE_KEY: "xxx",
  
    _itemNum: 0, // Used to lead unordered & ordered list items.
    
    // http://stackoverflow.com/questions/14956479/remove-html-formatting-when-getting-body-of-a-gmail-message-in-javascript
    getTextFromHtml: function (html) {
      return this.getTextFromNode(Xml.parse(html, true).getElement());
    },
  
    getTextFromNode: function (x) {
      switch(x.toString()) {
        case 'XmlText': return x.toXmlString();
        case 'XmlElement':
          var name = x.getName().getLocalName();
          Logger.log(name);
          var pre = '';
          var post = '';
          switch (name) {
            case 'br':
            case 'p':
              pre = '';
              post = '\n';
              break;
            case 'ul':
              pre = '';
              post = '\n';
              itemNum = 0;
              break;
            case 'ol':
              pre = '';
              post = '\n';
              _itemNum = 1;
              break;
            case 'li':
              pre = '\n' + (_itemNum == 0 ? ' - ' : (' '+ _itemNum++ +'. '));
              post = '';
              break;
            default:
              pre = '';
              post = '';
              break;
          }
          return pre + x.getNodes().map(getTextFromNode).join('') + post;
        default: return '';
      }
    },
  
    callAutoRemote: function (subject, from, body) {
      subject = subject.substr(0, 20);
      body = getTextFromHtml_(body).substr(0, 40);
      
      Logger.log("Sending AutoRemote: [" + subject + "]");
      
      url = AUTOREMOTE_URL + "?key=" + AUTOREMOTE_KEY
      + "&message=" + encodeURIComponent(subject) + "%20" + encodeURIComponent(body) + "=:=voice";
      
      response = UrlFetchApp.fetch(url);
      // Logger.log("Result: " + response.getResponseCode());
    },
  
    processMail: function (labelName) {
      var sendCnt = 0;
      
      var sheet = SpreadsheetApp.getActiveSheet();
      
      // check if launch day
      var dt = new Date();
      
      var label = GmailApp.getUserLabelByName(labelName);
      var thds = label.getThreads(0, 10);
      for (var n in thds) {
        var thd = thds[n];
        var msgs = thd.getMessages();
        for (m in msgs) {
          var msg = msgs[m];
          
          if (!msg.isUnread()) {
            continue;
          }
          //      if (Utilities.formatDate(msg.getDate(), "JST", "yyyyMMdd") != Utilities.formatDate(dt, "JST", "yyyyMMdd")) {
          //        continue;
          //      }
          if (IGNORE_SENDERS.indexOf(msg.getFrom()) != -1) {
            continue;
          }
          
          this.callAutoRemote(msg.getSubject(), msg.getFrom(), msg.getBody());
          msg.markRead();
          sendCnt++;
        }
      }
      
      return sendCnt;
    }
  }
  
  function sendAutoRemote_main() {
    Logger.clear();
    Logger.log("--- " + SendAutoRemote.APP_NAME + " start.");
    
    var sendCnt = SendAutoRemote.processMail("Notify/Voice");
  
    Logger.log("--- " + SendAutoRemote.APP_NAME + " end.");
    
    if (SendAutoRemote.IS_DEBUG && sendCnt > 0) {
      sendLog_(SendAutoRemote.APP_NAME);
    }
  }
  