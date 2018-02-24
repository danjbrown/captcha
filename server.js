const express 			= require('express');
const app         		= express();
const bodyParser  		= require('body-parser');
const expressValidator  = require('express-validator');
const svgCaptcha        = require('svg-captcha');
const svg2png           = require('svg2png');
const session           = require('express-session');

// Config vars
const sessionSecret = 'Ka5Iu4erpq';
const imageHeight = '200px';
const imageWidth = '400px';
const captchaCodeLength = 6;

// Server config
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// Creates and returns base64 encoded PNG Captcha image data, writes the Captcha code to the session
app.get('/create', function(req, res) {
    const captcha = svgCaptcha.create({size: captchaCodeLength});
    req.session.captchaCode = captcha.text;

    // convert the SVG to PNG
    svg2png(captcha.data, { width: imageWidth, height: imageHeight })
        .then(buffer => {
            return res.status(200).json({
                success: true,
                data: new Buffer(buffer).toString('base64')
            });
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                message: error
            });
        });
});

// verifies a Captcha code against the code stored in the session
app.post('/verify', function(req, res) {
    req.checkBody('code', 'Invalid code').isAlphanumeric().isLength({min: 6, max: 6});

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            res.status(400).json({success: false, message: result.array()});
        } else {
            // verify the Captcha code stored in the session
            if (req.session.captchaCode !== undefined && req.session.captchaCode === req.body.code) {
                delete req.session.captchaCode;
                return res.status(200).json({
                    success: true,
                    message: 'Code is valid'
                });
            }
            
            delete req.session.captchaCode;
            return res.status(401).json({
                success: false,
                message: 'Invalid code'
            });
        }
    });
});

app.listen(port);
console.log('Captcha server running at http://localhost:' + port);

module.exports = app; // for testing
