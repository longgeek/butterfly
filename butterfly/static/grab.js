var messenger = new Messenger();
messenger.addTarget(window.parent, 'parent');

messenger.listen(function (msg) {
    msg = JSON.parse(msg);
    if ( msg['type'] == 'get-iframe__content' ) {
        data = {'type': 'get-iframe__content', 'id': msg['id'], 'content': $('body').html()};
        data = JSON.stringify(data);
        messenger.targets['parent'].send(data);
    }
});
