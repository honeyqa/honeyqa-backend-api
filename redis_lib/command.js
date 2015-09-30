'use strict';

function Command(command, args, sub_command, buffer_args, callback) {
    this.command = command;
    this.args = args;
    this.sub_command = sub_command;
    this.buffer_args = buffer_args;
    this.callback = callback;
}

module.exports = Command;
