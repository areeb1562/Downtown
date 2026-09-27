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
  const callLinkBtn = document.getElementById('callLinkBtn');
  const menuStage = document.getElementById('menuStage');
  const menuViewerContainer = document.getElementById('menuViewerContainer');

  // Brand Data Dictionary with Phone Numbers
  const brandData = {
    'Teapetti': {
      title: 'Teapetti',
      logo: 'Logo/Teapetti.webp',
      pdf: 'Menu/Teapetti.pdf',
      phone: null,
      pages: [
        'Menu/Teapetti_page_1.webp'
      ]
    },
    'Artik': {
      title: 'Artik',
      logo: 'Logo/Artik.webp',
      pdf: 'Menu/Artik.pdf',
      phone: '+919400363661',
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
      phone: '+919946014403',
      pages: [
        'Menu/B_Alaban_page_1.webp'
      ]
    },
    'Cygrill': {
      title: 'Cygrill',
      logo: 'Logo/Cygrill.webp',
      pdf: 'Menu/Cygrill.pdf',
      phone: '+919544858000',
      pages: [
        'Menu/Cygrill_page_1.webp'
      ]
    },
    'Dosa Talkies': {
      title: 'Dosa Talkies',
      logo: 'Logo/Dosa_Talkies.webp',
      pdf: 'Menu/Dosa Talkies.pdf',
      phone: '+917907294612',
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
      phone: '+918157005774',
      pages: [
        'Menu/Holy_Crepe_page_1.webp',
        'Menu/Holy_Crepe_page_2.webp'
      ]
    },
    'Grid': {
      title: 'Grid',
      logo: 'Logo/Grid.webp',
      pdf: 'Menu/Grid.pdf',
      phone: '+919074264141',
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
     2. MULTI-TOUCH PINCH-TO-ZOOM & PAN ENGINE (Focal Point Scaling & Free Drag)
     ========================================================================== */
  let currentScale = 1;
  let translateX = 0;
  let translateY = 0;
  const minScale = 1;
  const maxScale = 5;

  let initialPinchDistance = 0;
  let initialScale = 1;
  let initialTranslateX = 0;
  let initialTranslateY = 0;
  let initialFocalRelX = 0;
  let initialFocalRelY = 0;
  let isPinching = false;

  let lastTouchX = 0;
  let lastTouchY = 0;
  let isDragging = false;
  let lastTapTime = 0;

  function getContainerCenter(container) {
    const rect = container.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    };
  }

  function updateTransform(applyClamp = false) {
    if (!menuStage || !menuViewerContainer) return;

    if (currentScale <= 1) {
      currentScale = 1;
      translateX = 0;
      translateY = 0;
      menuStage.style.transform = '';
      menuViewerContainer.classList.remove('is-zoomed');
      return;
    }

    menuViewerContainer.classList.add('is-zoomed');

    if (applyClamp) {
      clampTranslations();
    }

    menuStage.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${currentScale})`;
  }

  function clampTranslations() {
    if (!menuViewerContainer || !menuStage) return;

    const cRect = menuViewerContainer.getBoundingClientRect();
    const stageWidth = cRect.width;
    const stageHeight = menuStage.offsetHeight || cRect.height;

    const maxPanX = Math.max(0, (stageWidth * (currentScale - 1)) / 2 + 40);
    const maxPanY = Math.max(0, (stageHeight * currentScale - cRect.height) / 2 + 60);

    translateX = Math.max(-maxPanX, Math.min(maxPanX, translateX));
    translateY = Math.max(-maxPanY, Math.min(maxPanY, translateY));
  }

  function resetZoom(animated = true) {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    isPinching = false;
    isDragging = false;

    if (menuStage) {
      if (animated) {
        menuStage.classList.add('is-animating');
        setTimeout(() => {
          menuStage.classList.remove('is-animating');
        }, 300);
      } else {
        menuStage.classList.remove('is-animating');
      }
      menuStage.style.transform = '';
    }
    if (menuViewerContainer) {
      menuViewerContainer.classList.remove('is-zoomed');
    }
  }

  // Touch Gesture Listeners on Menu Viewer Container
  if (menuViewerContainer) {
    menuViewerContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        // Two-Finger Pinch Zoom with exact Focal Point Tracking
        e.preventDefault();
        isPinching = true;
        isDragging = false;
        menuStage?.classList.remove('is-animating');

        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const center = getContainerCenter(menuViewerContainer);
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        initialFocalRelX = midX - center.centerX;
        initialFocalRelY = midY - center.centerY;

        initialScale = currentScale;
        initialTranslateX = translateX;
        initialTranslateY = translateY;
      } else if (e.touches.length === 1) {
        // Single finger touch: panning if already zoomed
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;

        if (currentScale > 1.02) {
          isDragging = true;
          menuStage?.classList.remove('is-animating');
        }
      }
    }, { passive: false });

    menuViewerContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && isPinching) {
        e.preventDefault();

        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        if (initialPinchDistance > 0) {
          const pinchFactor = currentDistance / initialPinchDistance;
          const targetScale = Math.min(Math.max(initialScale * pinchFactor, 0.85), maxScale);

          const center = getContainerCenter(menuViewerContainer);
          const currentMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const currentMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const currentFocalRelX = currentMidX - center.centerX;
          const currentFocalRelY = currentMidY - center.centerY;

          // Focal Point Zoom Formula: anchor zoom exactly around touch midpoint
          currentScale = targetScale;
          translateX = currentFocalRelX - ((initialFocalRelX - initialTranslateX) * (currentScale / initialScale));
          translateY = currentFocalRelY - ((initialFocalRelY - initialTranslateY) * (currentScale / initialScale));

          updateTransform(false);
        }
      } else if (e.touches.length === 1 && isDragging && currentScale > 1.02) {
        // Fluid free dragging when zoomed
        e.preventDefault();

        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;

        translateX += dx;
        translateY += dy;

        updateTransform(false);
      }
    }, { passive: false });

    menuViewerContainer.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        isPinching = false;
        isDragging = false;
        initialPinchDistance = 0;

        // If zoomed out below 1x, cleanly snap back to 1x
        if (currentScale <= 1.05) {
          resetZoom(true);
        } else {
          // Keep user's exact zoom level and smoothly clamp edge boundaries if dragged too far
          menuStage?.classList.add('is-animating');
          updateTransform(true);
          setTimeout(() => {
            menuStage?.classList.remove('is-animating');
          }, 280);
        }

        // Optional Double Tap to toggle zoom at tap focal position
        const now = Date.now();
        if (now - lastTapTime < 320 && now - lastTapTime > 60) {
          if (currentScale > 1.2) {
            resetZoom(true);
          } else {
            currentScale = 2.4;
            translateX = 0;
            translateY = 0;
            menuStage?.classList.add('is-animating');
            updateTransform(true);
            setTimeout(() => {
              menuStage?.classList.remove('is-animating');
            }, 280);
          }
          lastTapTime = 0;
        } else {
          lastTapTime = now;
        }
      } else if (e.touches.length === 1) {
        // Transitioned from 2-finger pinch to 1-finger hold
        isPinching = false;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        if (currentScale > 1.02) {
          isDragging = true;
          menuStage?.classList.remove('is-animating');
        }
      }
    });

    // Desktop / Trackpad Mouse Wheel Focal Point Zoom (Ctrl + Wheel)
    menuViewerContainer.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const center = getContainerCenter(menuViewerContainer);
        const focalX = e.clientX - center.centerX;
        const focalY = e.clientY - center.centerY;

        const zoomDelta = e.deltaY < 0 ? 0.25 : -0.25;
        const targetScale = Math.min(Math.max(currentScale + zoomDelta, 1), maxScale);

        if (targetScale <= 1.02) {
          resetZoom(true);
        } else {
          const prevScale = currentScale;
          currentScale = targetScale;
          translateX = focalX - ((focalX - translateX) * (currentScale / prevScale));
          translateY = focalY - ((focalY - translateY) * (currentScale / prevScale));

          menuStage?.classList.add('is-animating');
          updateTransform(true);
          setTimeout(() => {
            menuStage?.classList.remove('is-animating');
          }, 150);
        }
      }
    }, { passive: false });

    // Desktop Mouse Drag Panning when zoomed
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseStartY = 0;

    menuViewerContainer.addEventListener('mousedown', (e) => {
      if (currentScale > 1.02 && e.button === 0) {
        isMouseDown = true;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        menuStage?.classList.remove('is-animating');
        menuViewerContainer.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isMouseDown && currentScale > 1.02) {
        const dx = e.clientX - mouseStartX;
        const dy = e.clientY - mouseStartY;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;

        translateX += dx;
        translateY += dy;
        updateTransform(false);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isMouseDown) {
        isMouseDown = false;
        menuViewerContainer.style.cursor = '';
        if (currentScale > 1.02) {
          menuStage?.classList.add('is-animating');
          updateTransform(true);
          setTimeout(() => {
            menuStage?.classList.remove('is-animating');
          }, 200);
        }
      }
    });
  }

  /* ==========================================================================
     3. OPEN / CLOSE MENU MODAL
     ========================================================================== */
  function openMenuModal(brandKey) {
    const brand = brandData[brandKey] || brandData['Cygrill'];

    // Reset any previous zoom level
    resetZoom(false);

    // Set Header & Brand content
    modalBrandTitle.textContent = brand.title;
    modalHeaderImg.src = brand.logo;
    modalHeaderImg.alt = `${brandKey} Logo`;
    pdfLinkBtn.href = brand.pdf;

    // Call Us Button logic: show with direct tel: dialer link or hide if no number
    if (callLinkBtn) {
      if (brand.phone) {
        callLinkBtn.href = `tel:${brand.phone}`;
        callLinkBtn.style.display = 'inline-flex';
      } else {
        callLinkBtn.style.display = 'none';
      }
    }

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
    resetZoom(false);
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
