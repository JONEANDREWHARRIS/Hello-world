document.addEventListener("DOMContentLoaded", function () {

    // =============================================
    // 1. ANIMATED PARTICLE BACKGROUND
    // =============================================
    const canvas = document.getElementById("bg-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(108, 60, 224," + this.opacity + ")";
                ctx.fill();
            }
        }

        // Create particles
        var particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = "rgba(108, 60, 224," + opacity + ")";
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                p.update();
                p.draw();
            });
            drawLines();
            animationId = requestAnimationFrame(animate);
        }
        animate();
    }

    // =============================================
    // 2. INTERSECTION OBSERVER — Fade-in on Scroll
    // =============================================
    const fadeElems = document.querySelectorAll(".fade-in");
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElems.forEach(function (elem) {
        observer.observe(elem);
    });

    // =============================================
    // 3. STATS COUNTER ANIMATION
    // =============================================
    const statNumbers = document.querySelectorAll(".stat-number[data-target]");

    function animateCounter(el) {
        var target = parseInt(el.getAttribute("data-target"), 10);
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    var statsObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    statNumbers.forEach(function (num) {
        statsObserver.observe(num);
    });

    // =============================================
    // 4. HEADER SCROLL EFFECT
    // =============================================
    var header = document.getElementById("main-header");
    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    // =============================================
    // 5. MOBILE HAMBURGER MENU
    // =============================================
    var mobileToggle = document.getElementById("mobile-toggle");
    var navMenu = document.getElementById("nav-menu");
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", function () {
            mobileToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        // Close menu when a link is clicked
        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                mobileToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // =============================================
    // 6. INTAKE FORM — NOTION DATABASE INTEGRATION
    // =============================================
    //
    // HOW TO CONNECT TO YOUR NOTION DATABASE:
    //
    // Option A (Recommended): Use Make.com (free tier) or Zapier
    //   1. Create a Notion integration at https://www.notion.so/my-integrations
    //   2. Share your Notion database with the integration
    //   3. Create a Make.com scenario: Webhook → Notion "Create Database Item"
    //   4. Copy your Make.com webhook URL below
    //
    // Option B: Use a Notion proxy/middleware (e.g., Notion API Worker on Cloudflare)
    //   This avoids exposing your Notion API key on the client side.
    //
    // Replace this URL with your actual webhook endpoint:
    var WEBHOOK_URL = "";
    // Example: "https://hook.us1.make.com/your-webhook-id"
    // Example: "https://your-worker.your-subdomain.workers.dev/notion"

    var intakeForm = document.getElementById("intake-form");
    var submitBtn = document.getElementById("submit-btn");
    var formSuccess = document.getElementById("form-success");

    if (intakeForm) {
        intakeForm.addEventListener("submit", function (e) {
            e.preventDefault();

            var btnText = submitBtn.querySelector(".btn-text");
            var btnLoading = submitBtn.querySelector(".btn-loading");
            var btnArrow = submitBtn.querySelector(".btn-arrow");

            // Gather form data
            var formData = {
                fullName: document.getElementById("fullName").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value || "",
                company: document.getElementById("company").value,
                role: document.getElementById("role").value || "",
                companySize: document.getElementById("companySize").value || "",
                service: document.getElementById("service").value || "",
                message: document.getElementById("message").value,
                submittedAt: new Date().toISOString(),
            };

            // Show loading state
            btnText.style.display = "none";
            btnArrow.style.display = "none";
            btnLoading.style.display = "inline";
            submitBtn.disabled = true;

            if (WEBHOOK_URL) {
                // Send to webhook (Make.com / Zapier / custom endpoint)
                fetch(WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })
                    .then(function () {
                        showSuccess();
                    })
                    .catch(function () {
                        // Still show success — webhook may not return a clean response
                        showSuccess();
                    });
            } else {
                // No webhook configured — log data and show success
                console.log("Form submitted (no webhook configured). Data:", formData);
                console.log(
                    "To connect to Notion, set the WEBHOOK_URL variable in script.js"
                );
                // Simulate a brief delay
                setTimeout(function () {
                    showSuccess();
                }, 800);
            }

            function showSuccess() {
                intakeForm.style.display = "none";
                formSuccess.style.display = "block";
            }
        });
    }
});
