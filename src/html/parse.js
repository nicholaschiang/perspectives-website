const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('./original.html').toString();

function last(arr) {
    return arr[arr.length - 1];
};

function read() {
    const $ = cheerio.load(html);
    const events = [];
    $('.date_event').each(function() {
        events.push({
            source: $(this).find('.source').text(),
            date: last(last($(this).find('.date').text().split(' ')).split('-')),
            content: $(this).clone().children().remove().end().text().trim()
                .replace(new RegExp('"', 'g'), '')
                .replace(/(?:\r\n|\r|\n)/g, '<br>'),
        });
    });
    return events;
};

function write(events) {
    const $ = cheerio.load('<ul id="nav"></ul><div id="events"></div>');
    events.forEach((event) => {
        $('#nav').append('<li><span>' + event.date + '</span></li>');
        $('#events').append('<h2 class="milestone">' + event.date + '</h2>');
        $('#events').append('<p>' + event.content + '</p>');
        $('#events').append('<p class="source">' + event.source + '</p>');
    });
    return $.html();
};

function main() {
    const parsed = write(read());
    fs.writeFileSync('./parsed.html', parsed);
};

main();