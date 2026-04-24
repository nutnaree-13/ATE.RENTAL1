// admin-toggle.js — Single toggle button to switch Admin ↔ User mode
(function() {
  const isAdmin = localStorage.getItem('ate_admin') === 'true';

  // ── Inject CSS ──
  const style = document.createElement('style');
  style.textContent = `
    /* Floating Mode Switch */
    .mode-switch {
      position: fixed;
      bottom: 28px;
      left: 28px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 22px;
      border-radius: 50px;
      border: none;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      -webkit-user-select: none;
      user-select: none;
    }

    .mode-switch.user-mode {
      background: rgba(30, 30, 30, 0.9);
      color: rgba(255,255,255,0.65);
      backdrop-filter: blur(12px);
    }
    .mode-switch.user-mode:hover {
      background: rgba(30, 30, 30, 0.98);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(0,0,0,0.3);
    }

    .mode-switch.admin-mode {
      background: linear-gradient(135deg, #c0392b, #e74c3c);
      color: #fff;
    }
    .mode-switch.admin-mode:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(231,76,60,0.45);
    }

    /* Toggle Pill */
    .mode-pill {
      width: 40px;
      height: 22px;
      border-radius: 11px;
      position: relative;
      transition: background 0.35s;
      flex-shrink: 0;
    }
    .mode-switch.user-mode .mode-pill {
      background: rgba(255,255,255,0.18);
    }
    .mode-switch.admin-mode .mode-pill {
      background: rgba(255,255,255,0.35);
    }
    .mode-pill::after {
      content: '';
      position: absolute;
      top: 3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
    .mode-switch.user-mode .mode-pill::after {
      left: 3px;
    }
    .mode-switch.admin-mode .mode-pill::after {
      left: 21px;
    }

    /* Admin-only elements hidden by default */
    .admin-only {
      display: none !important;
    }
    body.is-admin .admin-only {
      display: flex !important;
    }
    body.is-admin .admin-only-block {
      display: block !important;
    }
    body.is-admin .admin-only-inline {
      display: inline-flex !important;
    }

    /* User-only elements hidden in admin mode */
    body.is-admin .user-only {
      display: none !important;
    }

    /* Nav swap: admin menu replaces user menu */
    .nav-links-admin {
      display: none;
      gap: 28px;
      list-style: none;
      align-items: center;
    }
    .nav-links-admin a {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 400;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: 0.5px;
    }
    .nav-links-admin a:hover {
      color: #c9a87c;
    }
    .nav-links-admin .nav-cta-admin {
      background: #e74c3c !important;
      color: #fff !important;
      padding: 10px 24px;
      border-radius: 50px;
      font-weight: 600 !important;
      font-size: 0.85rem;
      transition: all 0.3s;
    }
    .nav-links-admin .nav-cta-admin:hover {
      background: #c0392b !important;
      transform: translateY(-1px);
    }

    body.is-admin .nav-links {
      display: none !important;
    }
    body.is-admin .nav-links-admin {
      display: flex !important;
    }

    /* Subtle admin indicator on navbar */
    .admin-nav-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(231,76,60,0.15);
      border: 1px solid rgba(231,76,60,0.25);
      color: #ff6b6b;
      padding: 3px 10px;
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    .admin-nav-badge .blink-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #e74c3c;
      animation: dotBlink 1.4s ease-in-out infinite;
    }
    @keyframes dotBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.2; }
    }

    @media (max-width: 968px) {
      .mode-switch {
        bottom: 80px;
        left: 16px;
        padding: 10px 16px;
        font-size: 0.78rem;
      }
      .nav-links-admin {
        flex-direction: column;
        gap: 12px;
      }
    }
  `;
  document.head.appendChild(style);

  // ── Create admin nav menu (will replace user nav when admin mode is on) ──
  const navContainer = document.querySelector('nav .container');
  if (navContainer) {
    const adminNav = document.createElement('ul');
    adminNav.className = 'nav-links-admin';
    adminNav.innerHTML = `
      <li><span class="admin-nav-badge"><span class="blink-dot"></span> Admin</span></li>
      <li><a href="admin.html">📊 แดชบอร์ด</a></li>
      <li><a href="admin.html#dresses">👗 จัดการชุด</a></li>
      <li><a href="admin.html#orders">📦 ออเดอร์</a></li>
      <li><a href="lender.html">💰 ผู้ปล่อยเช่า</a></li>
      <li><a href="index.html">🏠 หน้าเว็บ</a></li>
      <li><a href="#" class="nav-cta-admin" onclick="toggleAdminMode(); return false;">ออกจากโหมด Admin</a></li>
    `;
    // Insert after the user nav-links
    const userNav = navContainer.querySelector('.nav-links');
    if (userNav) {
      userNav.parentNode.insertBefore(adminNav, userNav.nextSibling);
    }
  }

  // ── Create floating toggle button ──
  const fab = document.createElement('button');
  fab.className = 'mode-switch ' + (isAdmin ? 'admin-mode' : 'user-mode');
  fab.innerHTML = `
    <span class="mode-pill"></span>
    <span>${isAdmin ? '🔧 Admin Mode' : '🔐 เข้าโหมดแอดมิน'}</span>
  `;
  fab.title = isAdmin ? 'กดเพื่อกลับโหมดผู้ใช้' : 'กดเพื่อเข้าโหมดแอดมิน';
  fab.addEventListener('click', function() {
    toggleAdminMode();
  });
  document.body.appendChild(fab);

  // ── Apply admin mode if active ──
  if (isAdmin) {
    document.body.classList.add('is-admin');
  }

  // ── Expose toggle function globally ──
  window.toggleAdminMode = function() {
    const current = localStorage.getItem('ate_admin') === 'true';
    if (!current) {
      // Turning ON
      const pin = prompt('🔐 กรุณาใส่รหัส Admin:', '');
      if (pin === null) return;
      if (pin !== '1234') {
        alert('❌ รหัสไม่ถูกต้อง');
        return;
      }
    }
    localStorage.setItem('ate_admin', current ? 'false' : 'true');
    location.reload();
  };

  window.isAdminMode = function() {
    return localStorage.getItem('ate_admin') === 'true';
  };
})();
