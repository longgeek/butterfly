var messenger = new Messenger();
messenger.addTarget(window.parent, 'parent');

messenger.listen(function(msg) {
    msg = JSON.parse(msg);
    if ( msg.type == 'get-iframe__content' ) {
        data = {
            'type': 'get-iframe__content',
            'id': msg.id, 'content': $('body').html()
        };
        data = JSON.stringify(data);
        messenger.targets['parent'].send(data);
    }
    else if ( msg.type == 'get-iframe__check' ) {
        need_check = '';
        topic_type = msg.topic_type;
    }
});

function current_command(type) {
    if (type == "linuxbash") {
        command = $(".line > .cursor").parent().text().split(/[#|$]/);
        if ( $(".line > .cursor").parent().text().split(/[#|$]/).length == 2 ) {
            return command[1];
        } else {
            return command[0];
        }
    } else if (type == "ipython") {
        return $(".line > .cursor").parent().text().replace(/^In.\[[0-9]+\]:./, '').replace(/^\s*\.\.\.\:\s/, '').replace(/^>>>\s/, '').replace(/^\.\.\.\s/, '');
    }
}

function send_command() {
    data = {
        'type': 'get-iframe__check',
        'command': current_command(topic_type),
    };
    data = JSON.stringify(data);
    messenger.targets['parent'].send(data);
}
