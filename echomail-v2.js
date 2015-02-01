var mandrill = require('mandrill-api/mandrill');

function sendmail(output)
{
if (output === '')
return;
  mandrill_client = new mandrill.Mandrill('');
  var message = {
      "text": output,
      "subject": "cronjob",
      "from_email": "cronjob@rethumb.com",
      "from_name": "cronjob",
      "to": [{
              "email": "pedrovam@gmail.com"
          }],
  };

  mandrill_client.messages.send({"message": message, "async": false, "ip_pool": "Main Pool"}, function(result) {
      console.log(result);
  }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  });
}

var output = "";

process.stdin.setEncoding('utf8');
process.stdin.resume();

process.stdin.on('data', function(data) {
//  var chunk = process.stdin.read();
 // if (chunk !== null) {
    //process.stdout.write('data: ' + chunk);
//console.log('A');
    output += data;
//  }
});

process.stdin.on('end', function() {
  //process.stdout.write('end');
//console.log('Done')
sendmail(output);
});
