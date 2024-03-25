
document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });
  });
  
  

  function toggleMenu() {
    var menu = document.getElementById("dropdownMenu");
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }
