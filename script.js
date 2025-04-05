document,addEventListener("DOMContentLoaded", function() {
    const darkModeToggle= document.getElementById("darkModeToggle")
    if(darkModeToggle) {
        darkModeToggle.addEventListener("click", function() {
            document.body.classList.toggle("dark-mode");
        

        if(document.body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
        
});
    } else {
        console.error("Darkmode button not found")
    }
})

const backToTopButton = document.getElementById("backToTopBtn")
window.onscroll = function() {
    if(document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
}
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}