// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
var flash = require('express-flash');
var session = require('express-session');
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/quoting_dojo');
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
app.use(flash());
app.use(session({
    secret: 'somethingcool',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// model
var QuoteSchema = new mongoose.Schema({
	content: {type: String, required: [true, "A quote is required."], minlength:[10, "Quote name must be at least 10 chars."]},
	author: {type: String, required: [true, "An author is required."], minlength: [2, "Author name must be at least 2 chars."]},
        }, {timestamps: true });
var Quote = mongoose.model('Quote', QuoteSchema);


// routes
app.get('/', function(req, res) {
    res.render('index');
});

app.post('/create', function(req, res) {
    var new_quote = new Quote(req.body);
    new_quote.save((err)=>{
        if(err){
            console.log(err);
            for(var key in err.errors){
                req.flash('validation', err.errors[key].message);
            }
            res.redirect('/');
        } else {
            console.log("success");
            res.redirect('/quotes');
        }
    });
});

app.get('/quotes', function(req, res) {
    Quote.find({}).sort({createdAt: -1}).exec(function(err,quotesinDB){
        if(err){
            console.log(err);
        } else {
            console.log(quotesinDB);
            console.log("success");
        }
        res.render('showall', {quotes: quotesinDB});
    });
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});
