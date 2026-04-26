#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");

loadEnvFile(join(projectRoot, ".env"));
loadEnvFile(join(projectRoot, ".env.local"));

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const directusUrl = normalizeUrl(
  process.env.DIRECTUS_URL || process.env.NUXT_PUBLIC_DIRECTUS_URL,
);
const directusToken =
  process.env.DIRECTUS_TOKEN || process.env.NUXT_PUBLIC_DIRECTUS_TOKEN;
const guestCollection =
  process.env.TELEGRAM_GUEST_COLLECTION ||
  process.env.NUXT_PUBLIC_DIRECTUS_GUESTS_COLLECTION ||
  "guests1";
const siteUrl = normalizeUrl(
  process.env.PUBLIC_SITE_URL || process.env.NUXT_PUBLIC_SITE_URL,
);
const allowedChatIds = parseAllowedChatIds(
  process.env.TELEGRAM_ALLOWED_CHAT_IDS,
);

if (!telegramToken) fail("Missing TELEGRAM_BOT_TOKEN.");
if (!directusUrl) fail("Missing DIRECTUS_URL or NUXT_PUBLIC_DIRECTUS_URL.");
if (!directusToken)
  fail("Missing DIRECTUS_TOKEN or NUXT_PUBLIC_DIRECTUS_TOKEN.");
if (!siteUrl)
  fail("Missing PUBLIC_SITE_URL, for example https://piseth-sreypich.site.");

let offset = Number(process.env.TELEGRAM_UPDATE_OFFSET || 0);

log(`Bot started. Creating guests in ${guestCollection}.`);
log(`Guest links will use ${siteUrl}/guest/{id}.`);

while (true) {
  try {
    const updates = await telegram("getUpdates", {
      offset,
      timeout: 50,
      allowed_updates: ["message"],
    });

    for (const update of updates) {
      offset = update.update_id + 1;
      await handleUpdate(update);
    }
  } catch (error) {
    console.error("[telegram-guest-bot]", error.message);
    await sleep(3000);
  }
}

async function handleUpdate(update) {
  const message = update.message;
  if (!message?.chat?.id) return;

  const chatId = message.chat.id;
  if (allowedChatIds.size && !allowedChatIds.has(String(chatId))) {
    await sendMessage(chatId, "This bot is not enabled for this chat.");
    return;
  }

  const text = String(message.text || "").trim();
  if (!text) {
    await sendMessage(chatId, "Please send the guest name as text.");
    return;
  }

  if (text === "/start" || text === "/help") {
    await sendMessage(
      chatId,
      "Send me a guest name. I will create it in Directus and reply with the invitation link.",
    );
    return;
  }

  if (text.startsWith("/")) {
    await sendMessage(chatId, "Unknown command. Send only the guest name.");
    return;
  }

  await sendChatAction(chatId, "typing");

  try {
    const guest = await createGuest(text);
    if (!guest?.id) {
      throw new Error("Directus did not return a guest id.");
    }

    const guestUrl = `${siteUrl}/guest/${guest.id}`;
    await sendMessage(chatId, `${guestUrl}`);
    log(`Created ${guest.id} for "${text}".`);
  } catch (error) {
    console.error("[telegram-guest-bot]", error.message);
    await sendMessage(
      chatId,
      `Could not create guest "${text}". Please check the server logs.`,
    );
  }
}

async function createGuest(name) {
  const payload = {
    name_km: name,
  };

  const response = await fetch(`${directusUrl}/items/${guestCollection}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${directusToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Directus create failed: ${response.status} ${body}`);
  }

  const json = await response.json();
  return json.data;
}

async function telegram(method, payload) {
  const response = await fetch(
    `https://api.telegram.org/bot${telegramToken}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram ${method} failed: ${response.status} ${body}`);
  }

  const json = await response.json();
  if (!json.ok) {
    throw new Error(`Telegram ${method} failed: ${JSON.stringify(json)}`);
  }

  return json.result;
}

function sendMessage(chatId, text) {
  return telegram("sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: false,
  });
}

function sendChatAction(chatId, action) {
  return telegram("sendChatAction", {
    chat_id: chatId,
    action,
  });
}

function parseAllowedChatIds(value) {
  return new Set(
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function normalizeUrl(value) {
  if (!value) return "";
  return value.replace(/\/+$/, "");
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue
      .trim()
      .replace(/^['"]|['"]$/g, "")
      .replace(/\\n/g, "\n");
  }
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function log(message) {
  console.log(`[telegram-guest-bot] ${message}`);
}

function fail(message) {
  console.error(`[telegram-guest-bot] ${message}`);
  process.exit(1);
}
