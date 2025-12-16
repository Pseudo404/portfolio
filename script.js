document.addEventListener('DOMContentLoaded', () => {
    //API
    emailjs.init("eJL2DGD0XRV3Z41sG");
    //wallpaper
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.18 - dist / 1500})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    animate();

    //carrousel
    function initInfiniteScroll(wrapperId, speed = 0.5, reverse = false) {
        const wrapper = document.getElementById(wrapperId);
        const track = wrapper.querySelector('.skills-track');

        const images = track.querySelectorAll('img');
        let loadedCount = 0;

        function startAnimation() {
            const originalContent = track.innerHTML;
            track.innerHTML = originalContent + originalContent + originalContent + originalContent + originalContent;

            const originalWidth = track.scrollWidth / 5;
            let x = -originalWidth;

            track.style.transform = `translateX(${x}px)`;
            track.style.willChange = "transform";

            function animate() {
                if (!reverse) {
                    x -= speed;
                    if (x <= -originalWidth * 2.5968) x = -originalWidth;
                } else {
                    x += speed;
                    if (x >= 0) x = -originalWidth * 1.712;
                }
                track.style.transform = `translateX(${x}px)`;
                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        }

        if (images.length === 0) {
            startAnimation();
        } else {
            images.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.onload = img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === images.length) startAnimation();
                    };
                }
            });
            if (loadedCount === images.length) startAnimation();
        }
    }

    window.addEventListener('load', () => {
        initInfiniteScroll('track1-wrapper', 0.5, false);
        initInfiniteScroll('track2-wrapper', 0.5, true);
    });

    //typer
    const phrases = [
        "Développeur Full-Stack",
        "Étudiant de 1re année",
        "CODA_ School",
    ];
    let index = 0;
    let charIndex = 0;
    let right = false;
    const h3 = document.getElementById("type");

    function type() {
        const Phrase = phrases[index];

        if (right) {
            h3.textContent = Phrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            h3.textContent = Phrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = right ? 50 : 100;

        if (!right && charIndex === Phrase.length) {
            speed = 2000;
            right = true;
        } else if (right && charIndex === 0) {
            right = false;
            index = (index + 1) % phrases.length;
            speed = 500;
        }
        setTimeout(type, speed);
    }
    type();

    //contact
    document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const params = {
        name: document.getElementById("name").value,
        prenom: document.getElementById("prenom").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    emailjs.send("service_o0xc9by", "template_opkdnkn", params)
        .then(() => {
            alert("Message envoyé !");
            document.getElementById("contact-form").reset();
        })
        .catch((err) => {
            console.error("Erreur :", err);
            alert("Une erreur est survenue.");
        });
    });
});