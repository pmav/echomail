# echomail

echomail is a command line tool to send mails using Mandrill API. You will need a Mandrill account, create one here: https://mandrill.com

### Examples
The following line will send a mail to mail@example.org with the text "Hi!":

    echo Hi! | echomail -k <Mandrill API Key> -t mail@example.org

Or in a cronjob:

    */1 * * * * python /home/jinx/cpu-monitor.py | /usr/local/bin/echomail -k <Mandrill API Key> -t mail@example.org

### TODO
- [x] --key
- [x] --to
- [x] --help
- [x] --version
- [x] --to-name
- [x] --from
- [x] --from-name
- [x] --subject
- [x] --subject-prefix
- [x] --subject-max-length
- [x] --allow-empty-message
- [ ] --debug
- [ ] Comments