/* Ideas in-progress: timeline sidebar + hover preview */

const ideasInProgress = [
  {
    monthKey: "2026-07",
    completed: { en: "July 2026", zh: "2026年7月" },
    image: "images/keychainvisualv1.jpg",
    images: ["images/keychainvisualv1.jpg", "images/keychainvisionv2.png"],
    en: {
      title: "Keychain Memorabilia (Abstract)",
      description:
        "Keychains are simple, yet powerful accessories to bring cohesion and foster senses of belonging. These metal key chains that can hold keys, and name tags, with specific-colored decorations that are symbolic to the wearer. Design ideas include 3D capybara, curated tag with model/product number on it, and specific team logo (exp. For bonds/securities etc.) More graphics will be added as each member contributes to the company.",
    },
    zh: {
      title: "纪念钥匙扣（概念）",
      description: 
      "钥匙扣是简单却有力的配件，能够增强凝聚力并培养归属感。这些金属钥匙扣可用于悬挂钥匙和姓名牌，并搭配具有象征意义的特定颜色装饰。设计想法包括 3D 水豚、带有型号/产品编号的定制标签，以及特定团队标识（例如债券/证券等）。随着每位成员为公司作出贡献，后续还将加入更多图形元素。"
    },
  },
];

let activeIdeaIndex = 0;

function getLang() {
  return localStorage.getItem("lang") || "en";
}

function groupIdeasByMonth() {
  const groups = [];

  ideasInProgress.forEach((idea, index) => {
    const key = idea.monthKey || idea.completed.en;
    let group = groups.find((entry) => entry.key === key);

    if (!group) {
      group = { key, label: idea.completed, items: [] };
      groups.push(group);
    }

    group.items.push({ idea, index });
  });

  return groups;
}

function getIdeaImages(idea) {
  return idea.images?.length ? idea.images : [idea.image];
}

function renderTimelineSidebar() {
  const sidebar = document.getElementById("timeline-sidebar");
  if (!sidebar) {
    return;
  }

  const lang = getLang();
  sidebar.innerHTML = "";

  groupIdeasByMonth().forEach((group) => {
    const monthBlock = document.createElement("div");
    monthBlock.className = "timeline-month";

    const dateLabel = document.createElement("span");
    dateLabel.className = "timeline-date";
    dateLabel.textContent = group.label[lang];
    monthBlock.appendChild(dateLabel);

    const itemsWrap = document.createElement("div");
    itemsWrap.className = "timeline-month-items";

    group.items.forEach(({ idea, index }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "timeline-item";
      button.dataset.index = String(index);

      if (index === activeIdeaIndex) {
        button.classList.add("is-active");
      }

      const thumbSrc = getIdeaImages(idea)[0];

      button.innerHTML = `
        <img
          class="timeline-thumb"
          src="${thumbSrc}"
          alt="${idea[lang].title}"
        />
      `;

      button.addEventListener("mouseenter", () => {
        requestActiveIdea(index);
      });

      itemsWrap.appendChild(button);
    });

    monthBlock.appendChild(itemsWrap);
    sidebar.appendChild(monthBlock);
  });
}

function applyPreviewAspect(previewImages, idea) {
  const images = getIdeaImages(idea);
  if (images.length <= 1) {
    return;
  }

  const probe = new Image();
  probe.onload = () => {
    previewImages.style.setProperty(
      "--preview-aspect",
      `${probe.naturalWidth} / ${probe.naturalHeight}`
    );
    previewImages.classList.toggle(
      "preview-images--landscape",
      probe.naturalWidth > probe.naturalHeight
    );
  };
  probe.src = images[0];
}

let previewFadeTimer = null;
let hoverDelayTimer = null;
let isFirstPreview = true;

function updatePreviewContent(index) {
  activeIdeaIndex = index;
  const lang = getLang();
  const idea = ideasInProgress[index];

  const previewImages = document.getElementById("preview-images");
  const previewDate = document.getElementById("preview-date");
  const previewTitle = document.getElementById("preview-title");
  const previewDescription = document.getElementById("preview-description");

  if (!previewImages || !idea) {
    return;
  }

  previewImages.className =
    getIdeaImages(idea).length > 1
      ? "preview-images preview-images--multi"
      : "preview-images";
  previewImages.style.removeProperty("--preview-aspect");

  previewImages.innerHTML = getIdeaImages(idea)
    .map(
      (src) =>
        `<div class="preview-image-frame"><img class="preview-image" src="${src}" alt="${idea[lang].title}" /></div>`
    )
    .join("");

  applyPreviewAspect(previewImages, idea);
  previewDate.textContent = idea.completed[lang];
  previewTitle.textContent = idea[lang].title;
  previewDescription.textContent = idea[lang].description;

  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.index) === index);
  });
}

function setActiveIdea(index, { animate = true, force = false } = {}) {
  if (!force && index === activeIdeaIndex && !isFirstPreview) {
    return;
  }

  const preview = document.querySelector(".timeline-preview");
  if (!preview) {
    return;
  }

  clearTimeout(previewFadeTimer);

  if (!animate || isFirstPreview) {
    isFirstPreview = false;
    updatePreviewContent(index);
    preview.classList.remove("is-fading");
    return;
  }

  preview.classList.add("is-fading");

  previewFadeTimer = setTimeout(() => {
    updatePreviewContent(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        preview.classList.remove("is-fading");
      });
    });
  }, 220);
}

function requestActiveIdea(index) {
  clearTimeout(hoverDelayTimer);
  hoverDelayTimer = setTimeout(() => {
    setActiveIdea(index);
  }, 120);
}

function initIdeasInProgress() {
  if (!document.getElementById("timeline-sidebar")) {
    return;
  }

  renderTimelineSidebar();
  setActiveIdea(0);
}

document.addEventListener("languagechange", () => {
  renderTimelineSidebar();
  setActiveIdea(activeIdeaIndex, { animate: false, force: true });
});

initIdeasInProgress();
