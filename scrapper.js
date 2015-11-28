var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');
nodemailer = require('nodemailer')

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "grnfusion@gmail.com",
        pass: "Synsyn@1020"
    }
});

url = 'http://www.amazon.com/VIZIO-E50-C1-50-Inch-1080p-Smart/dp/B00SMBFP4U';
request(url, function(error, response, html) {
    var price, oldprice;
    var json = {
        price: "",
        oldprice: "",
        productTitle: ""
    };
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var productTitle = $('#productTitle').text();
        $('#priceblock_ourprice').each(function(i, element) {
            var el = $(this);
            var price = el.text();
            //console.log(price);
            json.price = price;
            json.oldprice = price;
            json.productTitle = productTitle;
            console.log(json)
            



            fs.readFile('price.json', function(err, data) {
                if (err) throw err;
                var obj = JSON.parse(data);
                if (obj.price != obj.oldprice) {
                    console.log('Price has changed.');
                    fs.writeFile('price.json', JSON.stringify(json, null, 4), function(err) {
                        console.log('Price saved in price.json file');
                    });
                    smtpTransport.sendMail({
                        from: "Amz BOt <amazonbot@amzbots.com>", // sender address
                        to: "Ed Smith  <deltonamazon@mailinator.com>", // comma separated list of receivers
                        subject: productTitle + " price change", // Subject line
                        text: "Price  has changed to " + json.price + " from " + obj.oldprice // plaintext body
                    }, function(error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Message sent: " + response.message);
                        }
                    });

                }
            })
        })
    }
});