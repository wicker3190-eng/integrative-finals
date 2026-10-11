const track = document.getElementById('carouselTrack');

if (track) {
    const VISIBLE = 5;                       // slides shown at once
    const originals = Array.from(track.children);
    const total = originals.length;          // 10
    const dotsBox = document.getElementById('carouselDots');

    // Clone the first VISIBLE slides onto the end so the window can wrap
    // smoothly: ...9,10,1,2,3 -> then snaps back to 1,2,3,4,5
    originals.slice(0, VISIBLE).forEach(s => track.appendChild(s.cloneNode(true)));

    let current = 0;                         // index of the first visible slide

    originals.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => move(i));
        dotsBox.appendChild(dot);
    });

    function render(animate) {
        track.classList.toggle('snap', !animate);
        track.style.transition = animate ? '' : 'none';
        track.style.transform = `translateX(-${current * (100 / VISIBLE)}%)`;
        // fade only the first and last of the 5 visible slides
        Array.from(track.children).forEach((s, i) => {
            s.classList.toggle('edge', i === current || i === current + VISIBLE - 1);
        });
        document.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === current % total);
        });
        if (!animate) { track.offsetWidth; track.style.transition = ''; track.classList.remove('snap'); } // flush
    }

    function move(idx) {
        if (idx < 0) {                       // going back past the start: jump to the clone area first
            current = total;
            render(false);
            idx = total - 1;
        }
        current = idx;
        render(true);
    }

    // After sliding onto the cloned set, silently snap back to the real one
    track.addEventListener('transitionend', () => {
        if (current >= total) { current -= total; render(false); }
    });

    // Slide by one: each step the new slide enters on the right and the leftmost leaves
    document.getElementById('prevBtn').addEventListener('click', () => move(current - 1));
    document.getElementById('nextBtn').addEventListener('click', () => move(current + 1));

    render(false);

    let autoplay = setInterval(() => move(current + 1), 5000);
    const wrapper = document.querySelector('.carousel-wrapper');
    wrapper.addEventListener('mouseenter', () => clearInterval(autoplay));
    wrapper.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => move(current + 1), 5000);
    });
}
