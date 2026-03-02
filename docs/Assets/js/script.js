


var timeout;
window.onload = function () {
  timeout = setTimeout(function () {
    document.querySelector('body').classList.remove('pointernone');
  }, 500);

  // Carousel fix for in-app browsers
  const track = document.querySelector(".carousel-track");
  if (track) {
    track.style.animation = "none";
    track.offsetHeight;
    track.style.animation = "";
  }
};

// Restart carousel when tab becomes visible (Instagram, TikTok, etc.)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    const track = document.querySelector(".carousel-track");
    if (track) {
      track.style.animation = "none";
      track.offsetHeight;
      track.style.animation = "";
    }
  }
});


let menuOpen = false;
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

// Preload images
const preloadedImages = [];
function preloadImages(imageArray) {
  imageArray.forEach((src) => {
    const img = new Image();
    img.src = src;
    preloadedImages.push(img);
  });
}
preloadImages(images);

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
  
  const frameDelay = 65; // milliseconds per frame
  let currentIndex = forward ? 0 : images.length - 1;
  let lastFrameTime = performance.now();
  
  function animate(currentTime) {
    const elapsed = currentTime - lastFrameTime;
    
    if (elapsed >= frameDelay) {
      menuImage.src = images[currentIndex];
      lastFrameTime = currentTime;
      
      // Update index
      if (forward) {
        currentIndex++;
        if (currentIndex >= images.length) {
          isAnimating = false;
          return; // Stop animation
        }
      } else {
        currentIndex--;
        if (currentIndex < 0) {
          isAnimating = false;
          return; // Stop animation
        }
      }
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


function animateSkills() {
  const skills = document.querySelectorAll('.skill-bar');
  const widths = {
      'novice': '50%',
      'adv-beginner': '60%',
      'competent': '70%',
      'proficient': '90%',
      'expert': '100%'
  };

  skills.forEach(skill => {
      const classes = skill.className.split(' ');
      classes.forEach(cls => {
          if (widths[cls]) {
              setTimeout(() => {
                  skill.style.width = widths[cls];
              }, 100);
          }
      });
  });
}

document.addEventListener("DOMContentLoaded", animateSkills);


// performant light-following cursor
const light = document.getElementById('light');
let mouseX = 0, mouseY = 0;
let ticking = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // position using a GPU-accelerated transform (center the element)
      light.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ticking = false;
    });
    ticking = true;
  }
});

document.addEventListener('mouseenter', () => {
  light.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
  light.style.opacity = '0';
});

//tilt for header and footer
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  const portcards = document.querySelectorAll('.portcards'); // Select all elements with the class 'portcards'

  const handleMouseMove = (element, event) => {
    const { offsetX, offsetY, target } = event;
    const { offsetWidth, offsetHeight } = target;
    const halfWidth = offsetWidth/2;
    const halfHeight = offsetHeight/2;
    
    const rotateX = ((offsetY - halfHeight) / halfHeight) * -32; // 10 degrees max rotation
    const rotateY = ((offsetX - halfWidth) / halfWidth) * -32; // 10 degrees max rotation

    element.style.transform = `rotateX(${rotateX0}deg+8) rotateY(${rotateY0}deg-8) scale(1.006)`;
  };

  const resetTransform = (element) => {
    element.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  header.addEventListener('mousemove', (e) => handleMouseMove(header, e));
  footer.addEventListener('mousemove', (e) => handleMouseMove(footer, e));

  header.addEventListener('mouseleave', () => resetTransform(header));
  footer.addEventListener('mouseleave', () => resetTransform(footer));

  portcards.forEach(portcard => {
    portcard.addEventListener('mousemove', (e) => handleMouseMove(portcard, e));
    portcard.addEventListener('mouseleave', () => resetTransform(portcard));
  });
});

const resourceListContainer = document.getElementById('resource-list');
    const searchInput = document.getElementById('search-input');
    const sortBySelect = document.getElementById('sort-by');
    const sortDirectionButton = document.getElementById('sort-direction');

    const csvFilePath = 'Assets/resources.csv';

    let fetchedResources = [];
    let currentSortDirection = 'asc'; // Default sort direction


    sortDirectionButton.addEventListener('click', () => {
      if (sortDirectionButton.textContent === '▲') {
        sortDirectionButton.textContent = '▼';
      } else {
        sortDirectionButton.textContent = '▲';
      }
    });

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