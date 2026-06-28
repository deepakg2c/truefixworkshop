// ===== MOBILE MENU =====
function toggleMenu() {
    const nav = document.querySelector('nav ul');
    const hamburger = document.getElementById('hamburger-btn');
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    hamburger.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('nav ul').classList.remove('open');
        document.getElementById('hamburger-btn').innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== SLIDER =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
}

function changeSlide(direction) {
    let newIndex = currentSlide + direction;
    if (newIndex < 0) newIndex = slides.length - 1;
    if (newIndex >= slides.length) newIndex = 0;
    showSlide(newIndex);
    resetInterval();
}

function goToSlide(index) {
    showSlide(index);
    resetInterval();
}

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => changeSlide(1), 5000);
}

slideInterval = setInterval(() => changeSlide(1), 5000);

// Touch swipe for slider
let touchStartX = 0;
document.querySelector('.slider-container')?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
});
document.querySelector('.slider-container')?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
});

// ===== SMOOTH NAVIGATION =====
document.querySelectorAll('nav a, .slide a, .footer-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('.section, .hero');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 130;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'default') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3500);
}

// ===== CONTACT FORM → WHATSAPP =====
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = this.querySelector('input[type="text"]').value.trim();
    const email = this.querySelector('input[type="email"]').value.trim();
    const phone = this.querySelector('input[type="tel"]').value.trim();
    const service = this.querySelector('select').value;
    const message = this.querySelector('textarea').value.trim();

    // 10-digit phone validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (phone && phoneDigits.length !== 10) {
        showToast('⚠️ Phone number should be 10 digit', 'error');
        this.querySelector('input[type="tel"]').focus();
        return;
    }

    const text =
        `🔧 *New Service Request - TrueFix Workshop*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📧 *Email:* ${email || 'Not provided'}\n` +
        `📞 *Phone:* ${phone || 'Not provided'}\n` +
        `🚗 *Service Needed:* ${service}\n` +
        `💬 *Message:* ${message || 'No message'}`;

    const whatsappURL = `https://wa.me/918755106417?text=${encodeURIComponent(text)}`;

    const btn = this.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
    btn.disabled = true;

    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        showToast('✅ WhatsApp open ho raha hai!', 'success');
        this.reset();
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
    }, 800);
});

// ===== STATS COUNTER ANIMATION =====
function animateCounter(el, target) {
    let count = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
        count += step;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        el.textContent = count.toLocaleString();
    }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statsObserver.observe(el));

// ===== SCROLL ANIMATION FOR CARDS =====
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .review-card').forEach(card => {
    card.style.animationPlayState = 'paused';
    scrollObserver.observe(card);
});

// ===== STAR RATING INPUT =====
let selectedRating = 0;
const starInputs = document.querySelectorAll('.stars-input i');

starInputs.forEach(star => {
    star.addEventListener('mouseover', function () {
        const val = parseInt(this.dataset.val);
        starInputs.forEach((s, i) => {
            s.className = i < val ? 'fas fa-star' : 'far fa-star';
        });
    });

    star.addEventListener('mouseout', () => {
        starInputs.forEach((s, i) => {
            s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
        });
    });

    star.addEventListener('click', function () {
        selectedRating = parseInt(this.dataset.val);
        starInputs.forEach((s, i) => {
            s.classList.toggle('active', i < selectedRating);
            s.className = (i < selectedRating ? 'fas fa-star active' : 'far fa-star');
        });
    });
});

// ===== SUBMIT REVIEW =====
function submitReview() {
    const name = document.getElementById('reviewName').value.trim();
    const service = document.getElementById('reviewService').value.trim();
    const text = document.getElementById('reviewText').value.trim();

    if (!name) return showToast('⚠️ Please enter your name.', 'error');
    if (!selectedRating) return showToast('⚠️ Please select a star rating.', 'error');
    if (!text) return showToast('⚠️ Please write your review.', 'error');

    // Build star HTML
    let starHTML = '';
    for (let i = 1; i <= 5; i++) {
        starHTML += `<i class="${i <= selectedRating ? 'fas' : 'far'} fa-star"></i>`;
    }

    // Initial of name
    const initial = name.charAt(0).toUpperCase();

    const newCard = document.createElement('div');
    newCard.className = 'review-card';
    newCard.style.opacity = '0';
    newCard.style.transform = 'translateY(20px)';
    newCard.style.transition = 'all 0.5s ease';
    newCard.innerHTML = `
        <div class="review-stars">${starHTML}</div>
        <p class="review-text">"${text}"</p>
        <div class="review-author">
            <div class="review-avatar">${initial}</div>
            <div>
                <strong>${name}</strong>
                <span>${service || 'Customer'}</span>
            </div>
        </div>
    `;

    const grid = document.getElementById('reviewsGrid');
    grid.prepend(newCard);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateY(0)';
        });
    });

    // Reset form
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewService').value = '';
    document.getElementById('reviewText').value = '';
    selectedRating = 0;
    starInputs.forEach(s => {
        s.className = 'far fa-star';
        s.classList.remove('active');
    });

    showToast('🎉 Thank you for your review, ' + name + '!', 'success');
}

// ===== BRAND ITEM HOVER SOUND ALTERNATIVE - Add cursor effect =====
document.querySelectorAll('.brand-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.boxShadow = '0 8px 20px rgba(245,197,24,0.35)';
    });
    item.addEventListener('mouseleave', function () {
        this.style.boxShadow = '';
    });
});