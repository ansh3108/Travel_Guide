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