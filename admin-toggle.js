// admin-toggle.js — Simulates admin role check and injects admin link into navbar
(function() {
  const isAdmin = localStorage.getItem('ate_admin') === 'true';
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // Find the CTA button to insert before it
  const ctaItem = navLinks.querySelector('.nav-cta');
  const insertBefore = ctaItem ? ctaItem.closest('li') : null;

  const li = document.createElement('li');

  if (isAdmin) {
    // Show Admin Dashboard link + logout
    li.innerHTML = '<a href="admin.html" style="color:#e74c3c; font-weight:600;">🔧 Admin</a>';
  } else {
    // Show login as admin link
    li.innerHTML = '<a href="#" onclick="toggleAdminMode(); return false;" style="color:var(--text-light); font-size:0.85rem;">🔐 Admin</a>';
  }

  if (insertBefore) {
    navLinks.insertBefore(li, insertBefore);
  } else {
    navLinks.appendChild(li);
  }

  // Expose toggle function globally
  window.toggleAdminMode = function() {
    const current = localStorage.getItem('ate_admin') === 'true';
    localStorage.setItem('ate_admin', current ? 'false' : 'true');
    location.reload();
  };

  window.isAdminMode = function() {
    return localStorage.getItem('ate_admin') === 'true';
  };
})();
