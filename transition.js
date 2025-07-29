window.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector('.content');
    content.classList.add('page-loaded');
});

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && !href.startsWith("http") && !href.startsWith("#")) {
            e.preventDefault();
            const content = document.querySelector('.content');
            content.classList.remove('page-loaded');
            content.classList.add('fade-out');
            setTimeout(() => {
                window.location = href;
            }, 500);
        }
    });
});
