// The carousel is plain HTML/CSS. This just nudges the animation to restart
// in in-app browsers (Instagram, TikTok, etc.) that pause it on load.
function restartCarouselAnimation(track) {
  if (!track) return;
  track.style.animation = "none";
  track.offsetHeight; // force reflow
  track.style.animation = "";
}

// Draws soft, light-blue noise into the placeholder canvas, regenerating it
// every ~1.5s for a slow, drifting feel. The canvas's own drawing buffer is
// tiny (10x6) — CSS stretches it to fill the carousel and blurs it, which
// is what turns sharp random pixels into big, soft, cloud-like grain.
// Pure code, no file to fetch, so it's on screen from the very first paint.
function startCarouselPlaceholder(canvas) {
  if (!canvas || !canvas.getContext) return null;
  const ctx = canvas.getContext("2d");
  const cols = 10;
  const rows = 6;
  canvas.width = cols;
  canvas.height = rows;

  // Same light blue as the portcards hover gradient (#eff3ff), pushed a
  // little lighter, with a low-contrast random brightness wobble added
  // equally across channels so the tint/hue stays put and only the
  // lightness varies. Tweak tint/range to taste.
  const tint = [243, 247, 255];
  const range = 10;

  function paintNoise() {
    const frame = ctx.createImageData(cols, rows);
    for (let i = 0; i < frame.data.length; i += 4) {
      const delta = Math.floor(Math.random() * range);
      frame.data[i] = Math.min(255, tint[0] + delta);
      frame.data[i + 1] = Math.min(255, tint[1] + delta);
      frame.data[i + 2] = Math.min(255, tint[2] + delta);
      frame.data[i + 3] = 255;
    }
    ctx.putImageData(frame, 0, 0);
  }

  paintNoise();
  const intervalId = setInterval(paintNoise, 1500);
  return () => clearInterval(intervalId);
}

// Waits for every image inside `track` to actually finish loading AND
// decoding, then calls onReady — so the caller can reveal things only once
// nothing will pop in or shift mid-slide.
function whenImagesReady(track, onReady) {
  if (!track) return;
  const images = Array.from(track.querySelectorAll("img"));

  const ready = images.map((img) => {
    const whenLoaded = img.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", resolve); // don't block on a bad file
        });

    return whenLoaded.then(() =>
      img.decode ? img.decode().catch(() => {}) : undefined
    );
  });

  Promise.all(ready).then(onReady);
}

const carouselEl = document.querySelector(".carousel");
const stopCarouselPlaceholder = carouselEl
  ? startCarouselPlaceholder(carouselEl.querySelector(".carousel-placeholder"))
  : null;

whenImagesReady(document.querySelector(".carousel-track"), function () {
  if (carouselEl) carouselEl.classList.add("is-ready");
  if (stopCarouselPlaceholder) stopCarouselPlaceholder();
});

let timeout;
window.onload = function () {
  timeout = setTimeout(function () {
    document.querySelector('body').classList.remove('pointernone');
  }, 500);
};

// Restart carousel when tab becomes visible (Instagram, TikTok, etc.)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    restartCarouselAnimation(document.querySelector(".carousel-track"));
  }
});


const menu = document.getElementById("dropdownMenu");
const menuImage = document.getElementById("menu-image");

// Menu icon: two GIFs instead of a PNG frame sequence — one that animates
// hamburger -> X (opening), one that animates X -> hamburger (closing). A
// GIF plays its own frames internally once its `src` loads, so none of the
// old frame-array / preload / warm-up / requestAnimationFrame stepper is
// needed anymore: that machinery's whole job was to hand-simulate what a
// GIF already does by itself. Same animation, browser does the work now.
const menuIconOpenSrc = "Assets/images/MenuIconAnimation.gif";
const menuIconCloseSrc = "Assets/images/MenuIconAnimationBackwards.gif";

// Preloads both GIFs on page load so the very first click doesn't stall on
// a network request — same purpose as the old preloadImages(), just for 2
// files instead of 8, so it collapses to this.
[menuIconOpenSrc, menuIconCloseSrc].forEach((src) => {
  const preload = new Image();
  preload.src = src;
});

// IMPORTANT — freezing on the last frame is NOT controlled by this file.
// It depends on the GIF itself being exported with its loop count set to
// "once" / "no repeat" instead of "forever." That setting lives inside
// the GIF file and is what makes the browser stop and hold the last frame
// instead of looping. If the icon keeps looping, re-export the two GIFs
// with that option — no amount of JS here can override it.

// There's no cross-browser JS event for "a GIF finished playing," so this
// is a plain timer used only to stop a second click from re-triggering
// mid-animation — it has nothing to do with the freeze itself. Set it to
// roughly match how long the GIFs actually run.
const MENU_ICON_ANIMATION_MS = 700;

let isAnimating = false;
let animationLockTimeout = null;

function toggleMenu() {
  if (isAnimating) return;
  isAnimating = true;

  const isOpening = !menu.classList.contains("show");
  menu.classList.toggle("show");

  // Opening and closing always alternate between the two different GIF
  // URLs, so this is always a genuine `src` change — that's what makes the
  // browser reload the file and replay it from frame 1 every time, with
  // no extra reset trick required.
  menuImage.src = isOpening ? menuIconOpenSrc : menuIconCloseSrc;

  clearTimeout(animationLockTimeout);
  animationLockTimeout = setTimeout(() => {
    isAnimating = false;
  }, MENU_ICON_ANIMATION_MS);
}



const elements = document.querySelectorAll('.fade-in');

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.01
}

const callbacks= (entries)=>{
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('active');
    }
  });
}

let observer = new IntersectionObserver(callbacks,options);

elements.forEach(element =>{
  observer.observe(element);
});


const resourceListContainer = document.getElementById('resource-list');

if (resourceListContainer) {
    const searchInput = document.getElementById('search-input');
    const sortBySelect = document.getElementById('sort-by');
    const sortDirectionButton = document.getElementById('sort-direction');

    const csvFilePath = 'Assets/resources.csv';

    let fetchedResources = [];
    let currentSortDirection = 'asc';

    function parseCSV(csvText) {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',');
      const resources = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const resource = {};
        for (let j = 0; j < headers.length; j++) {
          resource[headers[j].trim()] = values[j].trim();
        }
        resources.push(resource);
      }
      return resources;
    }

    function displayResources(resources) {
      resourceListContainer.innerHTML = '';
      resources.forEach(resource => {
        const resourceItem = document.createElement('a');
        resourceItem.classList.add('resource-item');
        resourceItem.href = resource.Link;
        resourceItem.target = "_blank";
        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('resource-item-details');
        const titleHeading = document.createElement('h3');
        titleHeading.textContent = resource.Title;
        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.textContent = resource.Description;
        detailsDiv.appendChild(titleHeading);
        detailsDiv.appendChild(descriptionParagraph);
        const mainImageElement = document.createElement('img');
        mainImageElement.src = resource.Image;
        mainImageElement.alt = resource.Title;
        mainImageElement.classList.add('portcardimg');
        resourceItem.appendChild(detailsDiv);
        resourceItem.appendChild(mainImageElement);
        resourceListContainer.appendChild(resourceItem);
      });
    }

    function filterResources(searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return fetchedResources.filter(resource =>
        resource.Title.toLowerCase().includes(lowerCaseSearchTerm) ||
        resource.Description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    function sortResources(sortBy, resourcesToSort, direction = 'asc') {
      const sortedResources = [...resourcesToSort];
      sortedResources.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'title') {
          comparison = a.Title.localeCompare(b.Title);
        } else if (sortBy === 'date') {
          const dateA = new Date(a.Date);
          const dateB = new Date(b.Date);
          comparison = dateA - dateB;
        }
        return direction === 'desc' ? comparison * -1 : comparison;
      });
      return sortedResources;
    }

    function updateSortDirectionButton() {
      sortDirectionButton.textContent = currentSortDirection === 'asc' ? '▲' : '▼';
      sortDirectionButton.classList.remove('asc', 'desc');
      sortDirectionButton.classList.add(currentSortDirection);
    }

    fetch(csvFilePath)
      .then(response => response.text())
      .then(csvData => {
        fetchedResources = parseCSV(csvData);
        displayResources(sortResources(sortBySelect.value, fetchedResources, currentSortDirection));
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });

    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value;
      const filteredResources = filterResources(searchTerm);
      const sortedFilteredResources = sortResources(sortBySelect.value, filteredResources, currentSortDirection);
      displayResources(sortedFilteredResources);
    });

    sortBySelect.addEventListener('change', () => {
      const searchTerm = searchInput.value;
      const filteredResources = filterResources(searchTerm);
      const sortedFilteredResources = sortResources(sortBySelect.value, filteredResources, currentSortDirection);
      displayResources(sortedFilteredResources);
    });

    sortDirectionButton.addEventListener('click', () => {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
      updateSortDirectionButton();
      const searchTerm = searchInput.value;
      const filteredResources = filterResources(searchTerm);
      const sortedFilteredResources = sortResources(sortBySelect.value, filteredResources, currentSortDirection);
      displayResources(sortedFilteredResources);
    });

    updateSortDirectionButton();
}