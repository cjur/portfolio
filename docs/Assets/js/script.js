


var timeout;
window.onload = function(){
  timeout = setTimeout(function(){
    document.querySelector('body').classList.remove('pointernone');
  }, 1400);
}

// script.js
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

function toggleMenu() {
  // Toggle the menu visibility
  menu.classList.toggle("show");

  // Trigger the animation on the icon (depending on whether the menu is open or closed)
  playIconAnimation();
}

function playIconAnimation() {
  // If the menu is open, play forward; if closed, play backward
  if (menu.classList.contains("show")) {
    // Menu is opening -> play forward animation
    animateImagesForward();
  } else {
    // Menu is closing -> play backward animation
    animateImagesBackward();
  }
}

function animateImagesForward() {
  let currentIndex = 0; // Start with f1.png
  const interval = setInterval(() => {
    menuImage.src = images[currentIndex];
    currentIndex++;

    if (currentIndex >= images.length) {
      clearInterval(interval); // Stop the animation after the last image
    }
  }, 130); // Change image every 250ms (adjust timing as needed)
}

function animateImagesBackward() {
  let currentIndex = images.length - 1; // Start with f8.png
  const interval = setInterval(() => {
    menuImage.src = images[currentIndex];
    currentIndex--;

    if (currentIndex < 0) {
      clearInterval(interval); // Stop the animation after the first image
    }
  }, 130); // Change image every 250ms (adjust timing as needed)
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


//Light following cursor

document.addEventListener('mousemove', function(e) {
  const light = document.getElementById('light');
  light.style.left = `${e.pageX}px`;
  light.style.top = `${e.pageY}px`;
});

document.addEventListener('mouseenter', function() {
  const light = document.getElementById('light');
  light.style.opacity = 1; // Show the light
});

document.addEventListener('mouseleave', function() {
  const light = document.getElementById('light');
  light.style.opacity = 0; // Hide the light
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
    const halfHeight = offsetHeight/2.4;
    
    const rotateX = ((offsetY - halfHeight) / halfHeight) * -6; // 10 degrees max rotation
    const rotateY = ((offsetX - halfWidth) / halfWidth) * 8; // 10 degrees max rotation

    element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
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

