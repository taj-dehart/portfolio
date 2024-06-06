/*! index.js | If you can read this you're tailgaiting */

document.addEventListener('DOMContentLoaded', () => {
    // Nav selector star slide
    const star = document.getElementById('menu-star');
    document.body.querySelectorAll('i').forEach((trigger) => {
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target.id == 'a-trigger') {
                    star.style.marginRight = '66%';
                }
                if (entry.isIntersecting && entry.target.id == 'w-trigger') {
                    star.style.marginRight = '0%';
                }
                if (entry.isIntersecting && entry.target.id == 'w-trigger-b') {
                    star.style.marginRight = '0%';
                }
                if (entry.isIntersecting && entry.target.id == 'c-trigger') {
                    star.style.marginRight = '-66%';
                }
            });
        }).observe(trigger);
    });
    // Mobile nav logo slide
    const menu = document.getElementById('menu'),
        logo = document.getElementById('logo');
    if (window.innerWidth < 651) {
        window.addEventListener(
            'scroll',
            function slide() {
                if (window.scrollY > 25) {
                    menu.style.transform = 'translate(0)';
                    logo.style.transform = 'translate(-230%)';
                    window.removeEventListener('scroll', slide);
                }
            },
            {passive: true}
        );
    }
    // Dark mode toggle
    function getValue(color) {
        return window
            .getComputedStyle(document.documentElement)
            .getPropertyValue(`--${color}`);
    }
    function setValue(prop, color) {
        return root.style.setProperty(`--${prop}`, color);
    }
    const root = document.querySelector(':root'),
        darkMode = document.getElementById('dark-mode'),
        darkIcon = document.getElementById('light-icon'),
        lightIcon = document.getElementById('dark-icon'),
        white = getValue('white'),
        black = getValue('black'),
        green = getValue('green'),
        blue = getValue('blue'),
        greenHover = getValue('green-hover'),
        blueHover = getValue('blue-hover'),
        lightShadow = getValue('light-shadow'),
        darkShadow = getValue('dark-shadow');
        let isDark = false;
    darkMode.addEventListener('click', () => {
        if (!isDark) {
            setValue('black', white);
            setValue('white', black);
            setValue('green', blue);
            setValue('blue', green);
            setValue('green-hover', blueHover)
            setValue('blue-hover', greenHover)
            setValue('light-shadow', darkShadow)
            setValue('dark-shadow', lightShadow)
            darkIcon.style.transform = 'translate(0, 0)';
            lightIcon.style.transform = 'translate(0, 100%)';
            isDark = true;
        } else {
            setValue('black', black);
            setValue('white', white);
            setValue('blue', blue);
            setValue('green', green);
            setValue('blue-hover', blueHover)
            setValue('green-hover', greenHover)
            setValue('light-shadow', lightShadow)
            setValue('dark-shadow', darkShadow)
            darkIcon.style.transform = 'translate(0, -100%)';
            lightIcon.style.transform = 'translate(0, 0)';
            isDark = false;
        }
    });
    // Draggable slider module
    const nav = document.querySelector('nav');
    const sliders = document.querySelectorAll('.content_slider');
    let isPressed = false,
        velX = 0,
        startX,
        idleId,
        momentumId,
        scrollLeft;
    sliders.forEach((slider) => {
        slider.addEventListener('mousedown', (event) => {
            event.preventDefault();
            isPressed = true;
            slider.style.cursor = 'grabbing';
            startX = event.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelMomentum();
            cancelIdle();
        });
        slider.addEventListener('mouseup', (event) => {
            event.preventDefault();
            isPressed = false;
            slider.style.cursor = 'grab';
            beginMomentum();
        });
        slider.addEventListener('mousemove', (event) => {
            event.preventDefault();
            if (!isPressed) return;
            const x = event.pageX - slider.offsetLeft;
            const walk = x - startX;
            var prevScrollLeft = slider.scrollLeft;
            slider.scrollLeft = scrollLeft - walk;
            velX = slider.scrollLeft - prevScrollLeft;
        });
        slider.addEventListener(
            'wheel',
            (event) => {
                cancelMomentum();
                if (event.deltaX > 10 || event.deltaX < -10) {
                    cancelIdle();
                }
            },
            {passive: true}
        );
        nav.addEventListener('click', () => {
            cancelMomentum();
        });
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    beginIdle();
                }
            });
        }).observe(slider);
        function beginIdle() {
            cancelIdle();
            idleId = requestAnimationFrame(idleLoop);
        }
        function cancelIdle() {
            cancelAnimationFrame(idleId);
        }
        function idleLoop() {
            slider.scrollLeft += 1;
            idleId = requestAnimationFrame(idleLoop);
        }
        function beginMomentum() {
            cancelMomentum();
            momentumId = requestAnimationFrame(momentumLoop);
            setTimeout(() => {
                cancelMomentum();
            }, 5000);
        }
        function cancelMomentum() {
            cancelAnimationFrame(momentumId);
        }
        function momentumLoop() {
            slider.scrollLeft += velX * 2;
            velX *= 0.96;
            if (Math.abs(velX) > 0.5) {
                momentumId = requestAnimationFrame(momentumLoop);
            }
        }
    });
    // Obfuscate email
    const email = document.getElementById('email'),
        user = 'tajdehart',
        site = 'gmail.com';
    email.setAttribute('href', 'mailto:' + user + '@' + site);
    email.innerHTML = user + '@' + site;
    // Carbon value
    const carbon = document.querySelector('footer'),
        domain = encodeURIComponent(window.location.href);
    let newRequest = function (render = true) {
        fetch('https://api.websitecarbon.com/b?url=' + domain)
            .then(function (r) {
                if (!r.ok) {
                    throw Error(r);
                }
                return r.json();
            })
            .then(function (r) {
                if (render) {
                    renderResult(r);
                }
                r.t = new Date().getTime();
                localStorage.setItem(domain, JSON.stringify(r));
            })
            .catch(function (e) {
                carbon.innerHTML = '✦ This website runs on renewable energy ✦';
                localStorage.removeItem(domain);
            });
    };
    const renderResult = function (r) {
        carbon.innerHTML =
            '✦ This page produces ' +
            r.c +
            'g of CO<sub>2</sub>/view, cleaner than ' +
            r.p +
            '% of pages tested ✦';
    };
    if ('fetch' in window) {
        carbon.innerHTML = '✦ Measuring CO<sub>2</sub>&hellip; ✦';
        let cachedResponse = localStorage.getItem(domain);
        const t = new Date().getTime();
        if (cachedResponse) {
            const r = JSON.parse(cachedResponse);
            renderResult(r);
            if (t - r.t > 86400000) {
                newRequest(false);
            }
        } else {
            newRequest();
        }
    }
    // Tooltips
    const wrappers = document.querySelectorAll(".tooltip_wrapper");
    wrappers.forEach((wrapper)=>{
        const tooltip = document.getElementById(`${wrapper.id}-tooltip`);
        console.log(`${wrapper.id}-tooltip`);
        let wasHovered = false,
            leaveDelay = 750,
            stayDelay = 2000;
        wrapper.addEventListener('mouseover', function over() {
            tooltip.style.opacity = "100%"
            setTimeout(()=>{
                endFollow();
            }, stayDelay)
            wrapper.removeEventListener('mouseover', over)

        });
        wrapper.addEventListener('mouseleave', function leave() {
            setTimeout(()=>{
                endFollow();
            }, leaveDelay)
            wrapper.removeEventListener('mouseleave', leave)
        });
        if (tooltip.classList.contains('is-follower')) {
            leaveDelay = 500;
            document.addEventListener('mousemove', function move(event) {
                if (wasHovered) {
                    setTimeout(()=>{
                        document.removeEventListener('mousemove', move)
                    }, leaveDelay)
                };
                tooltip.style.top = `${event.clientY}px`
                tooltip.style.left = `${event.clientX}px`
            });
        }
        function endFollow() {
            wasHovered = true;
            tooltip.style.opacity = "0%";
        }
    });
});