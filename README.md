# echomail

echomail is a command line tool to send mails using Mandrill API. You will need a Mandrill account, create one here: https://mandrill.com

## Example
The following line will send a mail to mail@example.org with the text "Hi!":

    echo Hi! | echomail -k <Mandrill API Key> -t mail@example.org

## TODO
- ~~Done: --key, --to, --help, --version~~
- In line: --to-name, --from, --from-name, --subject, --subject-prefix, --subject-max-length, --debug