// ==========================================
// 1. MODULES & IMPORTS
// ==========================================
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const crypto = require('crypto');
const moment = require('moment-timezone');
const cron = require('node-cron');
const NodeCache = require("node-cache");
const ytdl = require('@distube/ytdl-core'); // 🔥 NEW: Without API YT Downloader
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('🚀 @Dev_Null_X System is Online!'));
app.listen(process.env.PORT || 3000, () => console.log('Web Server Active!'));

// Local Helpers
const { loadJSON, saveJSON, ensureDir, runtime, getBuffer } = require('./helper/function');
const { validatePhoneNumber, formatPairingCode } = require('./helper/generate');
const { logTelegram, logBanner, logSystem } = require('./helper/logger');
const config = require('./settings');

// 🛡️ 
const _0xBrand = Buffer.from('QERldl9OdWxsX1g=', 'base64').toString('utf-8');
const _0xYT = Buffer.from('aHR0cHM6Ly93d3cueW91dHViZS5jb20vQERldl9OdWxsX1g=', 'base64').toString('utf-8');
const _0xTG = Buffer.from('aHR0cHM6Ly90Lm1lL0Rldl9OdWxsX1hfTk9ERV9KUw==', 'base64').toString('utf-8');

// ==========================================
// 2. GLOBAL CACHES & INITIALIZATION
// ==========================================
const bot = new TelegramBot(config.telegramToken, { polling: true });

const membershipCache = new NodeCache({ stdTTL: 300 });
const pairingCodes = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const rateLimits = new Map();
const groupDb = new Map();
const afkStorage = new Map();

const RATE_LIMIT_WINDOW = 15000; // 15 sec
const MAX_COMMANDS_PER_WINDOW = 3;
const OWNER_ID = config.telegramOwner; 

ensureDir('./database');
ensureDir('./database/sessions');

const premiumUsers = loadJSON('./database/premium.json', []);
const pairingSessions = loadJSON('./database/paired.json', []);
const settings = loadJSON('./database/settings.json', { 
  premiumOnly: false,
  publicMode: true,
  selfMode: false
});

const saveData = () => {
  saveJSON('./database/premium.json', premiumUsers);
  saveJSON('./database/paired.json', pairingSessions);
  saveJSON('./database/settings.json', settings);
};

const isOwner = (userId) => userId.toString() === OWNER_ID.toString();
const isPremium = (userId) => premiumUsers.includes(userId) || isOwner(userId);

// ==========================================
// 3. UTILITY FUNCTIONS
// ==========================================
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function checkRateLimit(senderId, chatId) {
  const now = Date.now();
  let data = rateLimits.get(senderId);

  if (!data || now - data.lastReset > RATE_LIMIT_WINDOW) {
    rateLimits.set(senderId, { count:1, lastReset:now });
    return true;
  }

  if (data.count >= MAX_COMMANDS_PER_WINDOW) {
    bot.sendMessage(chatId, `⏰ Slow down!\nTry again in ${Math.ceil((RATE_LIMIT_WINDOW - (now - data.lastReset))/1000)} sec`);
    return false;
  }

  data.count++;
  return true;
}

// 🛡
async function checkMembership(chatId, senderId, bot) {
  if (isOwner(senderId)) return { isMember: true };

  const cacheKey = `${senderId}:membership`;
  const cached = membershipCache.get(cacheKey);
  if (cached !== undefined) return { isMember: cached };

  try {
    const channel = await bot.getChatMember(config.CHANNEL_ID, senderId);
    const group = await bot.getChatMember(config.GROUP_ID, senderId);

    const ok1 = ['member','administrator','creator'].includes(channel.status);
    const ok2 = ['member','administrator','creator'].includes(group.status);

    if (ok1 && ok2) {
      membershipCache.set(cacheKey, true);
      return { isMember: true };
    }

    await bot.sendMessage(chatId,
`┏━━━━━━━━━━━━━━━━━━━━━
┃ 🚫 <b>ACCESS DENIED</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ To use ${_0xBrand} Bot, you must join:
┃ ✔ <a href="${config.CHANNEL_LINK}">Official Channel</a>
┃ ✔ <a href="${config.GROUP_LINK}">Official Group</a>
┃ ✔ <a href="${config.YOUTUBE_LINK}">Subscribe YouTube</a>
┗━━━━━━━━━━━━━━━━━━━━━
<i>After joining, type: /checkmembership</i>`,
    {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup:{
        inline_keyboard:[
          [{ text:"📢 Join Channel", url:config.CHANNEL_LINK }],
          [{ text:"👥 Join Group", url:config.GROUP_LINK }],
          [{ text:"🎥 Subscribe YouTube", url:config.YOUTUBE_LINK }], 
          [{ text:"🔄 Verify Membership", callback_data: "check_joined" }]
        ]
      }
    });

    membershipCache.set(cacheKey, false);
    return { isMember:false };

  } catch(err) {
    console.error("Membership Error:", err.message);
    return { isMember:false }; 
  }
}


// ==========================================
// 4. COMMANDS: MENU & INFO
// ==========================================
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageId = msg.message_id;

  const mem = await checkMembership(chatId, userId, bot);
  if (!mem.isMember) return;

  // 🔥 Fire Animation Emoji
  try {
      await axios.post(`https://api.telegram.org/bot${config.telegramToken}/setMessageReaction`, {
          chat_id: chatId,
          message_id: messageId,
          reaction: [{ type: 'custom_emoji', custom_emoji_id: "5104841245755180586" }]
      });
  } catch (err) {}

  const welcomeText = `<tg-emoji emoji-id="5104841245755180586">🔥</tg-emoji>
┏━━━━━━━━━━━━━━━━━━━━━
┃ 🚀 <b>${_0xBrand} SYSTEM</b>
┃ <i>Ultimate Telegram x WA Bot</i>
┣━━━━━━━━━━━━━━━━━━━━━
┃ 👑 <b>Owner:</b> ${_0xBrand}
┃ 👤 <b>User:</b> @${msg.from.username || 'User'}
┃ 💎 <b>Premium:</b> ${isPremium(userId) ? 'Yes ✅' : 'No ❌'}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📺 <b>YouTube:</b> <a href="${_0xYT}">Subscribe</a>
┃ ✈️ <b>Telegram:</b> <a href="${_0xTG}">Join Us</a>
┗━━━━━━━━━━━━━━━━━━━━━
<i>Select a menu category below:</i>`;

  // 🛡️ COPYRIGHT CHECK
  if (!welcomeText.includes(_0xBrand)) {
      process.exit(1);
  }

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📱 WA Menu", callback_data: "wa_menu" },
          { text: "📥 DL Menu", callback_data: "dl_menu" }
        ],
        [
          { text: "⚙️ Owner Menu", callback_data: "owner_menu" },
          { text: "📋 Help", callback_data: "help_menu" }
        ],
        [{ text: "👤 Contact Developer", url: "https://t.me/Dev_Null_X" }]
      ]
    }
  };

  try {
    const imageBuffer = await getBuffer(config.connectionImage);
    if (imageBuffer) {
      bot.sendPhoto(chatId, imageBuffer, { caption: welcomeText, parse_mode: 'HTML', ...inlineKeyboard });
    } else {
      bot.sendMessage(chatId, welcomeText, { parse_mode: 'HTML', disable_web_page_preview: true, ...inlineKeyboard });
    }
  } catch (error) {
    bot.sendMessage(chatId, welcomeText, { parse_mode: 'HTML', disable_web_page_preview: true, ...inlineKeyboard });
  }
});

bot.onText(/\/checkmembership/, async (msg)=>{
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  membershipCache.del(`${senderId}:membership`); 
  const mem = await checkMembership(chatId, senderId, bot);
  if(mem.isMember) bot.sendMessage(chatId, `✅ <b>Membership Verified!</b> Welcome to ${_0xBrand}.`, { parse_mode: 'HTML' });
});

// ==========================================
// 5. GLOBAL MESSAGE HANDLER (ORIGINAL TEXT BUTTONS)
// ==========================================
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  
  if (text) {
    logTelegram({
      userId: userId,
      username: msg.from.username,
      firstName: msg.from.first_name || 'Unknown',
      action: msg.chat.type === 'private' ? 'Direct Message' : `Group: ${msg.chat.title || 'Unknown'}`,
      message: text,
      messageType: 'text'
    });
  }
  
  if (!text || text.startsWith('/')) return;
  
  // Mode Checks
  if (settings.selfMode && !isOwner(userId)) return;
  if (!settings.publicMode && !isOwner(userId) && !isPremium(userId)) return;

  if (text === '📱 Pair Device') {
    if (settings.premiumOnly && !isPremium(userId)) {
      return bot.sendMessage(chatId, '❌ Pairing is currently available for premium users only!');
    }
    bot.sendMessage(chatId, '📱 <b>Enter phone number:</b>\n\n<i>Format: /pair 91xxxxxx</i>', { parse_mode: 'HTML' });
  }
  else if (text === '🗑️ Delete Pair') {
    bot.sendMessage(chatId, '🗑️ <b>Enter phone number to delete:</b>\n\n<i>Format: /delpair 91xxxxxx</i>', { parse_mode: 'HTML' });
  }
  else if (text === '👤 My Info') {
    const infoText = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ 👤 <b>YOUR PROFILE</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>ID:</b> <code>${userId}</code>
┃ <b>Username:</b> @${msg.from.username || 'N/A'}
┃ <b>Premium:</b> ${isPremium(userId) ? '✅ Yes' : '❌ No'}
┃ <b>Owner:</b> ${isOwner(userId) ? '✅ Yes' : '❌ No'}
┗━━━━━━━━━━━━━━━━━━━━━`;
    bot.sendMessage(chatId, infoText, { parse_mode: 'HTML' });
  }
  else if (text === '💎 Premium') {
    const premText = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ 💎 <b>PREMIUM INFO</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Status:</b> ${isPremium(userId) ? '✅ Premium' : '❌ Free'}
┃ <b>Premium Mode:</b> ${settings.premiumOnly ? '🔒 ON' : '🔓 OFF'}
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Benefits:</b>
┃ • Pair multiple devices
┃ • Access downloaders (/ig, /ytmp3)
┃ • Priority support
┗━━━━━━━━━━━━━━━━━━━━━`;
    bot.sendMessage(chatId, premText, { parse_mode: 'HTML' });
  }
  else if (text === '⚙️ Owner Menu') {
    if (!isOwner(userId)) return bot.sendMessage(chatId, '❌ This menu is owner only!');
    const currentPremium = loadJSON('./database/premium.json', []);
    const currentSessions = loadJSON('./database/paired.json', []);
    const currentSettings = loadJSON('./database/settings.json', { premiumOnly: false });
    
    const ownerText = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ ⚙️ <b>OWNER MENU</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Premium Users:</b> ${currentPremium.length}
┃ <b>Paired Sessions:</b> ${currentSessions.length}
┃ <b>Premium Mode:</b> ${currentSettings.premiumOnly ? '🔒 ON' : '🔓 OFF'}
┣━━━━━━━━━━━━━━━━━━━━━
┃ /addprem [id] - Add premium
┃ /delprem [id] - Remove premium
┃ /premium on/off - Toggle VIP
┃ /listpaired - All sessions
┃ /listsessions - My sessions
┗━━━━━━━━━━━━━━━━━━━━━`;
    bot.sendMessage(chatId, ownerText, { parse_mode: 'HTML' });
  }
  else if (text === '📋 Help') {
    const helpText = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ 📋 <b>COMMAND LIST</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>General:</b>
┃ /start - Start bot
┃ /myid - Your info
┃ /help - This message
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Pairing:</b>
┃ /pair [num] - Pair device
┃ /delpair [num] - Delete pair
┃ /listsessions - Your sessions
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Downloaders:</b>
┃ /ig [link] - IG Video
┃ /yt [link] - YT Direct DL (MP3/MP4)
┃ /ytmp3 [link] - YT Audio
┃ /ytmp4 [link] - YT Video
┗━━━━━━━━━━━━━━━━━━━━━`;
    bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
  }
  else if (text === '📡 Channel') {
    bot.sendMessage(chatId, `📡 Join our channel: ${config.CHANNEL_LINK}`);
  }
  else if (text === '💬 Owner Contact') {
    bot.sendMessage(chatId, `💬 Contact owner: @${config.owner}`);
  }
});

// ==========================================
// 6. DOWNLOADER COMMANDS (IG, YTMP3, YTMP4, YT-Direct)
// ==========================================

// 🔥 NEW: DIRECT YT DOWNLOADER (Without API)
bot.onText(/\/yt(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isPremium(userId)) return bot.sendMessage(chatId, "❌ Premium users only!");

  const url = (match[1] || "").trim();

  if (!url || !ytdl.validateURL(url)) {
    return bot.sendMessage(chatId, "🪧 <b>Format:</b>\n<code>/yt https://youtu.be/xxxx</code>\n\n<i>Example: /yt https://www.youtube.com/watch?v=dQw4w9WgXcQ</i>", {parse_mode: 'HTML'});
  }

  try {
    const videoId = ytdl.getURLVideoID(url);

    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🎵 Audio (MP3)", callback_data: `dl_mp3_${videoId}` },
            { text: "🎬 Video (MP4)", callback_data: `dl_mp4_${videoId}` }
          ]
        ]
      },
      parse_mode: 'HTML'
    };

    bot.sendMessage(chatId, `📥 <b>YouTube Direct Downloader</b>\n\nLink valid hai! Format select karein:`, options);
  } catch (err) {
    bot.sendMessage(chatId, "❌ Invalid YouTube Link!");
  }
});

// (Original Downloader Commands Below)
bot.onText(/\/ig(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    if (!isPremium(userId)) return bot.sendMessage(chatId, "❌ Premium users only!");

    const urlInput = (match[1] || "").trim();
    if (!urlInput) return bot.sendMessage(chatId, "🪧 Format:\n<code>/ig https://www.instagram.com/reel/xxxx</code>", {parse_mode: 'HTML'});

    let url = urlInput.split("?")[0];
    if (!/^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\/.+/i.test(url)) {
      return bot.sendMessage(chatId, "❌ Invalid Instagram URL!");
    }

    const waitMsg = await bot.sendMessage(chatId, "⏳ Downloading IG video...");
    let mediaUrl = null;

    try {
      const res1 = await axios.get("https://api-faa.my.id/faa/igdl?url=" + encodeURIComponent(url), { timeout: 30000 });
      mediaUrl = res1.data?.result?.video?.[0] || res1.data?.result?.video || res1.data?.result?.url || null;
    } catch (e) {}

    if (!mediaUrl) {
      try {
        const res2 = await axios.get("https://api.princetechn.com/api/download/instadl?apikey=prince&url=" + encodeURIComponent(url), { timeout: 30000 });
        mediaUrl = res2.data?.result?.video?.[0] || res2.data?.result?.video || res2.data?.result?.url || res2.data?.url || null;
      } catch (e) {}
    }

    if (!mediaUrl) throw new Error("All APIs failed");

    const videoRes = await axios.get(mediaUrl, { responseType: "arraybuffer", timeout: 60000, maxRedirects: 5 });
    const buffer = Buffer.from(videoRes.data);

    if (buffer.length > 50 * 1024 * 1024) {
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(()=>{});
      return bot.sendMessage(chatId, "❌ File too large (Max 50MB)");
    }

    await bot.deleteMessage(chatId, waitMsg.message_id).catch(()=>{});
    await bot.sendVideo(chatId, buffer, { caption: `✅ IG Video Downloaded via ${_0xBrand}` });

  } catch (err) {
    bot.sendMessage(chatId, "❌ Download failed. Link invalid or API down.");
  }
});

bot.onText(/\/ytmp3(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  try {
    if (!isPremium(senderId)) return bot.sendMessage(chatId, "❌ Premium users only!");

    const url = (match[1] || "").trim();
    if (!url) return bot.sendMessage(chatId, "🪧 Format:\n<code>/ytmp3 https://youtube.com/watch?v=xxxx</code>", {parse_mode: 'HTML'});

    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i.test(url)) return bot.sendMessage(chatId, "❌ Invalid YouTube URL.");

    const waitMsg = await bot.sendMessage(chatId, "⏳ Converting to MP3...");
    let audioUrl = null, title = "YouTube Audio";

    try {
      const res1 = await axios.get("https://api.princetechn.com/api/download/yta?apikey=prince&url=" + encodeURIComponent(url), { timeout: 30000 });
      if (res1.data?.status && res1.data?.result?.url) {
        audioUrl = res1.data.result.url;
        title = res1.data.result.title || title;
      }
    } catch (e) {}

    if (!audioUrl) {
      try {
        const res2 = await axios.get("https://api.princetechn.com/api/download/mp3?apikey=prince&url=" + encodeURIComponent(url), { timeout: 30000 });
        audioUrl = res2.data?.result?.url || res2.data?.url || res2.data?.download_url;
        title = res2.data?.title || title;
      } catch (e) {}
    }

    if (!audioUrl) throw new Error("All APIs failed");

    const audioResponse = await axios.get(audioUrl, { responseType: "arraybuffer", timeout: 60000, maxRedirects: 5 });
    const buffer = Buffer.from(audioResponse.data);

    if (buffer.length > 50 * 1024 * 1024) {
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(()=>{});
      return bot.sendMessage(chatId, "❌ File too large (Max 50MB)");
    }

    await bot.deleteMessage(chatId, waitMsg.message_id).catch(()=>{});
    await bot.sendAudio(chatId, buffer, { caption: `🎵 ${title}\n© ${_0xBrand}`, title: title, performer: "YouTube" });

  } catch (err) {
    bot.sendMessage(chatId, "❌ Download failed.\nAPI limit ya link invalid ho sakta hai.");
  }
});

bot.onText(/\/ytmp4(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  try {
    if (!isPremium(senderId)) return bot.sendMessage(chatId, "❌ Premium users only!");

    const input = (match[1] || "").trim();
    if (!input) return bot.sendMessage(chatId, "Use aise karo:\n<code>/ytmp4 https://youtu.be/xxxx 720</code>\nQuality: 360 ya 720", {parse_mode: 'HTML'});

    const args = input.split(" ");
    let url = args[0].split("&")[0].trim();
    const quality = args[1] === "720" ? "720" : "360";

    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i.test(url)) return bot.sendMessage(chatId, "❌ Ye valid YouTube URL nahi hai.");

    const waitMsg = await bot.sendMessage(chatId, `⏳ Video fetch ho raha hai (${quality}p)...`);
    const apiUrl = "https://ikyyzyyrestapi.my.id/download/ytmp4?url=" + encodeURIComponent(url);

    const { data } = await axios.get(apiUrl, { timeout: 30000 });
    if (!data || data.status !== true || !data.result) throw new Error("API response invalid");

    const result = data.result;
    const title = result.title || "YouTube Video";
    let videoUrl = result[`${quality}p`] || result[`download_${quality}`] || result.download;

    if (!videoUrl) throw new Error("Video link missing");

    try {
      const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer", timeout: 60000, maxRedirects: 5 });
      const buffer = Buffer.from(videoResponse.data);

      if (buffer.length > 50 * 1024 * 1024) throw new Error("File too big");

      await bot.deleteMessage(chatId, waitMsg.message_id).catch(()=>{});
      return bot.sendVideo(chatId, buffer, { caption: `🎬 ${title}\nQuality: ${quality}p\n© ${_0xBrand}`, supports_streaming: true });

    } catch {
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(()=>{});
      return bot.sendVideo(chatId, videoUrl, { caption: `🎬 ${title}\nQuality: ${quality}p\n🚀 Direct Stream\n© ${_0xBrand}`, supports_streaming: true });
    }
  } catch (err) {
    bot.sendMessage(chatId, "❌ Download fail ho gaya.\nAPI limit ya file size issue ho sakta hai.");
  }
});

// ==========================================
// 7. ACCOUNT & PAIRING COMMANDS
// ==========================================
bot.onText(/\/myid/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const text = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ 👤 <b>YOUR INFO</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>User ID:</b> <code>${userId}</code>
┃ <b>Username:</b> @${msg.from.username || 'N/A'}
┃ <b>Name:</b> ${msg.from.first_name || 'Unknown'}
┃ <b>Premium:</b> ${isPremium(userId) ? '✅ Yes' : '❌ No'}
┃ <b>Owner:</b> ${isOwner(userId) ? '✅ Yes' : '❌ No'}
┗━━━━━━━━━━━━━━━━━━━━━`;
  bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
});

bot.onText(/\/pair (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const phoneNumber = match[1];
  
  if (settings.premiumOnly && !isPremium(userId)) return bot.sendMessage(chatId, '❌ Pairing is currently available for premium users only!');
  
  const validNumber = validatePhoneNumber(phoneNumber);
  if (!validNumber) return bot.sendMessage(chatId, '❌ Invalid phone number!\n\n<b>Usage:</b> /pair 91xxxxxx', { parse_mode: 'HTML' });
  
  const currentSessions = loadJSON('./database/paired.json', []);
  if (currentSessions.find(s => s.number === validNumber)) return bot.sendMessage(chatId, '⚠️ This number is already paired!');
  
  bot.sendMessage(chatId, '⏳ Generating pairing code...');
  
  try {
    const WAConnection = require('./whatsapp');
    const code = await WAConnection.requestPairingCode(validNumber, userId);
    
    if (code) {
      const formattedCode = formatPairingCode(code);
      pairingCodes.set(formattedCode, { count: 0, phoneNumber: validNumber, userId });
      
      const text = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ 📱 <b>PAIRING CODE</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Number:</b> <code>${validNumber}</code>
┃ <b>Code:</b> <code>${formattedCode}</code>
┣━━━━━━━━━━━━━━━━━━━━━
┃ <i>Tap the code to copy!</i>
┃ <i>Expires in 1 hour</i>
┗━━━━━━━━━━━━━━━━━━━━━`;
      bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
    }
  } catch (error) {
    bot.sendMessage(chatId, '❌ Failed to generate code. Try again later.');
  }
});

bot.onText(/\/delpair (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const phoneNumber = match[1];
  
  const validNumber = validatePhoneNumber(phoneNumber);
  if (!validNumber) return bot.sendMessage(chatId, '❌ Invalid phone number!');
  
  let currentSessions = loadJSON('./database/paired.json', []);
  const sessionIndex = currentSessions.findIndex(s => s.number === validNumber && (s.userId === userId || isOwner(userId)));
  
  if (sessionIndex === -1) return bot.sendMessage(chatId, '❌ Session not found or no permission!');
  
  const sessionPath = `./database/sessions/${validNumber}`;
  if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true });
  
  currentSessions.splice(sessionIndex, 1);
  saveJSON('./database/paired.json', currentSessions);
  bot.sendMessage(chatId, `✅ Session deleted: <code>${validNumber}</code>`, { parse_mode: 'HTML' });
});

bot.onText(/\/listpaired/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(userId)) return bot.sendMessage(chatId, '❌ Owner only!');
  
  const currentSessions = loadJSON('./database/paired.json', []);
  if (currentSessions.length === 0) return bot.sendMessage(chatId, '📭 No paired sessions!');
  
  let text = '┏━━━━━━━━━━━━━━━━━━━━━\n┃ 📱 <b>ALL SESSIONS</b>\n┣━━━━━━━━━━━━━━━━━━━━━\n';
  currentSessions.forEach((session, i) => {
    text += `┃ <b>${i + 1}.</b> <code>${session.number}</code>\n┃ User: <code>${session.userId}</code>\n┃ Status: ${session.active ? '🟢' : '🔴'}\n┣━━━━━━━━━━━━━━━━━━━━━\n`;
  });
  text += `┃ <b>Total:</b> ${currentSessions.length}\n┗━━━━━━━━━━━━━━━━━━━━━`;
  bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
});

bot.onText(/\/listsessions/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const currentSessions = loadJSON('./database/paired.json', []);
  const userSessions = currentSessions.filter(s => s.userId === userId);
  
  if (userSessions.length === 0) return bot.sendMessage(chatId, '📭 No sessions found!');
  
  let text = '┏━━━━━━━━━━━━━━━━━━━━━\n┃ 📱 <b>YOUR SESSIONS</b>\n┣━━━━━━━━━━━━━━━━━━━━━\n';
  userSessions.forEach((session, i) => {
    text += `┃ <b>${i + 1}.</b> <code>${session.number}</code>\n┃ Status: ${session.active ? '🟢 Active' : '🔴 Inactive'}\n┣━━━━━━━━━━━━━━━━━━━━━\n`;
  });
  text += `┃ <b>Total:</b> ${userSessions.length}\n┗━━━━━━━━━━━━━━━━━━━━━`;
  bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
});

// ==========================================
// 8. ADMIN & PREMIUM COMMANDS
// ==========================================
bot.onText(/\/addprem (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(userId)) return bot.sendMessage(chatId, '❌ Owner only!');
  
  const targetId = parseInt(match[1]);
  if (isNaN(targetId)) return bot.sendMessage(chatId, '❌ Invalid user ID!\n\n<b>Usage:</b> /addprem 123456789', { parse_mode: 'HTML' });
  if (premiumUsers.includes(targetId)) return bot.sendMessage(chatId, '⚠️ User already premium!');
  
  premiumUsers.push(targetId);
  saveData();
  bot.sendMessage(chatId, `✅ Added to premium: <code>${targetId}</code>`, { parse_mode: 'HTML' });
});

bot.onText(/\/delprem (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(userId)) return bot.sendMessage(chatId, '❌ Owner only!');
  
  const targetId = parseInt(match[1]);
  if (isNaN(targetId)) return bot.sendMessage(chatId, '❌ Invalid user ID!');
  
  const index = premiumUsers.indexOf(targetId);
  if (index === -1) return bot.sendMessage(chatId, '❌ User not premium!');
  
  premiumUsers.splice(index, 1);
  saveData();
  bot.sendMessage(chatId, `✅ Removed from premium: <code>${targetId}</code>`, { parse_mode: 'HTML' });
});

bot.onText(/\/premium (on|off)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(userId)) return bot.sendMessage(chatId, '❌ Owner only!');
  
  const mode = match[1];
  settings.premiumOnly = mode === 'on';
  saveData();
  
  const status = mode === 'on' ? '🔒 ON' : '🔓 OFF';
  logSystem(`Premium Mode: ${status}`, 'success');
  bot.sendMessage(chatId, `✅ Premium mode: ${status}`);
});

bot.onText(/\/public (on|off)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(userId)) return bot.sendMessage(chatId, '❌ Owner only!');
  
  const mode = match[1];
  settings.publicMode = mode === 'on';
  settings.selfMode = false;
  saveData();
  
  const status = mode === 'on' ? '🌍 PUBLIC' : '🔒 PRIVATE';
  bot.sendMessage(chatId, `✅ Bot mode: ${status}\n\n${mode === 'on' ? 'Bot will respond to all groups and DMs' : 'Bot will only respond to owner'}`);
});

bot.onText(/\/self (on|off)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(userId)) return bot.sendMessage(chatId, '❌ Owner only!');
  
  const mode = match[1];
  settings.selfMode = mode === 'on';
  if (mode === 'on') settings.publicMode = false;
  saveData();
  
  const status = mode === 'on' ? '👤 SELF ONLY' : '🌍 PUBLIC';
  bot.sendMessage(chatId, `✅ Bot mode: ${status}\n\n${mode === 'on' ? 'Bot will only respond to owner' : 'Bot will respond to all'}`);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ 📋 <b>COMMAND LIST</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>General:</b>
┃ /start - Start bot
┃ /myid - Your info
┃ /help - This message
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Pairing:</b>
┃ /pair [num] - Pair device
┃ /delpair [num] - Delete pair
┃ /listsessions - Your sessions
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Downloaders:</b>
┃ /ig [link] - IG Video
┃ /yt [link] - YT Direct DL (MP3/MP4)
┃ /ytmp3 [link] - YT Audio
┃ /ytmp4 [link] - YT Video
┣━━━━━━━━━━━━━━━━━━━━━
┃ <b>Owner Only:</b>
┃ /addprem [id] - Add premium
┃ /delprem [id] - Remove premium
┃ /premium on/off - Toggle mode
┃ /listpaired - All sessions
┗━━━━━━━━━━━━━━━━━━━━━`;
  bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
});

// ==========================================
// 9. INLINE CALLBACK HANDLER & YT DIRECT DOWNLOAD
// ==========================================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const userId = query.from.id;

    await bot.answerCallbackQuery(query.id);

    // 🔥 NEW: DIRECT YT BACKGROUND DOWNLOADER LOGIC
    if (data.startsWith("dl_mp3_") || data.startsWith("dl_mp4_")) {
        const format = data.startsWith("dl_mp3_") ? "mp3" : "mp4";
        const videoId = data.split("_")[2];
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        // 🚀 User ko notify karo ki background me kaam shuru ho gaya hai
        const waitMsg = await bot.sendMessage(chatId, `⏳ <b>Background Download Started!</b>\n\nAb aap bot use kar sakte hain. Jab ${format.toUpperCase()} server par download ho jayega, tab auto-upload ho jayega! 🚀`, {parse_mode: 'HTML'});

        try {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, ""); // Illegal characters clean karna
            const fileName = `${videoId}.${format}`;
            const filePath = path.join(__dirname, fileName); // Server par local file path

            let stream;
            if (format === "mp3") {
                stream = ytdl(url, { quality: 'highestaudio' });
            } else {
                stream = ytdl(url, { quality: 'highest', filter: 'audioandvideo' });
            }

            // 📥 FILE KO SERVER PAR BACKGROUND ME SAVE KARNA
            const writeStream = fs.createWriteStream(filePath);
            stream.pipe(writeStream);

            // ✅ JAB DOWNLOAD POORA HO JAYE (Event Listener)
            writeStream.on('finish', async () => {
                try {
                    await bot.sendMessage(chatId, `✅ <b>Download Complete!</b>\nUploading ${format.toUpperCase()} to Telegram... ⏳`, {parse_mode: 'HTML'});
                    
                    // 📤 TELEGRAM PAR UPLOAD KARNA
                    if (format === "mp3") {
                        await bot.sendAudio(chatId, filePath, { caption: `🎵 <b>${title}</b>\n© ${_0xBrand}`, parse_mode: 'HTML' });
                    } else {
                        await bot.sendVideo(chatId, filePath, { caption: `🎬 <b>${title}</b>\n© ${_0xBrand}`, parse_mode: 'HTML' });
                    }
                    
                    // 🧹 STORAGE BACHANE KE LIYE AUTO-DELETE
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    bot.deleteMessage(chatId, waitMsg.message_id).catch(()=>{});

                } catch (uploadErr) {
                    console.error("Upload Error:", uploadErr);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    bot.sendMessage(chatId, "❌ Upload failed! File size shayad Telegram ki limit (50MB) se badi hai.");
                }
            });

            // ❌ AGAR DOWNLOAD ME KOI ERROR AAYE
            writeStream.on('error', (err) => {
                console.error("Write Error:", err);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                bot.sendMessage(chatId, "❌ Background Download Failed (Server Error)!");
            });

        } catch (err) {
            console.error("YTDL Error:", err.message);
            bot.deleteMessage(chatId, waitMsg.message_id).catch(()=>{});
            bot.sendMessage(chatId, "❌ Link process nahi ho paya!\n\n<i>(Reason: Video age-restricted ho sakti hai ya YouTube ne IP block kiya hai)</i>", {parse_mode: 'HTML'});
        }
        return;
    }


    // NORMAL MENU HANDLERS
    if (data === "wa_menu") {
        const text = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ 📱 <b>WHATSAPP MENU</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🔸 <code>/pair 91xxx</code> - Link WA Device
┃ 🔸 <code>/delpair 91xxx</code> - Unlink WA Device
┃ 🔸 <code>/listsessions</code> - View Active Sessions
┗━━━━━━━━━━━━━━━━━━━━━`;
        bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    }
    else if (data === "dl_menu") {
        const text = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ 📥 <b>DOWNLOAD MENU</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🔸 <code>/ig [link]</code> - IG Video DL
┃ 🔸 <code>/yt [link]</code> - YT Direct DL (No API)
┃ 🔸 <code>/ytmp3 [link]</code> - YT Audio DL
┃ 🔸 <code>/ytmp4 [link]</code> - YT Video DL
┗━━━━━━━━━━━━━━━━━━━━━`;
        bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    }
    else if (data === "owner_menu") {
        if (!isOwner(userId)) return bot.sendMessage(chatId, "❌ <b>Access Denied!</b> Owner Only.", { parse_mode: 'HTML' });
        const text = `
┏━━━━━━━━━━━━━━━━━━━━━
┃ ⚙️ <b>OWNER MENU</b>
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🔸 <code>/addprem [id]</code> - Add Premium
┃ 🔸 <code>/delprem [id]</code> - Remove Premium
┃ 🔸 <code>/premium on/off</code> - Toggle VIP Mode
┃ 🔸 <code>/public on/off</code> - Set Public
┃ 🔸 <code>/self on/off</code> - Set Self Mode
┃ 🔸 <code>/listpaired</code> - All WA Sessions
┗━━━━━━━━━━━━━━━━━━━━━`;
        bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    }
    else if (data === "help_menu") {
        bot.sendMessage(chatId, "Type <code>/help</code> to see all available commands.", { parse_mode: "HTML" });
    }
});

// ==========================================
// 10. ANTI-CRASH & KEEP ALIVE
// ==========================================
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Network Error handled silently.');
});
process.on('uncaughtException', (err) => {
    console.error('🚨 Exception handled silently.');
});

logBanner();
logSystem(`${_0xBrand} Telegram System Online! 🚀`, 'success');

setTimeout(async () => {
  logSystem('Loading existing WhatsApp sessions...', 'info');
  try {
    const WAConnection = require('./whatsapp');
    if (typeof WAConnection.loadExistingSessions === 'function') {
      await WAConnection.loadExistingSessions();
    }
  } catch (err) {}
}, 3000);

module.exports = bot;
