// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        offset: 100
    });
    
    // Sticky Navigation
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.padding = '10px 0';
            nav.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.padding = '20px 0';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.querySelector('i').classList.toggle('fa-bars');
        menuBtn.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.querySelector('i').classList.add('fa-bars');
            menuBtn.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // Active link state on scroll
    const sections = document.querySelectorAll('section');
    const navLinks2 = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks2.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else if (card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    const setupCertRowScrolling = () => {
        const rows = document.querySelectorAll('.cert-row');
        
        rows.forEach(row => {
            const scrollContainer = row.querySelector('.cert-row-scroll');
            const leftArrow = row.querySelector('.scroll-arrow.left');
            const rightArrow = row.querySelector('.scroll-arrow.right');
            
            // Hide left arrow initially
            leftArrow.style.opacity = '0.3';
            
            // Check scroll position
            const checkScrollPosition = () => {
                const isAtStart = scrollContainer.scrollLeft <= 10;
                const isAtEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10;
                
                leftArrow.style.opacity = isAtStart ? '0.3' : '0.7';
                rightArrow.style.opacity = isAtEnd ? '0.3' : '0.7';
            };
            
            // Initial check
            checkScrollPosition();
            
            // Scroll left
            leftArrow.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
            });
            
            // Scroll right
            rightArrow.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
            });
            
            // Update arrow states on scroll
            scrollContainer.addEventListener('scroll', checkScrollPosition);
        });
    };
    
    // Initialize certification filters if they exist
    const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
    if (certFilterBtns.length > 0) {
        setupCertRowScrolling();
        
        certFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                certFilterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide rows based on filter
                const rows = document.querySelectorAll('.cert-row');
                
                if (filterValue === 'all') {
                    // Show all rows
                    rows.forEach(row => {
                        row.classList.remove('hidden');
                    });
                } else {
                    // Show only the matching row and hide others
                    rows.forEach(row => {
                        if (row.getAttribute('data-priority-row') === filterValue) {
                            row.classList.remove('hidden');
                        } else {
                            row.classList.add('hidden');
                        }
                    });
                }
            });
        });
    }
    
    // Drag to scroll functionality
    const certRowScrolls = document.querySelectorAll('.cert-row-scroll');
    certRowScrolls.forEach(scrollContainer => {
        let isDragging = false;
        let startX;
        let scrollLeft;
        
        scrollContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
            scrollContainer.style.cursor = 'grabbing';
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
            isDragging = false;
            scrollContainer.style.cursor = 'grab';
        });
        
        scrollContainer.addEventListener('mouseup', () => {
            isDragging = false;
            scrollContainer.style.cursor = 'grab';
        });
        
        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        scrollContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });
        
        scrollContainer.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        scrollContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
    });
    
    // Contact Form Animation
    const inputs = document.querySelectorAll('.input-group input, .input-group textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focus');
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentNode.classList.remove('focus');
            }
        });
    });
    
    // Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Format the message body with user details
            const messageBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
            
            // Create mailto URL with all the parameters
            const mailtoUrl = `mailto:dcsangeeth@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;
            
            // Open the mail client
            window.location.href = mailtoUrl;
            
            // Show a message that email client should open
            const formMessage = document.getElementById('formMessage');
            if (formMessage) {
                formMessage.textContent = "Opening your email client...";
                formMessage.style.color = "green";
            }
            
            // Optional: Reset the form after sending
            contactForm.reset();
        });
    }
    // Add typing animation to hero text
    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text h2');
    
    if (heroTitle && heroSubtitle) {
        // Function to add typing animation class
        const addTypingAnimation = (element, delay) => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.classList.add('typing-animation');
                element.style.opacity = '1';
            }, delay);
        };
        
        // Apply typing animations
        addTypingAnimation(heroTitle, 500);
        addTypingAnimation(heroSubtitle, 1500);
    }
    
    // Timeline scroll animation enhancements
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-timeline');
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
});