/* Finished projects: timeline sidebar + hover preview */

const finishedProjects = [
  {
    monthKey: "2026-06",
    completed: { en: "June 2026", zh: "2026年6月" },
    image: "images/Magsafev1.jpg",
    images: ["images/Magsafev1.jpg", "images/Magsafev2.jpg"],
    en: {
      title: "Portable Charger (Magsafe ver.)",
      description:
        "A magsafe charger with slightly shaper, more rectangular edges to create a technological feel. The shape and lightweightedness makes it easy to carry around for daily usages. Can be made thicker to contain more power. The icon is simple without extra letters. I also noticed most people within the company don’t use phone cases, so the sleek metallic feel of the charger will complement the original iPhone design. ",
    },
    zh: {
      title: "便携式充电宝（MagSafe版）",
      description: "这是一款 MagSafe 充电宝，边缘略微更锐利、更偏矩形，以营造科技感。它的造型与轻量化设计便于日常随身携带，也可以设计成更大厚的大容量版本。图标简洁，没有额外文字。因注意到公司里大多数人不使用手机壳，因此充电宝顺滑的金属质感可以很好地呼应 iPhone 原本的设计。",
    },
  },
  {
    monthKey: "2026-06",
    completed: { en: "June 2026", zh: "2026年6月" },
    image: "images/MousepadLv1.JPG",
    images: ["images/MousepadLv1.JPG", "images/MousepadLv2.JPG"],
    en: {
      title: "Mousepad (Large office ver.)",
      description:
        "Used for performing daily research and trading activities on the PC. The mousepad is large enough to hold a keyboard, mouse, as well as other tech accessories. Made of soft and comfortable fabric. The icons are separately stitched, and can consider making them metallic, slightly protruding out of the mousepad to contrast the rest of the fabric.",
    },
    zh: {
      title: "鼠标垫（大号办公版）",
      description: "用于在电脑上进行日常研究和交易活动。鼠标垫尺寸足够大，可同时放置键盘、鼠标以及其他科技配件。材质采用柔软舒适的织物。图标可单独缝制，也可以考虑制作成金属质感、略微凸出于鼠标垫表面，从而与其余织物材质形成对比。晰。",
    },
  },
  {
    monthKey: "2026-06",
    completed: { en: "June 2026", zh: "2026年6月" },
    image: "images/MousepadSv1.png",
    images: ["images/MousepadSv1.png","images/MousepadSv2.png"],
    en: {
      title: "Mousepad (Small ver.)",
      description:
        "Same function as the Large Version but a smaller version for the mouse only.",
    },
    zh: {
      title: "鼠标垫（小号版）",
      description: "与大号功能相同，但为仅供鼠标使用的小号版本。",
    },
  },
  {
    monthKey: "2026-06",
    completed: { en: "June 2026", zh: "2026年6月" },
    image: "images/penholderv1.png",
    images: ["images/penholderv1.png","images/penholderv2.png"],
    en: {
      title: "Metallic Stationary Holder connected to PC",
      description:
      "This product used magnets to connect to the bottom of the PC. It is a convenient stationary holder so that whenever someone has inspiration or need to write a remainder, they can easily reach out for the tool."
    },
    zh: {
      title: "连接至电脑的金属文具收纳器",
      description: "该产品使用磁吸方式连接到电脑底部。它是一款便捷的文具收纳器，当有人产生灵感或需要写下备忘时，可以轻松伸手取用工具"
    },
  },
  
  {
    monthKey: "2026-07",
    completed: { en: "July 2026", zh: "2026年7月" },
      image: "images/typing-cat-typing.gif",
    en: {
      title: "TBD",
      description: "",
    },
    zh: {
      title: "TBD",
      description: "",
    },
  },
  {
    monthKey: "2026-08",
    completed: { en: "August 2026", zh: "2026年8月" },
    image: "images/typing-cat-typing.gif",
    en: {
      title: "TBD",
      description: "",
    },
    zh: {
      title: "TBD",
      description: "",
    },
  },
];

let activeProjectIndex = 0;

function getLang() {
  return localStorage.getItem("lang") || "en";
}

function groupProjectsByMonth() {
  const groups = [];

  finishedProjects.forEach((project, index) => {
    const key = project.monthKey || project.completed.en;
    let group = groups.find((entry) => entry.key === key);

    if (!group) {
      group = { key, label: project.completed, items: [] };
      groups.push(group);
    }

    group.items.push({ project, index });
  });

  return groups;
}

function getProjectImages(project) {
  return project.images?.length ? project.images : [project.image];
}

function renderTimelineSidebar() {
  const sidebar = document.getElementById("timeline-sidebar");
  if (!sidebar) {
    return;
  }

  const lang = getLang();
  sidebar.innerHTML = "";

  groupProjectsByMonth().forEach((group) => {
    const monthBlock = document.createElement("div");
    monthBlock.className = "timeline-month";

    const dateLabel = document.createElement("span");
    dateLabel.className = "timeline-date";
    dateLabel.textContent = group.label[lang];
    monthBlock.appendChild(dateLabel);

    const itemsWrap = document.createElement("div");
    itemsWrap.className = "timeline-month-items";

    group.items.forEach(({ project, index }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "timeline-item";
      button.dataset.index = String(index);

      if (index === activeProjectIndex) {
        button.classList.add("is-active");
      }

      const thumbSrc = getProjectImages(project)[0];

      button.innerHTML = `
        <img
          class="timeline-thumb"
          src="${thumbSrc}"
          alt="${project[lang].title}"
        />
      `;

      button.addEventListener("mouseenter", () => {
        requestActiveProject(index);
      });

      itemsWrap.appendChild(button);
    });

    monthBlock.appendChild(itemsWrap);
    sidebar.appendChild(monthBlock);
  });
}

function applyPreviewAspect(previewImages, project) {
  const images = getProjectImages(project);
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
  activeProjectIndex = index;
  const lang = getLang();
  const project = finishedProjects[index];

  const previewImages = document.getElementById("preview-images");
  const previewDate = document.getElementById("preview-date");
  const previewTitle = document.getElementById("preview-title");
  const previewDescription = document.getElementById("preview-description");

  if (!previewImages || !project) {
    return;
  }

  previewImages.className =
    getProjectImages(project).length > 1
      ? "preview-images preview-images--multi"
      : "preview-images";
  previewImages.style.removeProperty("--preview-aspect");

  previewImages.innerHTML = getProjectImages(project)
    .map(
      (src) =>
        `<div class="preview-image-frame"><img class="preview-image" src="${src}" alt="${project[lang].title}" /></div>`
    )
    .join("");

  applyPreviewAspect(previewImages, project);
  previewDate.textContent = project.completed[lang];
  previewTitle.textContent = project[lang].title;
  previewDescription.textContent = project[lang].description;

  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.index) === index);
  });
}

function setActiveProject(index, { animate = true, force = false } = {}) {
  if (!force && index === activeProjectIndex && !isFirstPreview) {
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

function requestActiveProject(index) {
  clearTimeout(hoverDelayTimer);
  hoverDelayTimer = setTimeout(() => {
    setActiveProject(index);
  }, 120);
}

function initFinishedProjects() {
  if (!document.getElementById("timeline-sidebar")) {
    return;
  }

  renderTimelineSidebar();
  setActiveProject(0);
}

document.addEventListener("languagechange", () => {
  renderTimelineSidebar();
  setActiveProject(activeProjectIndex, { animate: false, force: true });
});

initFinishedProjects();
