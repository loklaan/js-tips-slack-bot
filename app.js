'use strict';

require( 'dotenv' ).config();

var SlackBot = require( 'slackbots' );
var ghget    = require( 'github-get' );
var persist  = require( './persist.js' );

var bot = new SlackBot( {
  token : process.env.SLACK_TOKEN,
  name  : 'JS Tips'
} );

var ghOptions = {
  token : process.env.GH_TOKEN
};

var interval          = 7200000;
var TITLE_PLACEHOLDER = '_TITLE';
var URL_PLACEHOLDER   = '_URL';
var defaultTemplate   = `*Title:* \`${TITLE_PLACEHOLDER}\`\n\n*URL:* ${URL_PLACEHOLDER}`;
var envTemplate       = (process.env.SLACK_TEMPLATE || '')
                          .replace(/(\\n)+/, "\n");
var template          = envTemplate || defaultTemplate;

/**
 * Send the latest Js Tip
 *
 * @param  {String} path - URL path to the tip gh page
 * @return {String}      - Console logged error message
 */
function sendLatestTip( path ) {
  ghget( 'loverajoel/jstips', path, ghOptions, function( err, jsTip ) {
    if ( err ) {
      return console.warn( err );
    }

    var title = jsTip.content.substring(
      jsTip.content.indexOf( 'tip-tldr:' ) + 9, jsTip.content.indexOf( 'categories:' )
    ).trim();
    var url = jsTip[ 'html_url' ];
    var message = template
      .replace(TITLE_PLACEHOLDER, title)
      .replace(URL_PLACEHOLDER, url)
      .replace(/(\\n)+/, "\n");

    bot.on( 'open', function() {
      var params = {
        icon_url : 'https://raw.githubusercontent.com/radibit/js-tips-slack-bot/master/images/jstips-logo.png'
      };

      switch( process.env.SLACK_POST_TO ) {
        case 'group':
          bot.postMessageToGroup( process.env.SLACK_GROUP, message, params );
          break;
        case 'channel':
          bot.postMessageToChannel( process.env.SLACK_GROUP, message, params );
          break;
        default:
          bot.postMessageToGroup( process.env.SLACK_GROUP, message, params );
      }
    } );

  } );
}

/**
 * Get the latest JS Tip from the list of all available tips
 *
 * @return {String} - Console logged error message
 */
function getLatestTip() {
  ghget( 'loverajoel/jstips', '/_posts/en/', ghOptions, function( err, filenames ) {
    if ( err ) {
      return console.warn( err );
    }

    var newJsTip = filenames[ filenames.length - 1 ];
    persist.getLastTip().then(oldJsTip => {
      if ( newJsTip.path !== oldJsTip.path ) {
        persist.setLastTip(newJsTip);

        sendLatestTip( newJsTip.path );
      }
    });
  } );
}

getLatestTip();

setInterval( getLatestTip, interval );
