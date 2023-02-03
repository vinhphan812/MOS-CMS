var Imap = require('imap'),
	inspect = require('util').inspect;

const { simpleParser } = require('mailparser');
const fs = require("fs");

const RECEIVE_FROM = "support@timo.vn";

var imap = new Imap({
	user: "Vonguyenthuyanh0304@gmail.com",
	password: "xmotfosmzcxpmnqf",
	host: "imap.gmail.com",
	port: 993,
	tls: true,
	tlsOptions: { rejectUnauthorized: false },
});

function openInbox(cb) {
	imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
	openInbox(function(err, box) {
		if (err) throw err;
		var f = imap.seq.fetch(box.messages.total + ':*', {
			bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE BODY)',
			struct: true
		});
		f.on('message', function(msg, seqno) {
			console.log('Message #%d', seqno);
			var prefix = '(#' + seqno + ') ';
			msg.on('body', function(stream) {
				simpleParser(stream, async (err, parsed) => {
					console.log(parsed);
				});
			});

			msg.once('attributes', function(attrs) {
				console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
			});
			msg.once('end', function() {
				console.log(prefix + 'Finished');
			});
		});
		f.once('error', function(err) {
			console.log('Fetch error: ' + err);
		});
		f.once('end', function() {
			console.log('Done fetching all messages!');
			imap.end();
		});
	});
});

imap.once('error', function(err) {
	console.log(err);
});

imap.once('end', function() {
	console.log('Connection ended');
});

imap.connect();