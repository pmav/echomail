# echomail

echomail is a command line tool to send mails using Mandrill API. You will need a Mandrill account, create one here: https://mandrill.com

## How to use

The following line will send a mail to mail@example.org with the text "Hi!":

    echo Hi! | echomail -k <Mandrill API Key> -t mail@example.org

Or in a cronjob:

    */1 * * * * python /home/jinx/cpu-monitor.py | /usr/local/bin/echomail -k <Mandrill API Key> -t mail@example.org

## Flags

Flag | Short flag | Description | Required
--- | --- | --- | ---
--key | -k | Mandrill key | **Yes**
--to | -t | Recipient mail address | **Yes**
--to-name | N/A | Recipient name | No
--from | N/A | Sender mail address | No
--from-name | N/A | Sender name | No
--subject | N/A | Mail subject | No
--subject-prefix | N/A | Mail subject prefix | No
--subject-max-length | N/A | Mail subject max length | No
--allow-empty-message | N/A | Allow empty message body | No
--help | -h | Show help | No
--version | -v | Show version | No

## TODO

- Flag: --debug
- Comments in code