// MENU HAMBURGUER
const toggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

toggle.addEventListener("click", () => {
    navbar.classList.toggle("active");
});


// FECHAR MENU AO CLICAR
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
    });
});


// HEADER DINÂMICO AO ROLAR
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.style.background = "rgba(80, 15, 35, 1)";
        header.style.boxShadow = "0 4px 25px rgba(0,0,0,0.3)";
    } else {
        header.style.background = "rgba(106, 27, 49, 0.95)";
        header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
    }
});