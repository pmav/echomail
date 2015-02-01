
// TODO:
// - Read key from args
// - Read mail from args

var debug = true;

var from = 'echomail@pmav.eu';
var fromName = 'echomail';
var titleSize = 30;

function sendmail(messageBody, key, to)
{
  if (messageBody === '')
    return;

  var mandrill = require('mandrill-api/mandrill');
  mandrill_client = new mandrill.Mandrill(key);

  var message = {
    'text':       messageBody,
    'subject':    getSubject(messageBody),
    'from_email': from,
    'from_name':  fromName,
    'to': [
      { 'email': to }
    ],
  };

  var payload = {
    'message': message,
    'async': false,
    'ip_pool': 'Main Pool'
  };

  mandrill_client.messages.send(payload, s, e);
}


function s(result) {
  if (debug)
    console.log(result);

  return 0;
}


function e(e) {
  if (debug)
    console.log('Error: ' + e.name + ' - ' + e.message);

  return 1;
}


function getSubject(message)
{
  return message.length > titleSize
    ? message.substring(0, titleSize) + '...'
    : message;
}

function main()
{
  var key = process.argv[2];
  var to = process.argv[3];

  var stdinInput = '';

  process.stdin.setEncoding('utf8');
  process.stdin.resume();

  process.stdin.on('data', function(data) {
    stdinInput += data;
  });

  process.stdin.on('end', function() {
    sendmail(stdinInput, key, to);
  });
}

main();