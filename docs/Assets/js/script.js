
document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', function() {
      this.classList.toggle('expanded');
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
