# echomail

echomail is a command line tool to send mails using Mandrill API. You will need a Mandrill account, create one here: https://mandrill.com

## Example
The following line will send a mail to mail@example.org with the text "Hi!":

    echo Hi! | echomail <Mandrill API Key> mail@example.org

## TODO
- ~~Read key from args~~
- ~~Read mail from args~~
- Flags: --help, --version, --key, --to, --to-name, --from, --from-name, --subject, --debug