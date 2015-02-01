#!/usr/bin/env node

var config = {
  debug : false,
  version : '0.0.3',

  from : 'echomail@pmav.eu',
  fromName : 'echomail',
  titleSize : 30
}

function sendmail(messageBody, key, to)
{
  if (messageBody === '')
    return;

  var mandrill = require('mandrill-api/mandrill');
  mandrill_client = new mandrill.Mandrill(key);

  var message = {
    'text':       messageBody,
    'subject':    getSubject(messageBody),
    'from_email': config.from,
    'from_name':  config.fromName,
    'to': [
      { 'email': to }
    ],
  };

  var payload = {
    'message': message,
    'async': false,
    'ip_pool': 'Main Pool'
  };

  function success(result) {
    if (config.debug)
      console.log(result);

    process.exit(0);
  }


  function error(error) {
    if (config.debug)
      console.log('Error: ' + error.name + ' - ' + error.message);

    process.exit(1);
  }

  mandrill_client.messages.send(payload, success, error);
}

function getSubject(message)
{
  return message.length > config.titleSize
    ? message.substring(0, config.titleSize) + '...'
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