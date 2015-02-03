#!/usr/bin/env node

var config = {
  debug : false,
  version : '1.0.0',

  key : undefined,

  to : undefined,
  toName : undefined,

  from : 'echomail@pmav.eu',
  fromName : 'echomail@pmav.eu',

  subjectMaxLength : 30
}

function main()
{
  processArguments();
  processInput();
}

function processArguments()
{
  var argv = require('yargs')
    .usage('Send a mail from command line using Mandrill. Input will be read from stdin.')
    .example('$0 -k [key] -t [mail]', 'Send a mail to [mail]')
    .showHelpOnFail(false, "Specify --help for available options")
    .version(config.version, 'version').alias('version', 'v')
    .help('help').alias('help', 'h')
    .require(['key','to'])
    .describe('key', 'Mandrill key').alias('key', 'k').string('key')
    .describe('to', 'Recipient mail address').alias('to', 't').string('to')
    .describe('from', 'Sender mail address').string('from')
    .describe('from-name', 'Sender mail name').string('from-name')
    .strict()
    .argv;

  config.key = argv.key;
  config.to = argv.to;
  
  // Optional.
  
  if (argv.from !== undefined)
    config.from = config.fromName = argv.from;
  
  if (argv['from-name'] !== undefined)
    config.fromName = argv['from-name'];
}

function processInput()
{
  var stdinInput = '';

  process.stdin.setEncoding('utf8');
  process.stdin.resume();

  process.stdin.on('data', function(data) {
    stdinInput += data;
  });

  process.stdin.on('end', function() {
    sendmail(stdinInput); // TODO Move stdinInput to config.
  });
}

function sendmail(messageBody)
{
  if (messageBody === '') // TODO New option: allow empty message.
    process.exit(0);

  var mandrill = require('mandrill-api/mandrill');
  var mandrill_client = new mandrill.Mandrill(config.key);

  var message = {
    'text':       messageBody,
    'subject':    buildSubject(messageBody),
    'from_email': config.from,
    'from_name':  config.fromName,
    'to': [
      {
        'email': config.to,
        'name':  config.toName,
        'type':  'to'
      }
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

function buildSubject(message)
{
  return message.length > config.subjectMaxLength
    ? message.substring(0, config.subjectMaxLength) + '...'
    : message;
}

process.on('SIGINT', function () {
  process.exit(0);
});

main();