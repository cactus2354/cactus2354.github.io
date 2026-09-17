const photos = [
  { src: "photos/eagle-08538.jpg", width: 2000, height: 1333, alt: "A bald eagle perched high in a pine beside its nest, a chick visible inside and forested mountains behind.", caption: "" },
  { src: "photos/dsc05931.jpg", width: 2000, height: 1429, alt: "A husky standing in fresh snow, reaching a paw toward a snow-covered shrub.", caption: "" },
  { src: "photos/overlook-08667.jpg", width: 2000, height: 1333, alt: "Looking out from a rocky overlook across a pine-forested valley toward a mountain reservoir, sky overcast.", caption: "" },
  { src: "photos/osprey-08912.jpg", width: 1334, height: 2000, alt: "An osprey standing in its stick nest atop a utility pole against a clear blue sky.", caption: "" },
  { src: "photos/plant-08972.jpg", width: 2000, height: 1333, alt: "A blooming cholla cactus with magenta flowers in a dry grassland.", caption: "" },
  { src: "photos/dsc05115-edited.jpg", width: 2000, height: 1333, alt: "A young elk backlit by warm light, antlers still in velvet.", caption: "" },
  { src: "photos/dsc05932.jpg", width: 2000, height: 1428, alt: "A husky shaking snow loose from a small tree in a snowy yard.", caption: "" },
  { src: "photos/osprey-09377.jpg", width: 2000, height: 1334, alt: "An osprey lifting off above its nest as its mate stays perched, layers of mountains beyond.", caption: "" },
  { src: "photos/7.jpg", width: 1333, height: 2000, alt: "A bronze equestrian statue of William III in a London square, with people gathered at its base on a sunny day.", caption: "" },
  { src: "photos/eagle-08508.jpg", width: 2000, height: 1333, alt: "A bald eagle perched on a branch beside its nest atop a tall pine, overcast sky behind.", caption: "" },
  { src: "photos/dsc2121.jpg", width: 2000, height: 1333, alt: "Pond turtles basking together on a log in warm, misty light.", caption: "" },
  { src: "photos/aaa-1-4.jpg", width: 2000, height: 1333, alt: "A toy pedal tractor parked next to an all-terrain trike in the snow, prairie hills rolling off behind.", caption: "" },
  { src: "photos/dsc04072.jpg", width: 1616, height: 1080, alt: "A small pedal vehicle parked on a wet driveway at golden hour, with rolling prairie hills beyond.", caption: "" },
  { src: "photos/aaa-1-7.jpg", width: 2000, height: 1429, alt: "A small bird perched on a wooden boardwalk railing, backlit by golden late-day light.", caption: "" },
  { src: "photos/aaa-1-3.jpg", width: 2000, height: 1333, alt: "A snow-dusted field with a lone tree stump and a pile of stones, pines lining the far edge.", caption: "" },
  { src: "photos/aaa-1-copy.jpg", width: 2000, height: 1333, alt: "Close-up of a mountain bike's rear wheel and drivetrain, parked on a wet garage floor.", caption: "" },
];

function columnCountForWidth(viewportWidth) {
  if (viewportWidth >= 900) return 3;
  if (viewportWidth >= 600) return 2;
  return 1;
}

(function () {
  "use strict";

  const galleryEl = document.getElementById("gallery");
  const lightboxEl = document.getElementById("lightbox");
  const lightboxImage = lightboxEl.querySelector(".lightbox-image");
  const lightboxCaption = lightboxEl.querySelector(".lightbox-caption");
  const lightboxCounter = lightboxEl.querySelector(".lightbox-counter");
  const closeBtn = lightboxEl.querySelector(".lightbox-close");
  const prevBtn = lightboxEl.querySelector(".lightbox-prev");
  const nextBtn = lightboxEl.querySelector(".lightbox-next");

  let currentIndex = -1;
  let lastTrigger = null;
  let triggers = [];
  let builtColumnCount = null;

  document.getElementById("year").textContent = new Date().getFullYear();

  function buildGallery() {
    const columnCount = columnCountForWidth(window.innerWidth);
    if (columnCount === builtColumnCount) return;
    builtColumnCount = columnCount;

    galleryEl.innerHTML = "";
    triggers = [];

    const columns = [];
    const columnHeights = [];
    for (let i = 0; i < columnCount; i++) {
      const column = document.createElement("div");
      column.className = "gallery-column";
      galleryEl.appendChild(column);
      columns.push(column);
      columnHeights.push(0);
    }

    photos.forEach((photo, index) => {
      let shortest = 0;
      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < columnHeights[shortest]) shortest = i;
      }
      columnHeights[shortest] += photo.height / photo.width;

      const figure = document.createElement("figure");
      figure.className = "photo";

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "photo-trigger";
      trigger.setAttribute("aria-label", `Open photo ${index + 1} of ${photos.length}`);
      trigger.addEventListener("click", () => openLightbox(index));

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.width = photo.width;
      img.height = photo.height;
      img.loading = "lazy";
      img.decoding = "async";

      trigger.appendChild(img);

      if (photo.caption) {
        const caption = document.createElement("span");
        caption.className = "photo-caption";
        const idx = document.createElement("span");
        idx.className = "photo-index";
        idx.textContent = `${String(index + 1).padStart(2, "0")} / ${photos.length}`;
        caption.appendChild(idx);
        caption.appendChild(document.createTextNode(photo.caption));
        trigger.appendChild(caption);
      }

      figure.appendChild(trigger);
      columns[shortest].appendChild(figure);
      triggers[index] = trigger;
    });

    if (currentIndex >= 0) lastTrigger = triggers[currentIndex];
  }

  function openLightbox(index) {
    currentIndex = index;
    lastTrigger = triggers[index];
    updateLightboxContent();
    lightboxEl.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeLightbox() {
    lightboxEl.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastTrigger) lastTrigger.focus();
  }

  function showRelative(delta) {
    currentIndex = (currentIndex + delta + photos.length) % photos.length;
    lastTrigger = triggers[currentIndex];
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const photo = photos[currentIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.caption || "";
    lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${photos.length}`;
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showRelative(-1);
    } else if (event.key === "ArrowRight") {
      showRelative(1);
    } else if (event.key === "Tab") {
      trapFocus(event);
    }
  }

  function trapFocus(event) {
    const focusable = [closeBtn, prevBtn, nextBtn];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => showRelative(-1));
  nextBtn.addEventListener("click", () => showRelative(1));

  lightboxEl.addEventListener("click", (event) => {
    if (event.target === lightboxEl) closeLightbox();
  });

  buildGallery();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGallery, 150);
  });
})();
