#!/usr/bin/env node

/**
 *
 */
var config = {
  debug : false,
  version : '1.0.2',

  key : undefined,

  to : undefined,
  toName : undefined,

  from : 'echomail@pmav.eu',
  fromName : 'echomail@pmav.eu',

  subject : undefined,
  subjectPrefix : undefined,
  subjectMaxLength : 30,

  allowEmptyMessage : false,
  stdinInput : ''
}

/**
 *
 */
function main()
{
  processArguments();
  processInput();
}

/**
 *
 */
function processArguments()
{
  var argv = require('yargs')
    .usage('Send a mail from command line using Mandrill. Input will be read from stdin.')
    .example('$0 -k [key] -t [mail]', 'Send a mail to [mail]')
    .showHelpOnFail(false, 'Specify --help for available options')
    .version(config.version + '\n', 'version').alias('version', 'v')
    .help('help').alias('help', 'h')
    .require(['key','to'])
    .describe('key', 'Mandrill key').alias('key', 'k').string('key')
    .describe('to', 'Recipient mail address').alias('to', 't').string('to')
    .describe('to-name', 'Recipient name').string('to-name')
    .describe('from', 'Sender mail address').string('from')
    .describe('from-name', 'Sender name').string('from-name')
    .describe('subject', 'Mail subject, default: first ' + config.subjectMaxLength + ' chars from body').string('subject')
    .describe('subject-prefix', 'Mail subject prefix').string('subject-prefix')
    .describe('subject-max-length', 'Mail subject max length, default: ' + config.subjectMaxLength).string('subject-max-length')
    .describe('allow-empty-message', 'Allow empty message body').boolean('allow-empty-message')
    .strict()
    .argv;

  // Required.

  config.key = argv.key;
  config.to = config.toName = argv.to;
  
  // Optional.
  
  if (argv['to-name'] !== undefined)
    config.toName = argv['to-name'];

  if (argv['from'] !== undefined)
    config.from = config.fromName = argv['from'];
  
  if (argv['from-name'] !== undefined)
    config.fromName = argv['from-name'];

  if (argv['subject'] !== undefined)
    config.subject = argv['subject'];

  if (argv['subject-prefix'] !== undefined)
    config.subjectPrefix = argv['subject-prefix'];

  if (argv['subject-max-length'] !== undefined)
    config.subjectMaxLength = argv['subject-max-length'];

  config.allowEmptyMessage = argv['allow-empty-message'];
}

/**
 *
 */
function processInput()
{
  process.stdin.setEncoding('utf8');
  process.stdin.resume();

  process.stdin.on('data', function(data) {
    config.stdinInput += data;
  });

  process.stdin.on('end', function() {
    sendmail();
  });
}

/**
 *
 */
function sendmail()
{
  var messageBody = config.stdinInput.trim();

  if (!config.allowEmptyMessage && messageBody === '')
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

  mandrill_client.messages.send(payload, success, error);
}

function success(result)
{
  if (config.debug)
    console.log(result);

  process.exit(0);
}

function error(error)
{
  if (config.debug)
    console.log('Error: ' + error.name + ' - ' + error.message);

  process.exit(1);
}

/**
 *
 */
function buildSubject(message)
{
  var subject;

  if (config.subject === undefined)
  {
    if (message.length > config.subjectMaxLength)
    {
      subject = message.substring(0, config.subjectMaxLength) + '...';
    }
    else
    {
      subject = message;
    }
  }
  else
  {
    subject = config.subject;
  }
  
  if (config.subjectPrefix !== undefined)
  {
    subject = config.subjectPrefix + ' ' + subject;
  }

  return subject;
}

process.on('SIGINT', function () {
  process.exit(0);
});

main();
