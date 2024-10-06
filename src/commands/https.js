const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'https',
    description: 'Make a POST, GET request with JSON data to the specified URL',
    async execute(message, args) {
        const fullCommand = args.join(' ');

        const helpPattern = /-h/;
        const methodPattern = /-m\s+(\S+)/;
        const refererPattern = /-r\s+"([^"]+)"/;
        const targetPattern = /-t\s+"([^"]+)"/;
        const useragentPattern = /-u\s+"([^"]+)"/;
        const jsonPattern = /-j\s+(\{[^}]+\})/;
        
            if (fullCommand.match(helpPattern)) {
                const helpMessage = "**-t** > Target Url\n" +
                                    "**-m** > Method Type (post, get)\n" +
                                    "**-r** > Referer\n" +
                                    "**-u** > User Agent\n" +
                                    "**-j** > Send Json data (example: {'id':2})\n" +
                                    "**-h** > Show this help message";
                return message.reply(helpMessage);
            }

        const method = (fullCommand.match(methodPattern) || [])[1];
        const referer = (fullCommand.match(refererPattern) || [])[1];
        const target = (fullCommand.match(targetPattern) || [])[1];
        const useragent = (fullCommand.match(useragentPattern) || [])[1];
        const jsonData = (fullCommand.match(jsonPattern) || [])[1];

        if (!method || !target) {
            return message.reply('Error: -m and -t parameters are required.');
        }

        if (!['get', 'post'].includes(method.toLowerCase())) {
            return message.reply('Error: Method must be either GET or POST.');
        }

        try {
            let response;
            const config = {
                method: method.toLowerCase(),
                url: target,
                headers: {}
            };

            if (method.toLowerCase() === 'post' && jsonData) {
                try {
                    config.data = JSON.parse(jsonData);
                } catch (e) {
                    return message.reply('Error: Invalid JSON data provided.');
                }
            }

            if (referer) {
                config.headers['Referer'] = referer;
            }
            if(useragent) {
                config.headers['user-agent'] = useragent;
            } else {
                const userAgentFilePath = path.join(__dirname, '../../users.txt');
                const userAgents = fs.readFileSync(userAgentFilePath, 'utf-8').split('\n').filter(Boolean);

                const validUserAgents = userAgents.map(agent => agent.replace(/\r/g, ''));
                if (validUserAgents.length === 0) {
                    throw new Error('No valid User-Agent found in users.txt');
                }
                const randomIndex = Math.floor(Math.random() * validUserAgents.length);
                const randomUserAgent = validUserAgents[randomIndex].toString('utf-8');;
                console.log("User-Agent: " + randomUserAgent);
                config.headers['user-agent'] = randomUserAgent;
            }

            response = await axios(config);
            fs.writeFileSync('response.txt', JSON.stringify(response.data, null, 4));

            message.channel.send({
                files: ['response.txt']
            });
        } catch (error) {
            console.error('Error:', error);
            message.reply('An error occurred while making the request.');
        }
    },
};