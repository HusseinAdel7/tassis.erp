/**
 * تأسيس | Tassis ERP - Interactive Website Engine
 * Theme switching (Default: Light), Quick-Jump spy, Floating Actions, Tabs & FAQ.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Light by Default + Dark Mode Option)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlEl = document.documentElement;

  // Retrieve saved preference or default to 'light'
  const savedTheme = localStorage.getItem('tassis_theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('tassis_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الداكن');
    }
  }

  // 2. Sticky Navigation Header Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  // 3. Back to Top Click
  const backToTopBtn = document.getElementById('backToTopBtn');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('mobile-open');
      if (isOpen) {
        navLinks.classList.remove('mobile-open');
        navLinks.style.display = 'none';
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      } else {
        navLinks.classList.add('mobile-open');
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.insetInlineStart = '0';
        navLinks.style.insetInlineEnd = '0';
        navLinks.style.background = 'var(--bg-surface)';
        navLinks.style.padding = '1.75rem';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
        mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      }
    });
  }

  // 5. ScrollSpy & Precision Scroll for Navigation Links
  const navAnchorLinks = document.querySelectorAll('.nav-link[href^="#"], .jump-pill, a[href^="#"]:not([href="#"])');
  const trackedSections = document.querySelectorAll('section[id]');

  navAnchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;
      const targetSec = document.querySelector(href);
      if (targetSec) {
        e.preventDefault();
        const headerHeight = 76;
        const targetTop = targetSec.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
        history.pushState(null, '', href);
      }
    });
  });

  if (navAnchorLinks.length > 0 && trackedSections.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPos = window.scrollY + 90;

      trackedSections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navAnchorLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentSectionId}`) {
            link.classList.add('active');
          } else if (href && href.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // 6. Interactive Module / Showcase Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 7. FAQ Accordion
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const header = card.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      faqCards.forEach(c => c.classList.remove('open'));
      if (!isOpen) {
        card.classList.add('open');
      }
    });
  });

  // 8. Contact Form Submission & Smart WhatsApp Sync
  const contactForm = document.getElementById('demoBookingForm');
  const formSuccess = document.getElementById('formSuccessMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim() || '';
      const phone = document.getElementById('clientPhone')?.value.trim() || '';
      const company = document.getElementById('clientCompany')?.value.trim() || '';
      const sector = document.getElementById('clientSector')?.value || 'عام';
      const notes = document.getElementById('clientNotes')?.value.trim() || '';

      const waText = encodeURIComponent(
        `السلام عليكم ورحمة الله وبركاته،\n` +
        `أود حجز موعد ديمو تجريبي لمنظومة تأسيس (Tassis ERP)\n\n` +
        `👤 الاسم: ${name}\n` +
        `🏢 اسم المنشأة / النشاط: ${company}\n` +
        `📱 الهاتف / الواتساب: ${phone}\n` +
        `🏷️ قطاع العمل: ${sector}\n` +
        (notes ? `📝 ملاحظات خاصة: ${notes}` : '')
      );

      const targetWhatsAppNumber = '201145520182'; // Official Primary WhatsApp
      const waUrl = `https://wa.me/${targetWhatsAppNumber}?text=${waText}`;

      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);

      contactForm.reset();
    });
  }

  // 9. Direct WhatsApp Buttons Quick Hook
  const directWaBtns = document.querySelectorAll('.js-direct-wa');
  directWaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const explicitHref = btn.getAttribute('href');
      if (explicitHref && explicitHref.includes('wa.me') && !explicitHref.includes('201000000000')) {
        return; // Allow direct navigation to specific WhatsApp link
      }
      e.preventDefault();
      const defaultMsg = encodeURIComponent('مرحباً، أود الاستفسار عن منظومة تأسيس (Tassis ERP) وحجز موعد ديمو تجريبي.');
      window.open(`https://wa.me/201145520182?text=${defaultMsg}`, '_blank');
    });
  });

  // ==========================================================================
  // 10. Authentic Tassis ERP Dashboard Live Simulator Engine (#screens)
  // ==========================================================================
  const erpSimulator = document.getElementById('erpSimulator');
  if (erpSimulator) {
    // 1. Read-Only Protection Toast
    const simToast = document.getElementById('simToast');
    const simToastText = document.getElementById('simToastText');
    let toastTimer = null;

    function showSimToast(actionName = '') {
      if (!simToast) return;
      if (actionName) {
        simToastText.textContent = `🔒 وضع العرض التجريبي فقط: خاصية (${actionName}) مقفلة لحماية بيانات التجربة.`;
      } else {
        simToastText.textContent = '🔒 وضع العرض التجريبي فقط: لا يمكن الإضافة، التعديل أو الحذف هنا لحماية تجربة العرض.';
      }
      simToast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        simToast.classList.remove('show');
      }, 3500);
    }

    // Attach read-only protection to all restricted triggers
    document.querySelectorAll('.js-readonly-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const actionName = btn.getAttribute('data-action-name') || 'هذا الإجراء';
        showSimToast(actionName);
      });
    });

    // 2. Authentic Sidebar Modules Navigation Switcher
    const menuItems = document.querySelectorAll('.tdb-menu-item');
    const moduleViews = document.querySelectorAll('.tdb-module-view');

    function switchToModule(targetModId) {
      menuItems.forEach(item => {
        if (item.getAttribute('data-mod-target') === targetModId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      moduleViews.forEach(view => {
        if (view.getAttribute('id') === targetModId) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });
    }

    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetMod = item.getAttribute('data-mod-target');
        if (targetMod) {
          switchToModule(targetMod);
        }
      });
    });

    // Topbar 'التقارير' Button Jump
    const topbarReportsBtn = document.getElementById('topbarReportsBtn');
    topbarReportsBtn?.addEventListener('click', () => {
      switchToModule('mod-reports');
    });

    // 3. Global Dashboard Search Filter
    const tdbGlobalSearch = document.getElementById('tdbGlobalSearch');
    const reportCards = document.querySelectorAll('.tdb-report-card-real');

    tdbGlobalSearch?.addEventListener('input', () => {
      const q = (tdbGlobalSearch.value || '').trim().toLowerCase();
      // If searching and not in reports, switch to reports to see filtered results
      if (q && !document.getElementById('mod-reports')?.classList.contains('active')) {
        switchToModule('mod-reports');
      }

      reportCards.forEach(card => {
        const title = (card.querySelector('.tdb-card-title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.tdb-card-desc')?.textContent || '').toLowerCase();
        const badge = (card.querySelector('.tdb-card-badge')?.textContent || '').toLowerCase();

        if (!q || title.includes(q) || desc.includes(q) || badge.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });

    // 4. Modal Preview for Reports
    const simModalOverlay = document.getElementById('simModalOverlay');
    const simModalContent = document.getElementById('simModalContent');
    const simModalCloseBtn = document.getElementById('simModalCloseBtn');

    function openSimModal(html) {
      if (!simModalOverlay || !simModalContent) return;
      simModalContent.innerHTML = html;
      simModalOverlay.classList.add('open');
    }

    function closeSimModal() {
      if (simModalOverlay) simModalOverlay.classList.remove('open');
    }

    simModalCloseBtn?.addEventListener('click', closeSimModal);
    simModalOverlay?.addEventListener('click', (e) => {
      if (e.target === simModalOverlay) closeSimModal();
    });

    reportCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title') || card.querySelector('.tdb-card-title')?.textContent || 'تقرير المنظومة';
        const amount = card.getAttribute('data-amount') || '142,500.00 ر.س';

        openSimModal(`
          <div style="text-align: right;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div style="width: 46px; height: 46px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
                <i class="fa-solid fa-chart-pie"></i>
              </div>
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 900; color: var(--text-main); margin: 0;">${title}</h3>
                <span style="font-size: 0.78rem; color: var(--primary); font-weight: 800;">تأسيس ERP — مركز التقارير الموحد</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.85rem; margin-bottom: 1.25rem;">
              <div style="background: var(--bg-subtle); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.25rem;">إجمالي الحركة المالية المسجلة</div>
                <div style="font-size: 1.35rem; font-weight: 900; color: var(--primary);">${amount}</div>
              </div>
              <div style="background: var(--bg-subtle); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.25rem;">حالة المطابقة والترحيل</div>
                <div style="font-size: 1.1rem; font-weight: 850; color: #10b981;">متطابق ومرحل آلياً 100%</div>
              </div>
            </div>

            <div style="background: var(--bg-subtle); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem; border: 1px solid var(--border-color); line-height: 1.6;">
              <div style="font-weight: 800; color: var(--text-main); margin-bottom: 0.4rem;">تفاصيل السجلات والعمليات:</div>
              <div style="color: var(--text-muted);">
                • يدعم الفلترة الفورية حسب التاريخ، الوردية، العميل، والفرع.<br />
                • توليد تلقائي للقيود المحاسبية المقابلة في الأستاذ العام.<br />
                • جاهز للتصدير الفوري إلى Excel أو الطباعة المباشرة عالية الدقة.
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="sim-action-btn primary" onclick="document.getElementById('simModalOverlay').classList.remove('open');">
                <i class="fa-solid fa-check"></i> إغلاق المعاينة
              </button>
            </div>
          </div>
        `);
      });
    });

    // 5. White-Label Live Interactive Branding Simulator
    const whiteLabelNameInput = document.getElementById('whiteLabelNameInput');
    const simBrandName = document.getElementById('simBrandName');
    const brandColorPicker = document.getElementById('brandColorPicker');

    whiteLabelNameInput?.addEventListener('input', () => {
      const val = whiteLabelNameInput.value.trim();
      if (simBrandName) {
        simBrandName.textContent = val || 'تأسيس';
      }
    });

    brandColorPicker?.querySelectorAll('.sim-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        brandColorPicker.querySelectorAll('.sim-filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const color = btn.getAttribute('data-color') || '#10b981';
        erpSimulator.style.setProperty('--primary', color);
      });
    });

    // 6. Sidebar Collapse & Theme Toggles
    const tdbCollapseBtn = document.getElementById('tdbCollapseBtn');
    const tdbTopCollapseToggle = document.getElementById('tdbTopCollapseToggle');
    const tdbMainSidebar = document.getElementById('tdbMainSidebar') || document.querySelector('.tdb-sidebar');

    function toggleSidebarCollapse() {
      if (tdbMainSidebar) {
        tdbMainSidebar.classList.toggle('collapsed');
      }
    }

    tdbCollapseBtn?.addEventListener('click', toggleSidebarCollapse);
    tdbTopCollapseToggle?.addEventListener('click', toggleSidebarCollapse);

    // 7. Live Real-Time Digital Clock in Arabic
    function updateLiveSimulatorClock() {
      const clockEl = document.getElementById('tdbLiveDigitalClock');
      const dateEl = document.getElementById('tdbLiveDateAr');
      const metaDateEl = document.getElementById('tdbLiveDateMeta');
      if (!clockEl && !dateEl) return;

      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'م' : 'ص';
      hours = hours % 12 || 12;
      const hoursStr = String(hours).padStart(2, '0');

      const timeString = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
      const toArabicNumerals = (str) => str.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

      if (clockEl) {
        clockEl.textContent = toArabicNumerals(timeString);
      }

      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();

      const fullDateStr = `${dayName}، ${toArabicNumerals(String(dayNum))} ${monthName} ${toArabicNumerals(String(year))}`;
      if (dateEl) dateEl.textContent = fullDateStr;
      if (metaDateEl) metaDateEl.textContent = fullDateStr;
    }
    updateLiveSimulatorClock();
    setInterval(updateLiveSimulatorClock, 1000);

    // 8. Interactive Executive Task Pad
    const simTaskForm = document.getElementById('simTaskForm');
    const simTaskInput = document.getElementById('simTaskInput');
    const simTasksList = document.getElementById('simTasksList');
    const tdbEmptyTasks = document.getElementById('tdbEmptyTasks');

    simTaskForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = (simTaskInput?.value || '').trim();
      if (!text) return;

      if (tdbEmptyTasks) tdbEmptyTasks.style.display = 'none';

      const taskItem = document.createElement('div');
      taskItem.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.65rem; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.8rem; font-weight: 750; animation: fadeIn 0.25s ease;';
      taskItem.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.45rem;">
          <input type="checkbox" style="accent-color: #059669; cursor: pointer;" />
          <span style="color: var(--text-main);">${text}</span>
        </div>
        <button type="button" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.75rem;"><i class="fa-solid fa-trash-can"></i></button>
      `;

      taskItem.querySelector('button')?.addEventListener('click', () => {
        taskItem.remove();
        if (simTasksList && simTasksList.children.length === 0 && tdbEmptyTasks) {
          tdbEmptyTasks.style.display = 'flex';
        }
      });

      simTasksList?.prepend(taskItem);
      if (simTaskInput) simTaskInput.value = '';
    });

    // 9. Simulator Language Capsule Switcher
    const simLangToggle = document.getElementById('simLangToggle');
    simLangToggle?.addEventListener('click', () => {
      const items = simLangToggle.querySelectorAll('.tdb-lang-item');
      items.forEach(it => it.classList.toggle('active'));
      showSimToast('تم تحديد اللغة بنجاح (المعاينة الحية مجهزة باللغة العربية الافتراضية).');
    });

    // 10. Theme Toggles
    const tdbThemeToggle = document.getElementById('tdbThemeToggle');
    const tdbSidebarModeBtn = document.getElementById('tdbSidebarModeBtn');

    function toggleAppTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('tassis_theme', newTheme);
      if (tdbSidebarModeBtn) {
        const span = tdbSidebarModeBtn.querySelector('span');
        if (span) span.textContent = newTheme === 'dark' ? 'فاتح' : 'داكن';
      }
    }

    tdbThemeToggle?.addEventListener('click', toggleAppTheme);
    tdbSidebarModeBtn?.addEventListener('click', toggleAppTheme);
  }
});
