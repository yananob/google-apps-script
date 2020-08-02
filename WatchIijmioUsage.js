// Title:
//   WatchIijmioUsage
// Description:
//   Check iijmio data usage, and send the result via LINE
//   - Need setting values in myconsts.js
//   - Supporting "Family pack"

var WatchIijmioUsage = {
  APP_NAME: "WatchIijmioUsage",
  IS_DEBUG: false,
  
  getUsageRate: function(usage) {
    return parseInt(usage / Consts.IIJMIO.USAGE_MAX * 100);
  },
  
  check: function () {
    var resp = JSON.parse(SendIijmio.sendRest());
    if (this.IS_DEBUG) {
      Logger.log(`Resp: ${resp}`);
    }
    if (resp.returnCode != "OK") {
      Logger.log(`[ERROR] Response error. [${resp}]`);
      return;
    }
    
    var today = Utilities.formatDate(new Date(), "JST+9", "yyyyMMdd");
    var today_day = parseInt(today.substring(6, 8), 10);
    var packetLogInfos = resp.packetLogInfo;
    var datas = {};
    
    // Collect this month's data
    for (var pli in packetLogInfos) {
      for (var hi in packetLogInfos[pli].hdoInfo) {
        var hdo = packetLogInfos[pli].hdoInfo[hi];
        datas[hdo.hdoServiceCode] = {};
        for (var pl in hdo.packetLog) {
          var packetLog = hdo.packetLog[pl];
          
          if (packetLog.date.substring(0, 6) == today.substring(0, 6)) {
            datas[hdo.hdoServiceCode][packetLog.date] = packetLog.withCoupon;
          }
        }
      }
    }
    
    // Calculate usage
    var monthUsage = 0;
    var todayUsage = 0;
    var todayMsg = "";
    for (var hdoServiceCode in datas) {
      todayMsg += `  ${Consts.IIJMIO.USERS[hdoServiceCode]}: ${datas[hdoServiceCode][today]}MB\n`;
      todayUsage += parseInt(datas[hdoServiceCode][today]);
      for (var dt in datas[hdoServiceCode]) {
        monthUsage += parseInt(datas[hdoServiceCode][dt]);
      }
    }

    var estimateMB = parseInt(monthUsage * 31 / today_day);
    var estimateRate = this.getUsageRate(estimateMB);
    let notify = "";
    if (estimateRate > 100) {
      notify = "[WARN] Mobile usage is not good";
    } else {
      notify = "[INFO] Mobile usage report";
    }

    let msg = `${notify}
Today [${today}]
${todayMsg}
  Total: ${todayUsage}MB

This month:
  Now: ${monthUsage}MB  (${this.getUsageRate(monthUsage)}%)
  Estimate: ${estimateMB}MB  (${estimateRate}%)
`    
    Logger.log(msg);
    if ((estimateRate > 100) || (today_day % 10 == 0)) {
      SendLINE.sendMessage(Consts.TARGET_NOBU, msg);
    }
  }
}

function WatchIijmioUsage_main() {
  Logger.clear();
  Logger.log(`--- ${WatchIijmioUsage.APP_NAME} start.`);
  
  WatchIijmioUsage.check();
  
  Logger.log(`--- ${WatchIijmioUsage.APP_NAME} end.`);
  
  if (WatchIijmioUsage.IS_DEBUG) {
    sendLog_(WatchIijmioUsage.APP_NAME);
  }
}

function test_main() {
  var today = Utilities.formatDate(new Date(2018, 10, 9), "JST+9", "yyyyMMdd");
  Logger.log(today);
  Logger.log(today.substring(6, 8));
  Logger.log(parseInt(today.substring(6, 8), 10));
}
