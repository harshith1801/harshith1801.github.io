document.addEventListener('DOMContentLoaded', () => {

    // Active Link Scrolling
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');

    window.onscroll = () => {
        sections.forEach(sec => {
            let top = window.scrollY;
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if(top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    links.classList.remove('active');
                    document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
                });
            };
        });
    };

    // Home Page Typing Animation
    const typed = new Typed('.multiple-text', {
        strings: ['Scientist.', 'Analyst.', 'Engineer.'],
        typeSpeed: 100,
        backSpeed: 70,
        backDelay: 1000,
        loop: true
    });

    // Education Section "Show Coursework" Toggle
    const courseworkBtns = document.querySelectorAll('.coursework-btn');

    courseworkBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const list = btn.nextElementSibling;
            list.classList.toggle('visible');

            if (list.classList.contains('visible')) {
                btn.textContent = 'Hide Coursework';
            } else {
                btn.textContent = 'Show Coursework';
            }
        });
    });

});



