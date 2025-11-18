// Debounce function para otimizar eventos
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }, { passive: true });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, { passive: true });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.querySelector('.main-image img');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImage.src = thumb.src;
            });
        });
    }

    // Só animar em desktop para performance
    const shouldAnimate = !window.matchMedia('(max-width: 768px)').matches && 
                          !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const animatedElements = document.querySelectorAll('.service-card, .product-card, .feature, .stat');
    
    if (shouldAnimate && 'IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    const updateNavbar = debounce(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar?.classList.add('navbar-hidden');
        } else {
            navbar?.classList.remove('navbar-hidden');
        }
        lastScroll = currentScroll;
    }, 10);

    window.addEventListener('scroll', updateNavbar, { passive: true });

    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // WhatsApp dropdown toggle
    const whatsappTrigger = document.getElementById('whatsappTrigger');
    const whatsappDropdown = document.querySelector('.whatsapp-dropdown');
    
    if (whatsappTrigger && whatsappDropdown) {
        whatsappTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            whatsappDropdown.classList.toggle('active');
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!whatsappDropdown.contains(e.target)) {
                whatsappDropdown.classList.remove('active');
            }
        });

        // Fechar dropdown ao clicar em uma opção
        const whatsappOptions = document.querySelectorAll('.whatsapp-option');
        whatsappOptions.forEach(option => {
            option.addEventListener('click', () => {
                whatsappDropdown.classList.remove('active');
            });
        });
    }

    // Lazy loading para imagens
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sem IntersectionObserver
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
        });
    }

    });
