document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi EmailJS dengan proteksi agar tidak crash jika library gagal dimuat
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init("YOUR_PUBLIC_KEY");
        } catch (err) {
            console.error("Gagal inisialisasi EmailJS:", err);
        }
    }

    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const hour = new Date().getHours();
        let message = "Halo!";

        if (hour < 12) {
            message = "Selamat Pagi!";
        } else if (hour < 18) {
            message = "Selamat Siang!";
        } else {
            message = "Selamat Malam!";
        }
        greetingElement.textContent = message + " Selamat Datang di Portofolio Saya.";
    }

    // 2. Update tahun dengan pengecekan elemen agar tidak error
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Efek shadow pada navbar saat scroll
    const navbar = document.querySelector('.navbar');
    // Fungsionalitas Menu Hamburger
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = menuToggle.classList.toggle('is-active'); // Toggle class pada menu-toggle
        navLinksContainer.classList.toggle('active'); // Tetap toggle class 'active' pada nav-links
        navOverlay.classList.toggle('active');
        
        // Update Aksesibilitas
        menuToggle.setAttribute('aria-expanded', isActive);
    });

    // Fungsi pembantu untuk menutup menu
    const closeMenu = () => {
        navLinksContainer.classList.remove('active');
        navOverlay.classList.remove('active');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    // Tutup menu jika klik di luar navbar
    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Tutup menu saat overlay diklik
    navOverlay.addEventListener('click', closeMenu);

    // Penanda Navigasi Aktif
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    function setActiveLink() {
        let currentActive = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - (navbar.offsetHeight + 10); 
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop) {
                currentActive = section.getAttribute('id');
            }
        });

        // Handle 'home' section separately if needed, or ensure its ID matches
        // For the hero section, if it's not a <section> tag, you might need a different approach
        // For this example, let's assume 'home' is the ID of the hero header
        const heroSection = document.getElementById('home');
        if (heroSection && window.scrollY < heroSection.offsetHeight - navbar.offsetHeight) {
            currentActive = 'home';
        }

        navLinks.forEach(link => {
            link.classList.remove('active-nav-link');
            if (currentActive && link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active-nav-link');
            }
        });
    }

    // Tutup menu saat link diklik (untuk mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Intersection Observer untuk animasi fade-in saat scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Hanya jalankan animasi sekali
            }
        });
    }, { threshold: 0.05 }); // Dibuat lebih kecil (5%) agar elemen muncul lebih cepat

    revealElements.forEach(el => revealObserver.observe(el));

    // Logika Tombol Kembali ke Atas
    const backToTopBtn = document.getElementById('back-to-top');

    // Gabungkan semua event listener scroll ke dalam satu fungsi untuk performa lebih baik
    window.addEventListener('scroll', () => {
        // Shadow Navbar
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        
        // Back to Top Button
        backToTopBtn.classList.toggle('show', window.scrollY > 400);
        
        // Active Link Highlight
        setActiveLink();
    });
    window.addEventListener('load', setActiveLink); // Set active link on page load

    // Penanganan Formulir Kontak
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.textContent;
            
            // Ubah status tombol saat mengirim
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;

            // 3. Kirim menggunakan EmailJS hanya jika library tersedia
            if (typeof emailjs !== 'undefined' && typeof emailjs.sendForm === 'function') {
                emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
                .then(() => {
                    alert('Terima kasih! Pesan Anda telah berhasil dikirim.');
                    contactForm.reset();
                }, (error) => {
                    alert('Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.');
                    console.error('FAILED...', error);
                })
                .finally(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
            } else {
                alert('Maaf, layanan pengiriman pesan sedang tidak tersedia.');
                submitBtn.disabled = false;
            }
        });
    }
});