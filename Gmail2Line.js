var Gmail2Line = {
  APP_NAME: "Gmail2Line",
  
  replace: function(target_str, contents) {
    for (j in contents) {
      cont = contents[j];
      if (cont["remove"]) {
        Logger.log(`removing ${cont["remove"]}`);
        var re = new RegExp(cont["remove"], "m");
        target_str = target_str.replace(re, '');
      }
    }
    
    return target_str;
  },
  
  execute: function (condition, target, modifications) {
    var today = new Date();
    let target_date = `${today.getFullYear()}/${(today.getMonth() + 1)}/${(today.getDate() - 1)}`;
    
    kw = condition["keyword"];
    if (condition["label"].length > 0) {
      kw += ` label:${condition["label"]}`;
    }
    if (condition["unread_only"]) {
      kw += " is:unread";
    }
    kw += ` after:${target_date}`;
    Logger.log(`Searching /w keyword: [${kw}]`);
    
    var threads = GmailApp.search(kw, 0, condition["thread_count"]);
    for (var n in threads) {
      var thd = threads[n];
      var msgs = thd.getMessages();
      for (m in msgs) {
        var msg = msgs[m];
        
        if (!msg.isUnread() && condition["unread_only"]) {
          continue;
        }
        
        Logger.log("Notifying: " + msg.getSubject());
        from = msg.getFrom();
        subject = msg.getSubject();
        body = msg.getBody();
        
        if (modifications) {
          for (i in modifications) {
            mod = modifications[i];
            Logger.log(`processing ${mod["title"]}`);
            if (mod["title"] && subject == mod["title"]) {
              body = Gmail2Line.replace(body, mod["contents"]);
            }
            Logger.log("from: " + from);
            if (mod["from"] && from.indexOf(mod["from"]) != -1) {
              Logger.log("from matched");
              body = Gmail2Line.replace(body, mod["contents"]);
            }
          }
        }
        msgTxt = `${subject}\n${body}`;
        SendLINE.sendMessage(target, msgTxt);
        msg.markRead();
        return;
      }
    }
    Logger.log("No mails were matched.");
  }
}

function Gmail2Line_main() {
  var SETTINGS = [
    {
      "name": "Notify/Nobu",
      "condition": {
        "keyword": "",
        "label": "notify-nobu",
        "unread_only": true,
        "thread_count": 2,
      },
      "modifications": [
        {
          "title": "予約資料がご用意できました（大阪市立阿倍野図書館）",
          "contents": [
            {
              "remove": "[\\S\\s]+下記の予約資料が.*借りていただ\\n*けるようになりましたので、お知らせします。",
            },
            {
              "remove": "[\\S\\s]+発熱やせき等の症状があるなど、体調不良の際は、図書館へのご来館をおひかえくださいますようお願いします。",
            },
            {
              "remove": "受取館：阿倍野図書館\\n[\\S\\s]+"
            },
          ]
        },
        {
          "title": "予約資料について［２回目］ （大阪市立阿倍野図書館）",
          "contents": [
            {
              "remove": "[－]+\\nこのメールには返信しないでください。もしも、このメールが覚えのないも\\nのでしたら、お手数ですが下記の図書館までご連絡ください。\\n[－]+",
            },
            {
              "remove": "最新の開館状況やご利用いただけるサービス内容は、図書館ホームページでご確認ください。\\n図書館のホームページ https://www.oml.city.osaka.lg.jp/",
            },
            {
              "remove": "受取館：阿倍野図書館　TEL06-6656-1009\\n[\\S\\s]+"
            },
          ]
        },
        {
          "title": "返却期限日のお知らせ（大阪市立阿倍野図書館）",
          "contents": [
            {
              "remove": "お確かめのうえ、もよりの大阪市立図書館にお返しください。[\\S\\s]+お手数ですがもよりの大阪市立図書館までご連絡ください。\\n[\*]+",
            },
            {
              "remove": "◎資料の返却が遅れますと、新たに資料を借りることができない、[\\S\\s]+"
            },
          ],
        },
      ],
      "target": Consts.TARGET_NOBU,
    },
    {
      "name": "Notify/Berg",
      "condition": {
        "keyword": "",
        "label": "notify-berg",
        "unread_only": true,
        "thread_count": 2,
      },
      "modifications": [
        {
          "title": "今日の格言",
          "contents": [
            {
              "remove": "----------[\\S\\s]+"
            },
          ],
        },
        {
          "from": "jouhouteikyou@info.police.pref.osaka.jp",
          "contents": [
            {
              "remove": "------------[\\S\\s]+",
            },
          ]
        },
        {
          "from": "alerts-transit@mail.yahoo.co.jp",
          "contents": [
            {
              "remove": "-------------------------[\\S\\s]+",
            },
          ]
        },
      ],
      "target": Consts.TARGET_BERG,
    },
    {
      "name": "Notify/TkYn",
      "condition": {
        "keyword": "",
        "label": "notify-tkyn",
        "unread_only": true,
        "thread_count": 2,
      },
      "target": Consts.TARGET_TKYN,
    },
    {
      "name": "Notify/oml",
      "condition": {
        "keyword": "",
        "label": "notify-oml",
        "unread_only": true,
        "thread_count": 2,
      },
      "modifications": [
        {
          "title": "予約資料がご用意できました（大阪市立阿倍野図書館）",
          "contents": [
            {
              "remove": "[\\S\\s]+下記の予約資料が.*借りていただ\\n*けるようになりましたので、お知らせします。",
            },
            {
              "remove": "[\\S\\s]+発熱やせき等の症状があるなど、体調不良の際は、図書館へのご来館をおひかえくださいますようお願いします。",
            },
            {
              "remove": "受取館：阿倍野図書館\\n[\\S\\s]+"
            },
          ]
        },
        {
          "title": "予約資料について［２回目］ （大阪市立阿倍野図書館）",
          "contents": [
            {
              "remove": "[－]+\\nこのメールには返信しないでください。もしも、このメールが覚えのないも\\nのでしたら、お手数ですが下記の図書館までご連絡ください。\\n[－]+",
            },
            {
              "remove": "[\\S\\s]+発熱やせき等の症状があるなど、体調不良の際は、図書館へのご来館をおひかえくださいますようお願いします。",
            },
            {
              "remove": "受取館：阿倍野図書館　TEL06-6656-1009\\n[\\S\\s]+"
            },
          ]
        },
        {
          "title": "返却期限日のお知らせ（大阪市立阿倍野図書館）",
          "contents": [
            {
              "remove": "お確かめのうえ、もよりの大阪市立図書館にお返しください。[\\S\\s]+お手数ですがもよりの大阪市立図書館までご連絡ください。\\n[\*]+",
            },
            {
              "remove": "◎資料の返却が遅れますと、新たに資料を借りることができない、[\\S\\s]+"
            },
          ],
        },
      ],
      "target": Consts.TARGET_OML,
    },
  ];

  
  Logger.clear();
  Logger.log("--- " + Gmail2Line.APP_NAME + " start.");
  
  for (var n in SETTINGS) {
    setting = SETTINGS[n]
    Gmail2Line.execute(setting["condition"], setting["target"], setting["modifications"]);
  }
    
  Logger.log("--- " + Gmail2Line.APP_NAME + " end.");
  
//  sendLog_(Gmail2Line.APP_NAME);
}
