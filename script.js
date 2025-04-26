document.addEventListener('DOMContentLoaded', function() {
    // Initialize preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(preloader);

    // Add scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Add menu toggle for mobile
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(menuToggle);

    // Add theme toggle
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);

    // Wait for full page load
    window.addEventListener('load', function() {
        // Hide preloader
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500);

        initializePortfolio();
    });

    function initializePortfolio() {
        // Mobile menu toggle
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('active');
            
            // Change icon based on state
            if (sidebar.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Theme toggle
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Change icon based on theme
            if (document.body.classList.contains('dark-mode')) {
                this.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            }
        });

        // Check user's preferred theme
        if (localStorage.getItem('theme') === 'dark' || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // Scroll progress indicator
        window.addEventListener('scroll', function() {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            scrollProgress.style.width = progress + '%';
        });

        // Typing effect for hero section
        const heroTitle = document.querySelector('.tagline');
        if (heroTitle) {
            heroTitle.classList.add('typing-effect');
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    heroTitle.classList.remove('typing-effect');
                }
            };
            
            setTimeout(typeWriter, 1000);
        }

        // Animate elements when they come into view
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__fadeIn');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        sections.forEach(section => {
            observer.observe(section);
        });

        // Smooth scroll for navigation
        const navLinks = document.querySelectorAll('.nav-item');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                // Close mobile menu if open
                if (window.innerWidth < 992) {
                    document.querySelector('.sidebar').classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Smooth scroll to the section
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update active navigation
                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Highlight current section in navigation
        window.addEventListener('scroll', highlightNavigation);

        function highlightNavigation() {
            let scrollPosition = window.scrollY;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        // Initialize on page load
        highlightNavigation();

        // Form validation and submission
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simple validation
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                
                if (!name || !email || !subject || !message) {
                    showFormMessage('Please fill in all fields', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showFormMessage('Please enter a valid email address', 'error');
                    return;
                }
                
                // Simulate form submission
                const submitButton = contactForm.querySelector('.submit-btn');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    showFormMessage('Your message has been sent successfully!', 'success');
                    contactForm.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 2000);
            });
        }

        function showFormMessage(message, type) {
            // Remove any existing message
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create new message
            const messageElement = document.createElement('div');
            messageElement.className = `form-message ${type}`;
            messageElement.textContent = message;
            
            // Insert before the submit button
            const submitButton = contactForm.querySelector('.submit-btn');
            contactForm.insertBefore(messageElement, submitButton);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }

        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // Initialize counter animation for stats
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.textContent);
            const suffix = stat.textContent.replace(/[0-9.]/g, '');
            let current = 0;
            const increment = target / 40; // Adjust for animation speed
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    stat.textContent = Math.round(current) + suffix;
                    requestAnimationFrame(updateCounter);
                }
            };
            
            stat.textContent = '0' + suffix;
            
            // Start animation when stats come into view
            const statObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    requestAnimationFrame(updateCounter);
                    statObserver.unobserve(entries[0].target);
                }
            }, { threshold: 0.5 });
            
            statObserver.observe(stat.parentElement);
        });

        // Add hover effects to project cards and skill categories
        const projectCards = document.querySelectorAll('.project-card');
        const skillCategories = document.querySelectorAll('.skill-category');
        
        [...projectCards, ...skillCategories].forEach(element => {
            element.classList.add('hover-float');
        });

        // Add gradient text effect
        const heroName = document.querySelector('.highlight-text');
        if (heroName) {
            heroName.classList.add('gradient-text');
        }

        // Add particles background to hero section if particles.js is available
        const heroSection = document.getElementById('about');
        if (heroSection && typeof particlesJS !== 'undefined') {
            const particlesContainer = document.createElement('div');
            particlesContainer.id = 'particles-js';
            heroSection.insertBefore(particlesContainer, heroSection.firstChild);
            
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#2563eb'
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#2563eb',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        }

        // Add AOS animations as a fallback if IntersectionObserver isn't supported
        if (!('IntersectionObserver' in window)) {
            // Simple scroll animation fallback
            window.addEventListener('scroll', function() {
                sections.forEach(section => {
                    const sectionTop = section.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (sectionTop < windowHeight * 0.75) {
                        section.classList.add('animate__fadeIn');
                    }
                });
            });
        }

        // Add glowing effect to CTAs and important buttons
        const ctaButtons = document.querySelectorAll('.cta-primary, .submit-btn');
        ctaButtons.forEach(button => {
            button.classList.add('glow-effect');
        });

        // Handle print resume functionality
        /*const printButton = document.createElement('button');
        printButton.className = 'print-resume';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print Resume';
        printButton.style.position = 'fixed';
        printButton.style.bottom = '2rem';
        printButton.style.left = '2rem';
        printButton.style.padding = '0.8rem 1.5rem';
        printButton.style.backgroundColor = 'var(--primary)';
        printButton.style.color = 'white';
        printButton.style.border = 'none';
        printButton.style.borderRadius = 'var(--border-radius)';
        printButton.style.cursor = 'pointer';
        printButton.style.zIndex = '999';
        printButton.style.boxShadow = 'var(--shadow)';
        printButton.style.display = 'none'; // Hidden by default
        
        document.body.appendChild(printButton);
        
        // Show print button on experience and education sections
        window.addEventListener('scroll', function() {
            const experienceSection = document.getElementById('experience');
            const educationSection = document.getElementById('education');
            
            if (!experienceSection || !educationSection) return;
            
            const expTop = experienceSection.getBoundingClientRect().top;
            const eduBottom = educationSection.getBoundingClientRect().bottom;
            
            if (expTop < window.innerHeight && eduBottom > 0) {
                printButton.style.display = 'flex';
            } else {
                printButton.style.display = 'none';
            }
        });
        
        printButton.addEventListener('click', function() {
            window.print();
        });*/
    }
});
