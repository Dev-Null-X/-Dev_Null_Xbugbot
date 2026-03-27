<p align="center">
  <img src="https://files.catbox.moe/dkxoeu.jpg" alt="Ultimate Bot Banner" width="100%">
</p>

# 🤖 Ultimate Telegram x WhatsApp Bot

Welcome to the **Ultimate Telegram x WhatsApp Bot** repository! This is a powerful, feature-rich Node.js bot that connects WhatsApp with Telegram, offering advanced system monitoring, media handling, and seamless 24/7 deployment.

<p align="center">
  <a href="https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME">
    <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render">
  </a>
</p>

---

## ✨ Key Features

* **WhatsApp Pairing:** Easy `/pair` command for quick session creation and management.
* **Custom `/start` Command:** Welcomes users with an interactive menu, buttons, credits, and URL-based image support (no local file storage required!).
* **100% Free Access:** No premium-only restrictions. All powerful commands, including `/addping`, are completely unlocked for all users.
* **System Monitoring:** Check live CPU, RAM, and server stats using `.systeminfo`.
* **24/7 No-Sleep Logic:** Built-in Express server to keep the bot awake on platforms like Render. 
* **Media Downloading:** Fast and efficient handlers for downloading and sending media.

---

## 🚀 Manual Deployment on Render (Free 24/7 Hosting)

If you don't want to use the Deploy button above, follow these steps:

### Step 1: Fork this Repository
Click the **Fork** button at the top right of this page to copy this project to your own GitHub account.

### Step 2: Create a Web Service on Render
1. Go to [Render.com](https://render.com/) and create a free account.
2. Click on **New +** and select **Web Service**.
3. Connect your GitHub account and select your forked repository.

### Step 3: Configure Deployment Settings
* **Name:** `your-bot-name`
* **Region:** Select any closest region.
* **Environment:** `Node`
* **Build Command:** `npm install`
* **Start Command:** `node index.js`

### Step 4: Add Environment Variables
Scroll down to **Environment Variables** and add the following keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| `BOT_TOKEN` | `your_telegram_bot_token` | Get this from @BotFather on Telegram |
| `OWNER_ID` | `your_telegram_id` | Your personal Telegram User ID |
| `PORT` | `3000` | Port for the Keep-Alive Express server |

Click **Create Web Service** and wait for the deployment to finish!

---

## 🛠️ Keep-Alive Setup (Important)
Since Render's free tier sleeps after 15 minutes of inactivity, copy your Render Web Service URL (e.g., `https://your-bot-name.onrender.com`) and add it to a free cron job service like [Cron-job.org](https://cron-job.org/). Set it to ping every 5-10 minutes.

---

## 📜 Available Commands

* `/start` - Initialize the bot, view features and credits.
* `/pair` - Generate a pairing code for WhatsApp.
* `/addping` - Add a URL to keep it active (Free for all users!).
* `.ping` - Check the bot's response time and speed.
* `.systeminfo` - Display server information, CPU, and RAM usage.
* `.uptime` - Check how long the bot has been running.

---

## 👨‍💻 Credits & Support

* Developed by: **@Dev_Null_X**
* If you find this project helpful, don't forget to give it a ⭐ on GitHub!
