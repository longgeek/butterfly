var need_check;
// var frameId = window.frameElement && window.frameElement.id || "code-interaction-frame";
var frameId = "code-interaction-frame";
var messenger = new Messenger(frameId);

messenger.addTarget(window.parent, "parent");

messenger.listen(function(msg) {
    msg = JSON.parse(msg);
    if (msg.hasOwnProperty("type") && msg.type === "get_output") {
        command = msg.command;
        regexp = new RegExp(/(In\s\[\d+\]:\s)/);
        lines = $('body .line');
        start_index = 0;
        cursor = lines.find(".cursor").parent();
        cursor_index = lines.index(cursor);

        for ( i=0; i<lines.length; i++) {
            if ( regexp.test(lines[i].innerText) && lines[i].innerText.indexOf(command[0]) !== -1 ) {
                start_index = i;
            }
        }
        output = [];
        if (start_index !== cursor_index) {
            for ( j=start_index + 1; j<cursor_index; j++ ) {
                if ( !/^\s+\.\.\.\:\s/.test(lines[j].innerText) && !eval("/\\s{" + lines[j].innerText.length + "}/").test(lines[j].innerText && !/^\s+\.\.\.\:\s/.test(lines[cursor_index].innerText)) ) {
                    output.push(lines[j].innerText);
                } else {
                  output = [];
                }
            }
        }
        data = JSON.stringify({"type": "get_output", "output": output});
        messenger.targets["parent"].send(data);
    }
    need_check = true;
    topic_type = msg.topic_type;
});

function current_command(type) {
    if (type === "linuxbash") {
        command = $(".line > .cursor").parent().text().split(/[#|$]\s/);
        if ( $(".line > .cursor").parent().text().split(/[#|$]\s/).length === 2 ) {
            return command[1];
        } else {
            return command[0];
        }
    } else if (type === "ipython") {
        regexp = new RegExp(/(In\s\[\d+\]:\s)/);
        lines = $('body .line');
        start_index = 0;

        for ( i=0; i<lines.length; i++ ) {
            if (regexp.test(lines[i].innerText)) {
                start_index = i;
            }
        }

        cursor = lines.find(".cursor").parent();
        cursor_index = lines.index(cursor);
        commands = [];
        for ( j=start_index; j<=cursor_index; j++) {
            commands.push(lines[j].innerText);
        }
        if (/\s+\.\.\.\:\s+$/.test(lines[cursor_index].innerText)) {
            return commands;
        }
        if (start_index === cursor_index) {
            return commands[0].replace(/^In.\[[0-9]+\]:./, '').replace(/^\s*\.\.\.\:\s/, '').replace(/^>>>\s/, '').replace(/^\.\.\.\s/, '');
        }
    }
}

function send_command(type, content) {
    if ( type === 'command' ) {
        command = current_command(topic_type);
        // 命令为多个空格组成
        if ( topic_type === "linuxbash" && eval("/\\s{" + command.length + "}/").test(command) ) {
            return;
    }
        data = {
            "command": command,
        };
    } else if ( type === 'output' ) {
        output = content;
        data = {
            "output": output.replace(new RegExp(/(\[\d;32m)/g), "").replace(new RegExp(/(\[\dm)/g), ""),
        };
    }
    data = JSON.stringify(data);
    messenger.targets["parent"].send(data);
}
