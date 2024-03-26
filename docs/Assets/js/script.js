
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