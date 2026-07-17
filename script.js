/* English and Simplified Chinese text for the page */
const translations = {
  en: {
    navProjects: "Finished Projects",
    navIdeas: "Ideas In-Progress",
    navAbout: "About",
    navContact: "Contact",
    tagline: "Capibara Capital Summer 26' Intern",
    projectsTitle: "Finished Projects",
    ideasTitle: "Ideas In-Progress",
    aboutTitle: "About",
    aboutBody:
      "I'm currently a summer intern at Capibara Capital working on product design and market research. This web page is mainly used to document my ideas and skill growth throughout this summer.",
    contactTitle: "Contact",
    switchLabel: "中文",
  },
  zh: {
    navProjects: "已完成项目",
    navIdeas: "进行中的想法",
    navAbout: "关于",
    navContact: "联系",
    tagline: "Capibara Capital水豚资本 2026夏 实习生",
    projectsTitle: "已完成项目",
    ideasTitle: "进行中的想法",
    aboutTitle: "关于",
    aboutBody: "我目前是水豚资本的暑假实习生，负责产品设计与市场研究。这个网页主要用于记录的我暑期的文创主意以及个人成长。",
    contactTitle: "联系",
    switchLabel: "EN",
  },
};

let currentLang = localStorage.getItem("lang") || "en";

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  const text = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (text[key]) {
      element.textContent = text[key];
    }
  });

  const switchButton = document.getElementById("lang-switch");
  if (switchButton) {
    switchButton.textContent = text.switchLabel;
  }

  document.dispatchEvent(
    new CustomEvent("languagechange", { detail: { lang } })
  );
}

document.getElementById("lang-switch")?.addEventListener("click", () => {
  setLanguage(currentLang === "en" ? "zh" : "en");
});

setLanguage(currentLang);
