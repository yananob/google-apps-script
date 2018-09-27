
function sendLog_(app_name) {
  var recipient = Session.getActiveUser().getEmail();
  var subject = '[GASlog] ' + app_name;
  var body = Logger.getLog();
  MailApp.sendEmail(recipient, subject, body);
}
