import express from "express";
import asyncHandler from "express-async-handler";
import puppeteer, { Browser } from "puppeteer";

export const fbRouter = express.Router();
let browser: Browser;
let page: any;
let isInit = false;

const initPuppeter = async () => {
  browser = await puppeteer.launch({
    headless: config.headless,
    defaultViewport: null,
    args: ["--incognito"], // Passing in the flag here
  });

  const [browserPage] = await browser.pages();
  page = browserPage;
  isInit = true;
};

const loginFacebook = async (user_name: string, password: string) => {
  await initPuppeter();

  const loginResponse = { authenticated: false, user: false, success: false };

  await page.goto(config.base_url, { waitUntil: "networkidle2" });

  await page.waitForSelector(config.username_field, {
    timeout: config.response_timeout,
  });

  await page.type(config.username_field, user_name, { delay: 50 });
  await page.type(config.password_field, password, { delay: 50 });
  await page.click(config.login_button);
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  const bodyString = bodyHTML.toString();

  if (
    bodyString.includes(config.username_invalid_msg) ||
    bodyString.includes(config.username_invalid_msg2) ||
    bodyString.includes(config.username_invalid_msg3) ||
    bodyString.includes(config.username_invalid_msg4)
  ) {
    loginResponse.authenticated = false;
    loginResponse.user = false;
  } else if (
    bodyString.includes(config.password_invalid_msg) ||
    bodyString.includes(config.password_invalid_msg2)
  ) {
    loginResponse.authenticated = false;
    loginResponse.user = true;
  } else if (
    bodyString.includes(config.credentials_invalid_msg_01) ||
    bodyString.includes(config.credentials_invalid_msg_02)
  ) {
    loginResponse.authenticated = false;
    loginResponse.user = false;
  } else {
    if (!bodyString.includes(config.password_field)) {
      console.log("success");
      loginResponse.success = true;
      loginResponse.user = true;
      loginResponse.authenticated = true;
    } else {
      console.log("fail");
    }
  }
  await page.waitForTimeout(500 + Math.floor(Math.random() * 500));
  return loginResponse;
};

const scrapeInfiniteScrollItems = async () => {
  let items = [];
  let flag = true;
  while (flag) {
    items = await page.evaluate(() => {
      const items: HTMLDivElement[] = Array.from(
        document.querySelectorAll("div[role='listitem']")
      );
      return items.map((item) => item.innerText.split("\n")[0]);
    });
    const previousHeight = await page.evaluate("document.body.scrollHeight");
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    // await page.waitForFunction(
    //   `document.body.scrollHeight > ${previousHeight}`
    // );

    await page.waitForTimeout(1500);

    console.log(
      (await page.evaluate("document.body.scrollHeight")) - previousHeight
    );

    if (previousHeight >= (await page.evaluate("document.body.scrollHeight"))) {
      flag = false;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return items;
};

const getGroups = async () => {
  if (!isInit) {
    await initPuppeter();
  }
  await page.goto("https://www.facebook.com/groups/joins/");
  const items = await scrapeInfiniteScrollItems();
  console.log(items);
  return items;
};

fbRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const details = await loginFacebook(userName, password);
    let items: any;
    if (details.authenticated && details.success && details.user) {
      // eslint-disable-next-line prefer-const
      items = await getGroups();
    }
    await browser.close();

    res.status(201).json({ details, items });
  })
);

const config = {
  response_timeout: 10000,
  headless: false,
  base_url: "https://www.facebook.com/",
  username_field: 'input[name="email"]',
  password_field: 'input[name="pass"]',
  login_button: 'button[type="submit"]',
  username_invalid_msg:
    "The email address or mobile number you entered isn't connected to an account.",
  username_invalid_msg2: "The email you entered isn’t connected to an account",
  username_invalid_msg3:
    "The mobile number you entered isn’t connected to an account.",
  username_invalid_msg4:
    "The email or mobile number you entered isn’t connected to an account. ",

  password_invalid_msg: "The password that you've entered is incorrect",
  password_invalid_msg2: "The password you entered is incorrect.",
  credentials_invalid_msg_01: "Wrong Credentials",
  credentials_invalid_msg_02: "Invalid username or password",
  regex_remove_non_numeric: /[^0-9]/g,
  page_end_msg: "search results only include things visible to you.",
  page_not_available_msg: "this page isn't available",
  content_not_available_msg: "this content isn't available right now",
  content_not_available_msg_02: "this content isn't available at the moment",
  content_not_available_msg_03: "we didn't find anything",
  user_profile_check_msg: "add friend",
  no_results_msg: "we didn't find any results",
  end_of_results: "end of results",
  date_time_format: "DD/MM/YYYY HH:mm:ss",
  close_button_selector: "div[aria-label='Close']",
  seven_days_timestamp: 7 * 24 * 60 * 60 * 1000,
  login_button_name: "log in",
  public_post_exclude_keyword: "see all public posts for",
};
