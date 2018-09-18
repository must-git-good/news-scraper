// Dependencies and Initializations: //
///////////////////////////////////////

var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

var app = express()

var databaseUrl = "news";
var collections = ["scrapedNews"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database error: ", error);
});
db.on("connect", function () {
    console.log("Database connected successfully!");
});

//////////////////////////////////////////

// Routing //
/////////////

app.get("/", function (req, res) {
    res.send("Hello World! (Routing is working)")
});

app.get("/all", function (req, res) {
    db.scrapedNews.find({}, function (err, found) {
        if (err) {
            console.log("Error at the find-all db check: ", err);
        } else {
            res.json(found);
        }
    });
});

app.get("/scrape", function (req, res) {
    request("https://news.ycombinator.com", function (err, res, html) {
        var $ = cheerio.load(html);
        if (err) {
            console.log("Error: ", err);
        } else {
            $(".title").each(function (i, element) {
                var title = $(element).children("a").text();
                var link = $(element).children("a").attr("href");
                if (title && link) {
                    db.scrapedNews.insert({
                        title: title,
                        link: link
                    }, function (err, inserted) {
                        if (err) {
                            console.log("Error at db insert: ", err);
                        } else {
                            console.log("This data has been inserted into the db: ", inserted);
                        }
                    });
                }
            });
        }
    });
    res.send("Scrape Completed");
});





// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});


// request("https://www.theonion.com", function (err, res, html) {
//     var $ = cheerio.load(html);
//     if (err) {
//         console.log("Error: ", err);
//     } else {
//         // console.log(res);
//         $("[data-contenttype='Headline']").each(function(i, element){
//             console.log("======================");
//             // console.log(element);

//             var headline = $(element).children(type, "text");
//             var link = $(element).attr("href");
//             console.log(headline);
//             console.log(link);
//         })


//     }

// });

