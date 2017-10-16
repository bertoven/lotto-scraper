var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    url = 'http://www.lotto.pl/lotto/wyniki-i-wygrane/wygrane?page=',
    wins = [];

var i = 0;
var currUrl = url + i;

var makeRequest = function(){
    request(currUrl, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);

            $('tr', '.page_repeat').each(function () {
                wins.push(this);
            });

            wins.splice(0, 1);

            var j = 0, len = wins.length;
            var win;

            for (j; j < len; ++j) {
                win = wins[j].children[0].children[0].data.replace('.', '') + ',' + wins[j].children[2].children[0].data + ',' +
                    wins[j].children[4].children[0].data + ',' + wins[j].children[5].children[0].data.replace(/\s/g, '').replace(',', '.') + '\n';
                fs.appendFileSync('data.csv', win);
            }
            ++i;
            if (i >= 10){
                console.log('Updated!');
                return;
            }
            currUrl = url + i;
            wins = [];
            makeRequest();
        }
    });
};

makeRequest();
