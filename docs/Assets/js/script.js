
document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth > 768) {
        this.classList.toggle('expanded');
      }
    });
  });
  
  

  function toggleMenu() {
    var menu = document.getElementById("dropdownMenu");
    var menuIcon = document.querySelector(".menu-icon");
    if (menu.style.display === "block") {
      menu.style.display = "none";
      menuIcon.textContent = "☰";
    } else {
      menu.style.display = "block";
      menuIcon.textContent = "✕";
    }
  }

const elements = document.querySelectorAll('.fade-in');

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
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
      'novice': '20%',
      'adv-beginner': '40%',
      'competent': '60%',
      'proficient': '80%',
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


  const handleMouseMove = (element, event) => {
      const { offsetX, offsetY, target } = event;
      const { offsetWidth, offsetHeight } = target;
      const halfWidth = offsetWidth / 2;
      const halfHeight = offsetHeight / 2;
      
      const rotateX = ((offsetY - halfHeight) / halfHeight) * -10; // 10 degrees max rotation
      const rotateY = ((offsetX - halfWidth) / halfWidth) * 15; // -10 degrees max rotation

      element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTransform = (element) => {
      element.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  header.addEventListener('mousemove', (e) => handleMouseMove(header, e));
  footer.addEventListener('mousemove', (e) => handleMouseMove(footer, e));


  header.addEventListener('mouseleave', () => resetTransform(header));
  footer.addEventListener('mouseleave', () => resetTransform(footer));

});
