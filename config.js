require('dotenv').config();

const config = {
    token: process.env.TOKEN,
    owner: "OWNER", //Owner ID
    prefix: "PREFIX",
    //Translate System
    deepls: 1, // Deepl API System ON/OFF
    deepl: process.env.DEEPL, // DeepL API
    lang: "en", //Translate Language (Optional)



    //Image
    ship: "https://static.vecteezy.com/system/resources/previews/017/637/499/original/heart-love-background-valentine-frame-pink-hearts-background-love-background-design-illustration-valentine-background-love-heart-sweet-background-free-vector.jpg",

};

module.exports = config;
