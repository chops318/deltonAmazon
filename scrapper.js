var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');


url = 'http://www.amazon.com/VIZIO-E50-C1-50-Inch-1080p-Smart/dp/B00SMBFP4U';
request(url, function(error, response, html) {
    var price;
    var json = {
        price: ""
    };
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('#priceblock_ourprice').each(function(i, element) {
            var el = $(this);
            var price = el.text();
            console.log(price);
            json.price = price;

            fs.writeFile('price.json', JSON.stringify(json, null, 4), function(err) {
                console.log("Price saved to json");
            });
            fs.readFile('price.json', function(err, data) {
                if (err) throw err;
                var obj = JSON.parse(data);
                if (obj.price != price) {
                    console.log('Price has changed.');
                    
                    fs.writeFile('price.json', JSON.stringify(json, null, 4), function(err) {
                        console.log('Price updated in price.json file');
                    });
                }
            })
        })
    }
});