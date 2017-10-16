var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    url = 'http://www.lotto.pl/lotto/wyniki-i-wygrane/wygrane?page=',
    wins = [];

var i = 0;
var currUrl = url + i;

fs.appendFileSync('data.csv', 'Lp.,Miejscowość,Adres kolektury,Data,Wygrana\n');

var makeRequest = function(){
    request(currUrl, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);

            $('tr', '.page_repeat').each(function () {
                wins.push(this);
            });

            wins.splice(0, 1);

            var j = 0, len = wins.length;
            var win, address;

            for (j; j < len; ++j){

                if (wins[j].children[3].children[0] !== undefined && wins[j].children[3].children[0].hasOwnProperty('children')){
                    if (wins[j].children[3].children[0].children[0] !== undefined)
                        address = wins[j].children[3].children[0].children[0].data.replace(/\n/g, '').replace(/,/g, '');
                    else
                        address = "";
                }else {
                    address = "";
                }

                win = wins[j].children[0].children[0].data.replace('.', '') + ',' + wins[j].children[2].children[0].data + ',' + address + ',' +
                    wins[j].children[4].children[0].data + ',' + wins[j].children[5].children[0].data.replace(/\s/g, '').replace(/,/, '.') + '\n';
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
