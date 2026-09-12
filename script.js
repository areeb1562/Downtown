/**
 * MY DOWNTOWN - Interactive Web Application Logic
 * Preloader: 0.5s (500ms) Shutter Roll-Up
 * Cards: 5:4 aspect ratio 2-column grid, opening clean menu modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const preloader = document.getElementById('preloader');
  const brandCards = document.querySelectorAll('.brand-card');

  // Modal Elements
  const menuModal = document.getElementById('menuModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBrandTitle = document.getElementById('modalBrandTitle');
  const modalHeaderImg = document.getElementById('modalHeaderImg');
  const pdfLinkBtn = document.getElementById('pdfLinkBtn');
  const menuStage = document.getElementById('menuStage');
  const menuViewerContainer = document.getElementById('menuViewerContainer');

  // Brand Data Dictionary (Points to specific menu files)
  const brandData = {
    'Teapetti': {
      title: 'Teapetti',
      logo: 'Logo/Teapetti.webp',
      pdf: 'Menu/Teapetti.pdf',
      pages: [
        'Menu/Teapetti_page_1.webp'
      ]
    },
    'Artik': {
      title: 'Artik',
      logo: 'Logo/Artik.webp',
      pdf: 'Menu/Artik.pdf',
      pages: [
        'Menu/Artik_page_1.webp',
        'Menu/Artik_page_2.webp',
        'Menu/Artik_page_3.webp'
      ]
    },
    'B Alaban': {
      title: 'B Alaban',
      logo: 'Logo/B Alaban.webp',
      pdf: 'Menu/B Alaban.pdf',
      pages: [
        'Menu/B_Alaban_page_1.webp'
      ]
    },
    'Cygrill': {
      title: 'Cygrill',
      logo: 'Logo/Cygrill.webp',
      pdf: 'Menu/Cygrill.pdf',
      pages: [
        'Menu/Cygrill_page_1.webp'
      ]
    },
    'Dosa Talkies': {
      title: 'Dosa Talkies',
      logo: 'Logo/Dosa_Talkies.webp',
      pdf: 'Menu/Dosa Talkies.pdf',
      pages: [
        'Menu/Dosa_Talkies_page_1.webp',
        'Menu/Dosa_Talkies_page_2.webp',
        'Menu/Dosa_Talkies_page_3.webp'
      ]
    },
    'Holy Crepe': {
      title: 'Holy Crepe',
      logo: 'Logo/Hole Crepe.webp',
      pdf: 'Menu/Holy Crepe.pdf',
      pages: [
        'Menu/Holy_Crepe_page_1.webp',
        'Menu/Holy_Crepe_page_2.webp'
      ]
    },
    'Grid': {
      title: 'Grid',
      logo: 'Logo/Grid.webp',
      pdf: 'Menu/Grid.pdf',
      pages: [
        'Menu/Grid_page_1.webp'
      ]
    }
  };

  /* ==========================================================================
     1. PRELOADER & ASSET PRELOADING LOGIC (Interactive Tap / Click to Open)
     ========================================================================== */
  document.body.classList.add('preloading');

  // Preload brand images and menu page 1 in background for instant, crisp rendering
  Object.values(brandData).forEach(b => {
    if (b.logo) {
      const img = new Image();
      img.src = b.logo;
    }
    if (b.pages) {
      b.pages.forEach(p => {
        const pageImg = new Image();
        pageImg.src = p;
      });
    }
  });

  let isPreloaderDismissed = false;

  function dismissPreloader() {
    if (isPreloaderDismissed) return;
    isPreloaderDismissed = true;

    if (preloader) {
      preloader.classList.add('preloader--exit');
      document.body.classList.remove('preloading');

      if (navigator.vibrate) {
        navigator.vibrate(25);
      }

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 850);
    }
  }

  // Open on clicking/tapping anywhere on the preloader shutter or CTA button
  preloader?.addEventListener('click', dismissPreloader);
  preloader?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      dismissPreloader();
    }
  });

  /* ==========================================================================
     2. OPEN / CLOSE MENU MODAL
     ========================================================================== */
  function openMenuModal(brandKey) {
    const brand = brandData[brandKey] || brandData['Cygrill'];

    // Set Header & Brand content
    modalBrandTitle.textContent = brand.title;
    modalHeaderImg.src = brand.logo;
    modalHeaderImg.alt = `${brandKey} Logo`;
    pdfLinkBtn.href = brand.pdf;

    // Prefetch PDF in background for instant opening
    if (brand.pdf) {
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = brand.pdf;
      document.head.appendChild(prefetchLink);
    }

    // Render all pages for this menu
    if (menuStage) {
      menuStage.innerHTML = '';
      brand.pages.forEach((pageSrc, index) => {
        const img = document.createElement('img');
        img.src = pageSrc;
        img.alt = `${brandKey} Menu Page ${index + 1}`;
        img.className = 'menu-page-img';
        img.loading = index === 0 ? 'eager' : 'lazy';
        img.draggable = false;
        menuStage.appendChild(img);
      });
    }

    // Reset container scroll to top
    if (menuViewerContainer) {
      menuViewerContainer.scrollTop = 0;
    }

    // Show Modal
    menuModal.classList.add('is-open');
    menuModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Optional subtle haptic
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  }

  function closeMenuModal() {
    menuModal.classList.remove('is-open');
    menuModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Card click triggers
  brandCards.forEach(card => {
    const brandName = card.getAttribute('data-brand');

    card.addEventListener('click', () => {
      openMenuModal(brandName);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenuModal(brandName);
      }
    });
  });

  // Modal Close Events
  modalCloseBtn?.addEventListener('click', closeMenuModal);
  modalBackdrop?.addEventListener('click', closeMenuModal);

  // Keyboard Escape Key to Close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuModal.classList.contains('is-open')) {
      closeMenuModal();
    }
  });

});
