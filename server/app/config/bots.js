// helpers/isBot.js
const BOT_AGENTS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'slurp',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'embedly',
  'baiduspider',
  'pinterest',
  'slackbot',
  'vkShare',
  'facebot',
  'outbrain',
  'whatsapp'
];

const botRegex = new RegExp(BOT_AGENTS.join('|'), 'i');

function isBot(userAgent) {
  if (!userAgent) return false;
  return botRegex.test(userAgent);
}

module.exports = isBot; 