// The carousel is plain HTML/CSS. This just nudges the animation to restart
// in in-app browsers (Instagram, TikTok, etc.) that pause it on load.
function restartCarouselAnimation(track) {
  if (!track) return;
  track.style.animation = "none";
  track.offsetHeight; // force reflow
  track.style.animation = "";
}

let timeout;
window.onload = function () {
  timeout = setTimeout(function () {
    document.querySelector('body').classList.remove('pointernone');
  }, 500);

  restartCarouselAnimation(document.querySelector(".carousel-track"));
};

// Restart carousel when tab becomes visible (Instagram, TikTok, etc.)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    restartCarouselAnimation(document.querySelector(".carousel-track"));
  }
});


const menu = document.getElementById("dropdownMenu");
const menuImage = document.getElementById("menu-image");

const images = [
  "Assets/images/menuanimation/f1.png",
  "Assets/images/menuanimation/f2.png",
  "Assets/images/menuanimation/f3.png",
  "Assets/images/menuanimation/f4.png",
  "Assets/images/menuanimation/f5.png",
  "Assets/images/menuanimation/f6.png",
  "Assets/images/menuanimation/f7.png",
  "Assets/images/menuanimation/f8.png"
];

// Preload AND fully decode every frame before we ever need to paint it.
// Downloading a file and decoding it are two separate costs — a small file
// can still stutter on first paint if the decode hasn't happened yet.
// img.decode() forces that work to happen ahead of time, off the critical path.
const preloadedImages = [];
let imagesReady = false;

function preloadImages(imageArray) {
  const loadPromises = imageArray.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.decode) {
          img.decode().then(resolve).catch(resolve);
        } else {
          resolve();
        }
      };
      img.onerror = resolve; // never block the whole set on one bad frame
      img.src = src;
      preloadedImages.push(img);
    });
  });

  Promise.all(loadPromises).then(() => {
    imagesReady = true;
  });
}
preloadImages(images);

// Decoding pixel data and actually PAINTING it on screen are two different
// costs. Some browsers still do extra work (GPU texture upload, building
// paint records) the very first time a given image is composited into a
// layer, even if it's already decoded. That one-time cost is exactly what
// makes the first click or two feel choppy while later toggles are smooth —
// by then every frame has already been painted once.
//
// Fix: render all 8 frames off-screen once, right after load, so each one
// is already warmed in the compositor before the user ever opens the menu.
function warmUpFrames(imageArray) {
  const warmupContainer = document.createElement('div');
  warmupContainer.style.position = 'fixed';
  warmupContainer.style.top = '-9999px';
  warmupContainer.style.left = '-9999px';
  warmupContainer.style.width = '1px';
  warmupContainer.style.height = '1px';
  warmupContainer.style.overflow = 'hidden';
  warmupContainer.setAttribute('aria-hidden', 'true');

  imageArray.forEach((src) => {
    const warmImg = document.createElement('img');
    warmImg.src = src;
    // Match the real rendered size (.menu-icon is 30x30) so the browser
    // does the same-size paint work it'll need later, not a different one.
    warmImg.width = 30;
    warmImg.height = 30;
    warmupContainer.appendChild(warmImg);
  });

  // Left in the DOM permanently — it's 1px and invisible, and keeping it
  // around means the browser has no reason to evict the cached layer.
  document.body.appendChild(warmupContainer);
}
warmUpFrames(images);

// Animation state
let animationFrameId = null;
let isAnimating = false;

function toggleMenu() {
  // Prevent multiple clicks during animation
  if (isAnimating) return;
  menu.classList.toggle("show");
  playIconAnimation();
}

function playIconAnimation() {
  // Cancel any running animation
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  const isOpening = menu.classList.contains("show");
  animateImages(isOpening);
}

function animateImages(forward) {
  isAnimating = true;

  const frameDelay = 120; // milliseconds per frame
  const lastValidIndex = images.length - 1;
  let startTime = null;
  let lastFrameShown = -1;

  // Guard: if something goes wrong (e.g. images failed entirely), don't
  // leave isAnimating stuck true forever and lock out future clicks.
  const safetyTimeout = setTimeout(() => {
    isAnimating = false;
  }, frameDelay * images.length + 500);

  function finish() {
    clearTimeout(safetyTimeout);
    isAnimating = false;
    animationFrameId = null;
  }

  function animate(currentTime) {
    if (startTime === null) startTime = currentTime;

    // Calculate which frame we SHOULD be on based on elapsed wall-clock time,
    // rather than incrementing from the last frame. This is self-correcting:
    // if the browser hitches for a moment (e.g. in-app browser throttling),
    // we jump straight to the correct frame instead of the delay compounding
    // across the rest of the animation.
    const elapsed = currentTime - startTime;
    const frameStep = Math.min(Math.floor(elapsed / frameDelay), lastValidIndex);
    const currentIndex = forward ? frameStep : lastValidIndex - frameStep;

    if (frameStep !== lastFrameShown) {
      lastFrameShown = frameStep;
      menuImage.src = images[currentIndex];
    }

    if (frameStep >= lastValidIndex) {
      finish();
      return;
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animationFrameId = requestAnimationFrame(animate);
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
    let currentSortDirection = 'asc'; // Default sort direction

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