const STORAGE_KEYS = {
  users: 'eventHiveUsers',
  currentUser: 'eventHiveCurrentUser',
  events: 'eventHiveEvents',
  registrations: 'eventHiveRegistrations',
  saved: 'eventHiveSaved',
  notifications: 'eventHiveNotifications',
  theme: 'eventHiveTheme',
};

const appState = {
  currentUserId: localStorage.getItem(STORAGE_KEYS.currentUser) || null,
  currentPage: 'home',
  selectedEventId: null,
  filters: {
    search: '',
    category: 'All',
    date: 'all',
    club: 'All',
    mode: 'all',
    fee: 'all',
    sort: 'upcoming',
  },
};
const boundActionButtons = new WeakSet();

function getCurrentUser() {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
  return users.find((user) => user.id === appState.currentUserId) || null;
}

function setTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  const mobileIcon = document.getElementById('mobile-theme-toggle-icon');
  if (mobileIcon) mobileIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function getEventById(id) {
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
  return events.find((event) => event.id === id) || null;
}

function ensureStorage() {
  const removedUserIds = [];
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([]));
  } else {
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]').filter((user) => {
      const keep = user.role !== 'organizer'
        && user.id !== 'user-demo-student'
        && user.email.toLowerCase() !== 'aarav@thapar.edu';
      if (!keep) removedUserIds.push(user.id);
      return keep;
    });
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(students));
  }

  if (removedUserIds.includes(appState.currentUserId)) {
    appState.currentUserId = null;
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }

  if (!localStorage.getItem(STORAGE_KEYS.events)) {
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(getSampleEvents()));
  }

  if (!localStorage.getItem(STORAGE_KEYS.registrations)) {
    localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(getSampleRegistrations()));
  } else {
    const registrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || '[]')
      .filter((registration) => !removedUserIds.includes(registration.userId));
    localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(registrations));
  }

  if (!localStorage.getItem(STORAGE_KEYS.saved)) {
    localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify({}));
  } else {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.saved) || '{}');
    if (Array.isArray(saved)) {
      localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify({}));
    } else {
      removedUserIds.forEach((userId) => delete saved[userId]);
      localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(saved));
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.notifications)) {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(getSampleNotifications()));
  } else {
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]')
      .filter((notification) => !removedUserIds.includes(notification.userId));
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }

  if (!localStorage.getItem(STORAGE_KEYS.theme)) {
    localStorage.setItem(STORAGE_KEYS.theme, 'light');
  }

  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  setTheme(savedTheme);
}

function getSampleEvents() {
  return [
    {
      id: 'evt-1',
      title: 'HackOn TIET 6.0',
      category: 'Hackathons',
      club: 'CodeChef TIET',
      organizer: 'CodeChef TIET',
      shortDescription: 'Build, pitch, and ship your next big idea in 24 hours.',
      description: 'Participate in a high-energy 24-hour hackathon where students collaborate, prototype, and present innovative products. Teams can explore AI, sustainability, health tech, and campus problem-solving challenges.',
      date: '2026-11-18',
      time: '9:00 AM - 9:00 PM',
      venue: 'Innovation Block, TIET',
      location: 'Patiala',
      mode: 'offline',
      fee: 'free',
      registrationDeadline: '2026-11-14',
      eligibility: 'Open to all TIET students, teams of 2-4 recommended.',
      seats: 150,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85',
      featured: true,
      popularity: 98,
      createdAt: '2026-11-01T12:00:00.000Z',
      status: 'open',
    },
    {
      id: 'evt-2',
      title: 'AI in Action Workshop',
      category: 'Technical Workshops',
      club: 'TIET Innovation Cell',
      organizer: 'TIET Innovation Cell',
      shortDescription: 'Hands-on workshop on practical AI workflows and model deployment.',
      description: 'Learn the fundamentals of machine learning pipelines, prompt engineering, and deployment essentials. Includes interactive sessions on real-world use cases and collaborative demos.',
      date: '2026-11-15',
      time: '11:00 AM - 1:30 PM',
      venue: 'Seminar Hall, Main Block',
      location: 'Main Block',
      mode: 'offline',
      fee: 'paid',
      registrationDeadline: '2026-11-12',
      eligibility: 'Open to students from any discipline with basic reasoning skills.',
      seats: 70,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
      featured: false,
      popularity: 82,
      createdAt: '2026-10-15T12:00:00.000Z',
      status: 'open',
    },
    {
      id: 'evt-3',
      title: 'CodeSprint: Competitive Programming',
      category: 'Coding Competitions',
      club: 'AlgoSphere',
      organizer: 'AlgoSphere',
      shortDescription: 'Battle it out in a campus programming contest designed for growth.',
      description: 'Test your problem-solving skills in a competitive coding event spanning arrays, graphs, DP, and short contests. The event is ideal for students preparing for coding interviews and contests.',
      date: '2026-11-21',
      time: '4:00 PM - 7:00 PM',
      venue: 'Computer Lab 2',
      location: 'Academic Block',
      mode: 'offline',
      fee: 'free',
      registrationDeadline: '2026-11-19',
      eligibility: 'CSE, ECE, and related backgrounds are welcome.',
      seats: 90,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85',
      featured: false,
      popularity: 89,
      createdAt: '2026-11-02T12:00:00.000Z',
      status: 'open',
    },
    {
      id: 'evt-4',
      title: 'CyberPulse 2026',
      category: 'Cybersecurity Events',
      club: 'Security Society TIET',
      organizer: 'Security Society TIET',
      shortDescription: 'Compete, learn, and explore the world of ethical hacking and defense.',
      description: 'The event features a CTF challenge, guest lecture, and awareness sessions on digital privacy, network security, and cyber defense. Excellent for students exploring cybersecurity.',
      date: '2026-11-27',
      time: '1:00 PM - 6:00 PM',
      venue: 'Network Lab',
      location: 'Technology Tower',
      mode: 'offline',
      fee: 'free',
      registrationDeadline: '2026-11-24',
      eligibility: 'TTeams can have up to 3 members; beginner-friendly tracks available.',
      seats: 80,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85',
      featured: false,
      popularity: 76,
      createdAt: '2026-10-24T12:00:00.000Z',
      status: 'open',
    },
    {
      id: 'evt-5',
      title: 'Nukkad Night: Cultural Showcase',
      category: 'Cultural Events',
      club: 'Fine Arts Society',
      organizer: 'Fine Arts Society',
      shortDescription: 'A vibrant stage of music, dance, poetry, and student creativity.',
      description: 'Enjoy performances from clubs and independent artists as the campus center turns into an evening of storytelling, music, dance, and art. There will be open mic segments and community performances.',
      date: '2026-11-17',
      time: '7:00 PM - 10:30 PM',
      venue: 'Open Air Stage',
      location: 'Student Plaza',
      mode: 'offline',
      fee: 'free',
      registrationDeadline: '2026-11-15',
      eligibility: 'All students welcome. Participants can register on-site or through campus clubs.',
      seats: 220,
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85',
      featured: true,
      popularity: 91,
      createdAt: '2026-11-05T12:00:00.000Z',
      status: 'open',
    },
    {
      id: 'evt-6',
      title: 'Campus Run 2026',
      category: 'Sports',
      club: 'Athletics Club',
      organizer: 'Athletics Club',
      shortDescription: 'Run, compete, and celebrate fitness with your peers in a fun campus event.',
      description: 'Join the annual campus 5K run with team assignments, warm-up sessions, and celebration booths after the race. Includes student categories and prizes for top teams.',
      date: '2026-11-13',
      time: '6:00 AM - 9:30 AM',
      venue: 'Main Football Ground',
      location: 'TIET Sports Complex',
      mode: 'offline',
      fee: 'paid',
      registrationDeadline: '2026-11-09',
      eligibility: 'Open to all TIET students and staff members. Age categories may vary.',
      seats: 180,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85',
      featured: false,
      popularity: 72,
      createdAt: '2026-10-30T12:00:00.000Z',
      status: 'open',
    },
    {
      id: 'evt-7',
      title: 'Startup Stories Panel',
      category: 'Entrepreneurship',
      club: 'E-Cell TIET',
      organizer: 'E-Cell TIET',
      shortDescription: 'Hear from entrepreneurs who built ventures from student ideas.',
      description: 'A fireside panel where founders, product leaders, and incubation experts share their startup journey, lessons, and growth challenges. Students will also get a chance to ask questions.',
      date: '2026-11-30',
      time: '2:00 PM - 4:00 PM',
      venue: 'Innovation Studio',
      location: 'TIET Entrepreneurship Hub',
      mode: 'offline',
      fee: 'free',
      registrationDeadline: '2026-11-26',
      eligibility: 'Students interested in startups and business innovation.',
      seats: 120,
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
      featured: false,
      popularity: 73,
      createdAt: '2026-11-04T12:00:00.000Z',
      status: 'open',
    },
    {
      id: 'evt-8',
      title: 'Guest Lecture: Future of Chip Design',
      category: 'Guest Lectures',
      club: 'Department of ECE',
      organizer: 'Department of ECE',
      shortDescription: 'A leading industry speaker shares insights into chip design and research careers.',
      description: 'This guest lecture will cover semiconductor design trends, electronic systems, and emerging opportunities for students in advanced computing and hardware industries.',
      date: '2026-11-25',
      time: '12:30 PM - 1:30 PM',
      venue: 'Conference Hall',
      location: 'Academic Block',
      mode: 'online',
      fee: 'free',
      registrationDeadline: '2026-11-23',
      eligibility: 'Open to ECE and electrical engineering students.',
      seats: 90,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85',
      featured: false,
      popularity: 77,
      createdAt: '2026-10-18T12:00:00.000Z',
      status: 'open',
    },
  ];
}

function getSampleRegistrations() {
  return [];
}

function getSampleNotifications() {
  return [
    {
      id: 'notif-1',
      title: 'Registration confirmed',
      message: 'Your spot for AI in Action Workshop has been reserved.',
      type: 'success',
      read: false,
      createdAt: '2026-11-09T09:00:00.000Z',
    },
    {
      id: 'notif-2',
      title: 'Deadline approaching',
      message: 'HackOn TIET 6.0 registration closes in 2 days.',
      type: 'warning',
      read: false,
      createdAt: '2026-11-10T11:00:00.000Z',
    },
    {
      id: 'notif-3',
      title: 'Reminder',
      message: 'Campus Run 2026 starts on 13 Nov at 6:00 AM.',
      type: 'info',
      read: true,
      createdAt: '2026-11-05T09:40:00.000Z',
    },
  ];
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2600);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatShortDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

function getInitials(name = 'User') {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function getSavedEventIds() {
  const savedByUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.saved) || '{}');
  if (Array.isArray(savedByUser)) return savedByUser;
  return savedByUser[appState.currentUserId] || [];
}

function setSavedEventIds(eventIds) {
  const savedByUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.saved) || '{}');
  const normalizedSaved = Array.isArray(savedByUser) ? { 'user-demo-student': savedByUser } : savedByUser;
  normalizedSaved[appState.currentUserId] = eventIds;
  localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(normalizedSaved));
}

function getCurrentNotifications() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]');
}

function getUserRegistrations(userId) {
  const regs = JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || '[]');
  return regs.filter((reg) => reg.userId === userId);
}

function toggleSave(eventId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Please log in to save events.', 'error');
    showPage('auth');
    return;
  }

  const saved = getSavedEventIds();
  const isSaved = saved.includes(eventId);
  if (isSaved) {
    setSavedEventIds(saved.filter((id) => id !== eventId));
    showToast('Event removed from saved list.', 'success');
  } else {
    setSavedEventIds([...saved, eventId]);
    showToast('Event saved to your list.', 'success');
  }

  renderAll();
  if (appState.currentPage === 'detail') openDetail(eventId);
}

function registerForEvent(eventId, payload = {}) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Please sign in before registering.', 'error');
    showPage('auth');
    return;
  }

  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
  const event = events.find((item) => item.id === eventId);
  if (!event) {
    showToast('Selected event not found.', 'error');
    return;
  }

  const registrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || '[]');
  const alreadyExists = registrations.some(
    (reg) => reg.userId === currentUser.id && reg.eventId === eventId && reg.status !== 'cancelled'
  );

  if (alreadyExists) {
    showToast('You are already registered for this event.', 'error');
    return;
  }

  registrations.push({
    id: `reg-${Date.now()}`,
    userId: currentUser.id,
    eventId,
    status: 'registered',
    registeredAt: new Date().toISOString(),
    answers: payload,
  });

  localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(registrations));
  addNotification('Registration successful', `You have registered for ${event.title}.`, 'success');
  showToast('Registration successful! Check your My Events page.', 'success');
  renderAll();
}

function cancelRegistration(registrationId) {
  const registrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || '[]');
  const target = registrations.find((reg) => reg.id === registrationId);
  if (!target) return;

  target.status = 'cancelled';
  localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(registrations));
  addNotification('Registration cancelled', 'Your event registration has been cancelled.', 'info');
  showToast('Registration cancelled.', 'success');
  renderAll();
}

function addNotification(title, message, type = 'info') {
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]');
  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: appState.currentUserId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
}

function markNotificationsRead(render = true) {
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]');
  const updated = notifications.map((item) => (
    !item.userId || item.userId === appState.currentUserId ? { ...item, read: true } : item
  ));
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(updated));
  if (render) {
    renderAll();
  } else {
    renderNotificationPanel();
  }
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');

  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value.trim();
  const branch = document.getElementById('register-branch').value;
  const year = document.getElementById('register-year').value;

  if (!name || !email || !password || !branch || !year) {
    showToast('Please fill in all details.', 'error');
    return;
  }

  if (!email.toLowerCase().endsWith('@thapar.edu')) {
    showToast('Please use a valid Thapar email address.', 'error');
    return;
  }

  const emailExists = users.some((item) => item.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    showToast('An account already exists for this email.', 'error');
    return;
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    branch,
    year,
    role: 'student',
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  appState.currentUserId = newUser.id;
  localStorage.setItem(STORAGE_KEYS.currentUser, newUser.id);
  showToast(`Welcome, ${newUser.name.split(' ')[0]}! Your student profile is verified.`, 'success');
  addNotification('Profile verified', `${newUser.name} is now a verified student.`, 'success');
  renderAll();
  showPage('home');
}

function logout() {
  collapseSidebar();
  appState.currentUserId = null;
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  showPage('auth');
  renderAll();
}

function collapseSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.classList.remove('open');
  sidebar.classList.add('collapsed');
  document.querySelectorAll('#menu-toggle, #desktop-menu-toggle').forEach((toggle) => {
    toggle.setAttribute('aria-expanded', 'false');
  });
}

function deleteAccount() {
  const user = getCurrentUser();
  if (!user) return;
  if (!window.confirm('Delete your student account and its saved event data? This cannot be undone.')) return;

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]')
    .filter((item) => item.id !== user.id);
  const registrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || '[]')
    .filter((item) => item.userId !== user.id);
  const savedByUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.saved) || '{}');
  if (!Array.isArray(savedByUser)) delete savedByUser[user.id];
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]')
    .filter((item) => item.userId !== user.id);

  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(registrations));
  localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(Array.isArray(savedByUser) ? {} : savedByUser));
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  collapseSidebar();
  appState.currentUserId = null;
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  appState.currentPage = 'auth';
  renderAll();
  showToast('Your student account and associated data were deleted.', 'success');
}

function showPage(pageName) {
  appState.currentPage = pageName;
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => {
    const isActive = page.dataset.page === pageName;
    page.classList.toggle('active', isActive);
  });

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.page === pageName));

  if (pageName !== 'auth') {
    document.getElementById('page-auth').classList.remove('active');
  }
}

function renderAll() {
  renderHeaderUser();
  renderHome();
  renderExplore();
  renderMyEvents();
  renderSavedEvents();
  renderNotificationsPage();
  renderProfile();
  renderSettings();
  renderNotificationPanel();
  showPage(appState.currentPage === 'auth' || !getCurrentUser() ? 'auth' : appState.currentPage);
}

function renderHeaderUser() {
  const user = getCurrentUser();
  const sidebarUserCard = document.getElementById('sidebar-user-card');
  const sidebarName = document.getElementById('sidebar-user-name');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const sidebarVerified = document.getElementById('sidebar-verified-badge');
  const signOutButton = document.getElementById('sign-out-button');
  const sidebarLogoutButton = document.getElementById('sidebar-logout-button');
  const sidebarDeleteAccountButton = document.getElementById('sidebar-delete-account-button');

  if (!user) {
    sidebarName.textContent = 'Guest';
    sidebarAvatar.textContent = 'G';
    sidebarVerified.classList.add('hidden');
    if (signOutButton) signOutButton.classList.add('hidden');
    if (sidebarLogoutButton) sidebarLogoutButton.classList.add('hidden');
    if (sidebarDeleteAccountButton) sidebarDeleteAccountButton.classList.add('hidden');
    return;
  }

  sidebarName.textContent = user.name;
  sidebarAvatar.textContent = getInitials(user.name);
  sidebarVerified.classList.toggle('hidden', !user.isVerified);
  if (signOutButton) signOutButton.classList.remove('hidden');
  if (sidebarLogoutButton) sidebarLogoutButton.classList.remove('hidden');
  if (sidebarDeleteAccountButton) sidebarDeleteAccountButton.classList.remove('hidden');
}

function renderHome() {
  const page = document.getElementById('page-home');
  const currentUser = getCurrentUser();
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
  const featuredEvents = events.filter((event) => event.featured).slice(0, 3);
  const upcoming = events.filter((event) => new Date(event.date) >= new Date()).slice(0, 3);
  const recent = [...events].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const registrationCount = getUserRegistrations(currentUser ? currentUser.id : '').filter((reg) => reg.status !== 'cancelled').length;
  const savedCount = getSavedEventIds().length;

  page.innerHTML = `
    <div class="section-card" style="margin-bottom: 18px;">
      <div class="hero">
        <div class="hero-content">
          <div class="hero-badge">Neon campus energy</div>
          <h1>Find your next big campus moment.</h1>
          <p>From hackathons and club nights to guest lectures and fests, EventHive helps TIET students discover what matters most.</p>
          <div class="hero-actions">
            <button class="primary-button" data-go-page="explore">Explore events</button>
            <button class="ghost-button" data-go-page="my-events">View my events</button>
          </div>
        </div>
        <div class="hero-metrics">
          <div class="metric-box">
            <strong>${upcoming.length}</strong>
            <span>Upcoming this week</span>
          </div>
          <div class="metric-box">
            <strong>${events.length}</strong>
            <span>Active campus events</span>
          </div>
          <div class="metric-box">
            <strong>${registrationCount}</strong>
            <span>Upcoming registrations</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-3">
      <div class="dashboard-card">
        <strong>${registrationCount}</strong>
        <h3>Upcoming registrations</h3>
        <p>Your confirmed event entries.</p>
      </div>
      <div class="dashboard-card">
        <strong>${savedCount}</strong>
        <h3>Saved events</h3>
        <p>Events you plan to revisit.</p>
      </div>
      <div class="dashboard-card">
        <strong>${upcoming.length}</strong>
        <h3>Events starting soon</h3>
        <p>Fresh opportunities on your calendar.</p>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Featured events</h2>
          <p>High-energy picks worth checking out</p>
        </div>
        <button class="ghost-button" data-go-page="explore">View all</button>
      </div>
      <div class="event-grid">
        ${featuredEvents.map(renderEventCard).join('') || '<div class="empty-state">No featured events yet.</div>'}
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Events this week</h2>
          <p>What is happening around campus right now</p>
        </div>
      </div>
      <div class="event-grid">
        ${upcoming.map(renderEventCard).join('') || '<div class="empty-state">No upcoming events in the next few days.</div>'}
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Popular campus events</h2>
          <p>Most loved by students this month</p>
        </div>
      </div>
      <div class="event-grid">
        ${[...events].sort((a, b) => b.popularity - a.popularity).slice(0, 3).map(renderEventCard).join('')}
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Recently added</h2>
          <p>Freshly published opportunities</p>
        </div>
      </div>
      <div class="event-grid">
        ${recent.map(renderEventCard).join('')}
      </div>
    </div>
  `;

  bindGlobalActions();
  updateCountdowns();
}

function renderEventCard(event) {
  const savedIds = getSavedEventIds();
  const user = getCurrentUser();
  const hasRegistration = user && JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || []).some(
    (reg) => reg.userId === user.id && reg.eventId === event.id && reg.status !== 'cancelled'
  );

  return `
    <article class="event-card" data-event-id="${event.id}">
      <img src="${event.image}" alt="${event.title}" />
      <div class="event-card-body">
        <div class="event-card-top">
          <span class="category-pill">${event.category}</span>
          <span class="status-pill ${event.status}">${event.status === 'open' ? 'Open' : 'Closed'}</span>
        </div>
        <h3>${event.title}</h3>
        <div class="event-meta">
          <span>🏛️ ${event.club}</span>
          <span>📅 ${formatShortDate(event.date)} · ${event.time}</span>
          <span>📍 ${event.venue}</span>
        </div>
        <p>${event.shortDescription}</p>
        <div class="event-card-footer">
          <div class="action-row">
            <button class="action-button" data-open-detail="${event.id}">View</button>
            <button class="action-button ${savedIds.includes(event.id) ? 'saved' : ''}" data-save-event="${event.id}">
              ${savedIds.includes(event.id) ? 'Saved' : 'Save'}
            </button>
          </div>
          <button class="primary-button" data-register-event="${event.id}" ${hasRegistration ? 'disabled' : ''}>
            ${hasRegistration ? 'Registered' : 'Register'}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderExplore() {
  const page = document.getElementById('page-explore');
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
  const categories = ['All', ...new Set(events.map((event) => event.category))];
  const clubs = ['All', ...new Set(events.map((event) => event.club))];

  const filteredEvents = filterEvents(events);

  page.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Explore campus events</h2>
          <p>Search, filter, and discover upcoming experiences.</p>
        </div>
      </div>
      <div class="filters-panel">
        <label class="filter-input">
          <span>Search</span>
          <input id="explore-search" type="text" value="${escapeHtml(appState.filters.search)}" placeholder="eg: hackathon, club night" />
        </label>
        <label class="filter-input">
          <span>Category</span>
          <select id="explore-category">
            ${categories.map((category) => `<option value="${category}" ${appState.filters.category === category ? 'selected' : ''}>${category}</option>`).join('')}
          </select>
        </label>
        <label class="filter-input">
          <span>Date</span>
          <select id="explore-date">
            <option value="all" ${appState.filters.date === 'all' ? 'selected' : ''}>Any date</option>
            <option value="this-week" ${appState.filters.date === 'this-week' ? 'selected' : ''}>This week</option>
            <option value="month" ${appState.filters.date === 'month' ? 'selected' : ''}>Next 30 days</option>
          </select>
        </label>
        <label class="filter-input">
          <span>Club</span>
          <select id="explore-club">
            ${clubs.map((club) => `<option value="${club}" ${appState.filters.club === club ? 'selected' : ''}>${club}</option>`).join('')}
          </select>
        </label>
        <label class="filter-input">
          <span>Mode</span>
          <select id="explore-mode">
            <option value="all" ${appState.filters.mode === 'all' ? 'selected' : ''}>All</option>
            <option value="online" ${appState.filters.mode === 'online' ? 'selected' : ''}>Online</option>
            <option value="offline" ${appState.filters.mode === 'offline' ? 'selected' : ''}>Offline</option>
          </select>
        </label>
        <label class="filter-input">
          <span>Price</span>
          <select id="explore-fee">
            <option value="all" ${appState.filters.fee === 'all' ? 'selected' : ''}>All</option>
            <option value="free" ${appState.filters.fee === 'free' ? 'selected' : ''}>Free</option>
            <option value="paid" ${appState.filters.fee === 'paid' ? 'selected' : ''}>Paid</option>
          </select>
        </label>
        <label class="filter-input">
          <span>Sort by</span>
          <select id="explore-sort">
            <option value="upcoming" ${appState.filters.sort === 'upcoming' ? 'selected' : ''}>Upcoming</option>
            <option value="newest" ${appState.filters.sort === 'newest' ? 'selected' : ''}>Newest</option>
            <option value="popular" ${appState.filters.sort === 'popular' ? 'selected' : ''}>Popularity</option>
          </select>
        </label>
      </div>
      <div class="section-tools" style="margin-top: 14px;">
        <button class="secondary-button" id="reset-filters">Clear all filters</button>
      </div>
    </div>

    <div class="section-card" id="explore-results">
      <div class="section-header">
        <div>
          <h3 id="explore-result-count">${filteredEvents.length} event${filteredEvents.length === 1 ? '' : 's'} found</h3>
        </div>
      </div>
      <div class="event-grid" id="explore-event-grid">
        ${filteredEvents.length > 0 ? filteredEvents.map(renderEventCard).join('') : '<div class="empty-state">No events match your filters. Try resetting or broadening your search.</div>'}
      </div>
    </div>
  `;

  bindExploreControls();
  bindGlobalActions();
}

function filterEvents(events) {
  const query = appState.filters.search.trim().toLowerCase();
  const selectedCategory = appState.filters.category;
  const selectedClub = appState.filters.club;
  const selectedMode = appState.filters.mode;
  const selectedFee = appState.filters.fee;
  const selectedDate = appState.filters.date;

  const filtered = events.filter((event) => {
    if (query && !(`${event.title} ${event.club} ${event.description} ${event.category}`.toLowerCase().includes(query))) {
      return false;
    }

    if (selectedCategory !== 'All' && event.category !== selectedCategory) return false;
    if (selectedClub !== 'All' && event.club !== selectedClub) return false;
    if (selectedMode !== 'all' && event.mode !== selectedMode) return false;
    if (selectedFee !== 'all' && event.fee !== selectedFee) return false;

    const eventDate = new Date(event.date);
    const today = new Date();
    const inThisWeek = eventDate >= today && eventDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const inMonth = eventDate >= today && eventDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (selectedDate === 'this-week' && !inThisWeek) return false;
    if (selectedDate === 'month' && !inMonth) return false;

    return true;
  });

  if (appState.filters.sort === 'newest') {
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (appState.filters.sort === 'popular') {
    return filtered.sort((a, b) => b.popularity - a.popularity);
  }

  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function bindExploreControls() {
  const input = document.getElementById('explore-search');
  const categoryInput = document.getElementById('explore-category');
  const dateInput = document.getElementById('explore-date');
  const clubInput = document.getElementById('explore-club');
  const modeInput = document.getElementById('explore-mode');
  const feeInput = document.getElementById('explore-fee');
  const sortInput = document.getElementById('explore-sort');

  input.addEventListener('input', (event) => {
    appState.filters.search = event.target.value;
    renderExploreResults();
  });

  [categoryInput, dateInput, clubInput, modeInput, feeInput, sortInput].forEach((element) => {
    element.addEventListener('change', (event) => {
      const { id } = event.target;

      if (id === 'explore-category') appState.filters.category = event.target.value;
      if (id === 'explore-date') appState.filters.date = event.target.value;
      if (id === 'explore-club') appState.filters.club = event.target.value;
      if (id === 'explore-mode') appState.filters.mode = event.target.value;
      if (id === 'explore-fee') appState.filters.fee = event.target.value;
      if (id === 'explore-sort') appState.filters.sort = event.target.value;

      renderExploreResults();
    });
  });

  document.getElementById('reset-filters').addEventListener('click', () => {
    appState.filters = {
      search: '',
      category: 'All',
      date: 'all',
      club: 'All',
      mode: 'all',
      fee: 'all',
      sort: 'upcoming',
    };
    input.value = '';
    categoryInput.value = 'All';
    dateInput.value = 'all';
    clubInput.value = 'All';
    modeInput.value = 'all';
    feeInput.value = 'all';
    sortInput.value = 'upcoming';
    renderExploreResults();
  });
}

function renderExploreResults() {
  const results = document.getElementById('explore-results');
  if (!results) return;

  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
  const filteredEvents = filterEvents(events);
  const count = document.getElementById('explore-result-count');
  const grid = document.getElementById('explore-event-grid');

  count.textContent = `${filteredEvents.length} event${filteredEvents.length === 1 ? '' : 's'} found`;
  grid.innerHTML = filteredEvents.length
    ? filteredEvents.map(renderEventCard).join('')
    : '<div class="empty-state">No events match your filters. Try resetting or broadening your search.</div>';
  bindGlobalActions();
}

function renderMyEvents() {
  const page = document.getElementById('page-my-events');
  const user = getCurrentUser();

  if (!user) {
    page.innerHTML = '<div class="empty-state">Log in to view your event history.</div>';
    return;
  }

  const registrations = getUserRegistrations(user.id);
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
  const eventData = registrations
    .map((reg) => ({ ...reg, event: events.find((event) => event.id === reg.eventId) }))
    .filter((item) => item.event);

  const upcoming = eventData.filter((item) => item.status === 'registered' && new Date(item.event.date) >= new Date());
  const completed = eventData.filter((item) => item.status === 'completed');
  const cancelled = eventData.filter((item) => item.status === 'cancelled');

  page.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>My Events</h2>
          <p>Track registrations, upcoming plans, and past participations.</p>
        </div>
      </div>
      <div class="grid-3">
        <div class="dashboard-card"><strong>${upcoming.length}</strong><h3>Upcoming</h3><p>Confirmed events on your calendar.</p></div>
        <div class="dashboard-card"><strong>${completed.length}</strong><h3>Completed</h3><p>Past events you attended.</p></div>
        <div class="dashboard-card"><strong>${cancelled.length}</strong><h3>Cancelled</h3><p>Event registrations you withdrew.</p></div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h3>Registered events</h3>
        </div>
      </div>
      <div class="canvas-grid">
        ${upcoming.length ? upcoming.map(renderRegistrationCard).join('') : '<div class="empty-state">No upcoming registrations yet.</div>'}
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h3>Completed & cancelled</h3>
        </div>
      </div>
      <div class="canvas-grid">
        ${[...completed, ...cancelled].length ? [...completed, ...cancelled].map(renderRegistrationCard).join('') : '<div class="empty-state">No past or cancelled registrations.</div>'}
      </div>
    </div>
  `;

  bindGlobalActions();
}

function renderRegistrationCard(item) {
  const event = item.event;
  return `
    <div class="event-card">
      <img src="${event.image}" alt="${event.title}" />
      <div class="event-card-body">
        <div class="event-card-top">
          <span class="category-pill">${event.category}</span>
          <span class="status-pill ${item.status === 'cancelled' ? 'closed' : 'open'}">${item.status}</span>
        </div>
        <h3>${event.title}</h3>
        <div class="event-meta">
          <span>📅 ${formatDate(event.date)}</span>
          <span>📍 ${event.venue}</span>
        </div>
        <div class="event-card-footer">
          <div class="action-row">
            <button class="action-button" data-open-detail="${event.id}">Details</button>
            ${item.status === 'registered' ? `<button class="action-button" data-cancel-reg="${item.id}">Cancel</button>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSavedEvents() {
  const page = document.getElementById('page-saved-events');
  const savedIds = getSavedEventIds();
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
  const savedEvents = events.filter((event) => savedIds.includes(event.id));

  page.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Saved events</h2>
          <p>Your wishlist and quick-access events.</p>
        </div>
      </div>
      <div class="event-grid">
        ${savedEvents.length ? savedEvents.map(renderEventCard).join('') : '<div class="empty-state">You have not saved any events yet.</div>'}
      </div>
    </div>
  `;
  bindGlobalActions();
}

function renderNotificationsPage() {
  const page = document.getElementById('page-notifications');
  const user = getCurrentUser();
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]')
    .filter((item) => !item.userId || item.userId === user?.id);

  page.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Notifications</h2>
          <p>Updates, reminders, and important notices.</p>
        </div>
        <button class="ghost-button" id="mark-all-read">Mark all as read</button>
      </div>
      <div class="notifications-feed">
        ${notifications.length ? notifications.map(renderNotificationItem).join('') : '<div class="empty-state">No notifications yet.</div>'}
      </div>
    </div>
  `;

  const btn = document.getElementById('mark-all-read');
  if (btn) btn.addEventListener('click', markNotificationsRead);
}

function renderNotificationItem(item) {
  const icon = item.type === 'success' ? '✓' : item.type === 'warning' ? '!' : '↗';
  return `
    <div class="notification-item ${item.read ? '' : 'unread'}">
      <span class="notification-icon">${icon}</span>
      <div class="notification-copy">
        <strong>${item.title}</strong>
        <p>${item.message}</p>
      </div>
      <time class="notification-time" datetime="${item.createdAt}">${new Date(item.createdAt).toLocaleString('en-IN')}</time>
    </div>
  `;
}

function renderNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  const count = document.getElementById('notification-count');
  const mobileCount = document.getElementById('mobile-notification-count');
  const user = getCurrentUser();
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]')
    .filter((item) => !item.userId || item.userId === user?.id);
  const unread = notifications.filter((item) => !item.read).length;

  if (count) count.textContent = unread;
  if (mobileCount) mobileCount.textContent = unread;

  panel.innerHTML = notifications.slice(0, 5).map((item) => `
    <div class="notification-item ${item.read ? '' : 'unread'}">
      <span class="notification-icon">${item.type === 'success' ? '✓' : item.type === 'warning' ? '!' : '↗'}</span>
      <div class="notification-copy">
        <strong>${item.title}</strong>
        <p>${item.message}</p>
      </div>
    </div>
  `).join('');

  if (!notifications.length) {
    panel.innerHTML = '<div class="empty-state" style="padding: 18px;">No notifications.</div>';
  }
  if (count) count.classList.toggle('hidden', unread === 0);
  if (mobileCount) mobileCount.classList.toggle('hidden', unread === 0);
}

function renderOrganizer() {
  const page = document.getElementById('page-organizer');
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
  const registrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || '[]');

  page.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Organizer dashboard</h2>
          <p>Demo management view for campus events.</p>
        </div>
        <button class="primary-button" data-go-page="create-event">Create new event</button>
      </div>
      <div class="grid-3">
        <div class="dashboard-card"><strong>${events.length}</strong><h3>Active events</h3><p>Your published event listings.</p></div>
        <div class="dashboard-card"><strong>${registrations.length}</strong><h3>Total registrations</h3><p>Student interest across events.</p></div>
        <div class="dashboard-card"><strong>${events.filter((event) => event.status === 'open').length}</strong><h3>Open events</h3><p>Events accepting registrations.</p></div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h3>Manage your events</h3>
        </div>
      </div>
      <div class="canvas-grid">
        ${events.map(renderOrganizerEventCard).join('')}
      </div>
    </div>
  `;
  bindGlobalActions();
}

function renderOrganizerEventCard(event) {
  const registrationsForEvent = JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || []).filter((reg) => reg.eventId === event.id);
  return `
    <div class="event-card">
      <img src="${event.image}" alt="${event.title}" />
      <div class="event-card-body">
        <div class="event-card-top">
          <span class="category-pill">${event.category}</span>
          <span class="status-pill ${event.status}">${event.status === 'open' ? 'Open' : 'Closed'}</span>
        </div>
        <h3>${event.title}</h3>
        <div class="event-meta">
          <span>📅 ${formatDate(event.date)}</span>
          <span>👥 ${registrationsForEvent.length} signups</span>
        </div>
        <div class="event-card-footer">
          <div class="action-row">
            <button class="action-button" data-open-detail="${event.id}">Preview</button>
            <button class="action-button" data-edit-event="${event.id}">Edit</button>
            <button class="action-button" data-delete-event="${event.id}">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCreateEvent() {
  const page = document.getElementById('page-create-event');
  page.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <div>
          <h2>Create a demo event</h2>
          <p>Add event details and upload a banner preview.</p>
        </div>
      </div>
      <form id="create-event-form" class="form-card">
        <div class="form-grid">
          <label>
            <span>Event title</span>
            <input type="text" name="title" required />
          </label>
          <label>
            <span>Organizing club</span>
            <input type="text" name="club" required />
          </label>
          <label>
            <span>Category</span>
            <select name="category" required>
              <option value="Technical Workshops">Technical Workshops</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Coding Competitions">Coding Competitions</option>
              <option value="Cybersecurity Events">Cybersecurity Events</option>
              <option value="Cultural Events">Cultural Events</option>
              <option value="Sports">Sports</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="Guest Lectures">Guest Lectures</option>
              <option value="Club Activities">Club Activities</option>
              <option value="College Fests">College Fests</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            <span>Mode</span>
            <select name="mode" required>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </label>
          <label>
            <span>Date</span>
            <input type="date" name="date" required />
          </label>
          <label>
            <span>Time</span>
            <input type="text" name="time" placeholder="10:00 AM - 1:00 PM" required />
          </label>
          <label>
            <span>Venue</span>
            <input type="text" name="venue" required />
          </label>
          <label>
            <span>Registration fee</span>
            <select name="fee" required>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <label>
            <span>Seats</span>
            <input type="number" name="seats" min="10" value="80" required />
          </label>
          <label>
            <span>Deadline</span>
            <input type="date" name="registrationDeadline" required />
          </label>
          <label>
            <span>Image upload</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" name="image" />
          </label>
        </div>
        <label style="margin-top: 16px;">
          <span>Short description</span>
          <textarea name="shortDescription" rows="3" required></textarea>
        </label>
        <label style="margin-top: 16px;">
          <span>Full description</span>
          <textarea name="description" rows="5" required></textarea>
        </label>
        <div class="summary-box" style="margin-top: 16px;">
          <h4>Image preview</h4>
          <img id="create-event-preview" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="Placeholder preview" style="height: 200px; width: 100%; object-fit: cover; border-radius: 16px; margin-top: 10px;" />
        </div>
        <div class="button-stack">
          <button type="submit" class="primary-button">Publish event</button>
          <button type="button" class="ghost-button" id="clear-create-form">Reset form</button>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById('create-event-form');
  const imageInput = form.querySelector('input[name="image"]');
  const preview = document.getElementById('create-event-preview');

  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Only JPG, PNG, and WEBP files are supported.', 'error');
      return;
    }

    if (file.size > 1_500_000) {
      showToast('Image size must be under 1.5 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      preview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: formData.get('title').trim(),
      category: formData.get('category'),
      club: formData.get('club').trim(),
      organizer: formData.get('club').trim(),
      shortDescription: formData.get('shortDescription').trim(),
      description: formData.get('description').trim(),
      date: formData.get('date'),
      time: formData.get('time').trim(),
      venue: formData.get('venue').trim(),
      location: formData.get('venue').trim(),
      mode: formData.get('mode'),
      fee: formData.get('fee'),
      registrationDeadline: formData.get('registrationDeadline'),
      eligibility: 'Open to TIET students and campus community members.',
      seats: Number(formData.get('seats')) || 80,
      image: preview.src,
      featured: false,
      popularity: 70,
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
    addNotification('Event created', `${newEvent.title} is now live on EventHive.`, 'success');
    showToast('Event published successfully.', 'success');
    showPage('organizer');
    renderAll();
  });

  document.getElementById('clear-create-form').addEventListener('click', () => form.reset());
}

function renderProfile() {
  const page = document.getElementById('page-profile');
  const user = getCurrentUser();

  if (!user) {
    page.innerHTML = '<div class="empty-state">Please log in to view your profile.</div>';
    return;
  }

  const registrations = getUserRegistrations(user.id).filter((reg) => reg.status !== 'cancelled');
  const savedCount = getSavedEventIds().length;

  page.innerHTML = `
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">${getInitials(user.name)}</div>
        <div class="profile-meta">
          <h2>${user.name}</h2>
          <div class="pill-row">
            <span class="verified-badge ${user.isVerified ? '' : 'hidden'}">Verified Student</span>
            <span class="icon-pill">🎓 ${user.branch}</span>
            <span class="icon-pill">📚 ${user.year}</span>
          </div>
        </div>
      </div>

      <div class="profile-stats">
        <div class="dashboard-card">
          <strong>${registrations.length}</strong>
          <h4>Registrations</h4>
        </div>
        <div class="dashboard-card">
          <strong>${savedCount}</strong>
          <h4>Saved</h4>
        </div>
        <div class="dashboard-card">
          <strong>Student</strong>
          <h4>Profile</h4>
        </div>
        <div class="dashboard-card">
          <strong>100%</strong>
          <h4>Verification</h4>
        </div>
      </div>
    </div>

    <div class="settings-card">
      <h3>Contact details</h3>
      <div class="pill-row">
        <span class="icon-pill">📧 ${user.email}</span>
        <span class="icon-pill">🏛️ ${user.branch}</span>
      </div>
      <div class="account-actions">
        <button class="ghost-button" data-logout>Log out</button>
        <button class="danger-button" data-delete-account>Delete account</button>
      </div>
    </div>
  `;
  bindAccountActions(page);
}

function renderSettings() {
  const page = document.getElementById('page-settings');
  const theme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';

  page.innerHTML = `
    <div class="settings-card">
      <div class="section-header">
        <div>
          <h2>Settings</h2>
          <p>Customize your EventHive experience.</p>
        </div>
      </div>
      <div class="settings-list">
        <div class="setting-row">
          <div>
            <strong>Theme</strong>
            <p>Switch between light and dark UI.</p>
          </div>
          <button id="settings-theme-toggle" class="switch ${theme === 'dark' ? 'on' : ''}" aria-label="Toggle theme"></button>
        </div>
        <div class="setting-row">
          <div>
            <strong>Student privacy</strong>
            <p>Public profiles show initials instead of personal student IDs.</p>
          </div>
          <button class="ghost-button">Protected</button>
        </div>
        <div class="setting-row">
          <div>
            <strong>Notifications</strong>
            <p>Keep event reminders and confirmations enabled.</p>
          </div>
          <button class="ghost-button">Enabled</button>
        </div>
        <div class="setting-row">
          <div>
            <strong>Account</strong>
            <p>Sign out or permanently remove this student account and its registrations.</p>
          </div>
          <div class="account-actions">
            <button class="ghost-button" data-logout>Log out</button>
            <button class="danger-button" data-delete-account>Delete account</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const settingsToggle = document.getElementById('settings-theme-toggle');
  if (settingsToggle) {
    settingsToggle.addEventListener('click', () => {
      const nextTheme = localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      renderSettings();
      renderHeaderUser();
    });
  }
  bindAccountActions(page);
}

function bindAccountActions(container) {
  container.querySelectorAll('[data-logout]').forEach((button) => {
    button.addEventListener('click', logout);
  });
  container.querySelectorAll('[data-delete-account]').forEach((button) => {
    button.addEventListener('click', deleteAccount);
  });
}

function updateCountdowns() {
  const featured = JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || []).filter((event) => event.featured);
  const timeBlocks = document.querySelectorAll('[data-countdown]');
  timeBlocks.forEach((node) => {
    const eventId = node.dataset.countdown;
    const event = featured.find((entry) => entry.id === eventId);
    if (!event) return;

    const target = new Date(`${event.date}T${event.time.split(' - ')[0]}`);
    const diff = target - new Date();
    if (diff <= 0) {
      node.textContent = 'Live now';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    node.textContent = `${days}d ${hours}h ${mins}m`;
  });
}

function openDetail(eventId) {
  appState.selectedEventId = eventId;
  const event = getEventById(eventId);
  if (!event) return;

  const page = document.getElementById('page-detail');
  const user = getCurrentUser();
  const isSaved = getSavedEventIds().includes(eventId);
  const isRegistered = user && JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations) || []).some(
    (reg) => reg.userId === user.id && reg.eventId === eventId && reg.status !== 'cancelled'
  );

  page.innerHTML = `
    <div class="event-detail-page">
      <div class="detail-main">
        <div class="detail-card">
          <img class="event-hero-image" src="${event.image}" alt="${event.title}" />
          <div class="meta-pills">
            <span class="category-pill">${event.category}</span>
            <span class="type-pill">${event.mode === 'online' ? 'Online' : 'Offline'}</span>
            <span class="status-pill ${event.status}">${event.status === 'open' ? 'Open for registration' : 'Registration closed'}</span>
          </div>
          <h2>${event.title}</h2>
          <div class="detail-body">
            <p>${event.description}</p>
          </div>
        </div>
      </div>

      <aside class="detail-aside">
        <div class="detail-panel">
          <h3>Event details</h3>
          <div class="detail-list">
            <div class="detail-list-item"><span>Club</span><strong>${event.club}</strong></div>
            <div class="detail-list-item"><span>When</span><strong>${formatDate(event.date)} • ${event.time}</strong></div>
            <div class="detail-list-item"><span>Venue</span><strong>${event.venue}</strong></div>
            <div class="detail-list-item"><span>Category</span><strong>${event.category}</strong></div>
            <div class="detail-list-item"><span>Deadline</span><strong>${formatDate(event.registrationDeadline)}</strong></div>
            <div class="detail-list-item"><span>Eligibility</span><strong>${event.eligibility}</strong></div>
            <div class="detail-list-item"><span>Seats</span><strong>${event.seats}</strong></div>
          </div>
          <div class="button-stack">
            <button class="primary-button" data-register-event="${event.id}" ${isRegistered ? 'disabled' : ''}>${isRegistered ? 'Registered' : 'Register Now'}</button>
            <button class="secondary-button" data-save-event="${event.id}">${isSaved ? 'Saved' : 'Save Event'}</button>
            <button class="ghost-button" id="share-event-button">Share Event</button>
          </div>
        </div>
      </aside>
    </div>
  `;

  const shareButton = document.getElementById('share-event-button');
  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const link = window.location.href;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`Check out ${event.title} on EventHive: ${link}`);
      }
      showToast('Event link copied to clipboard.', 'success');
    });
  }

  showPage('detail');
  bindGlobalActions();
}

function bindGlobalActions() {
  document.querySelectorAll('[data-go-page]').forEach((button) => {
    bindActionButton(button, () => {
      showPage(button.dataset.goPage);
    });
  });

  document.querySelectorAll('[data-open-detail]').forEach((button) => {
    bindActionButton(button, () => openDetail(button.dataset.openDetail));
  });

  document.querySelectorAll('[data-save-event]').forEach((button) => {
    bindActionButton(button, () => toggleSave(button.dataset.saveEvent));
  });

  document.querySelectorAll('[data-register-event]').forEach((button) => {
    bindActionButton(button, () => registerForEvent(button.dataset.registerEvent));
  });

  document.querySelectorAll('[data-cancel-reg]').forEach((button) => {
    bindActionButton(button, () => cancelRegistration(button.dataset.cancelReg));
  });
}

function bindActionButton(button, handler) {
  if (boundActionButtons.has(button)) return;
  boundActionButtons.add(button);
  button.addEventListener('click', handler);
}

function bindGlobalControls() {
  const toggleTheme = () => {
    const next = localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };
  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.addEventListener('click', toggleTheme);
  });
  document.getElementById('settings-theme-toggle')?.addEventListener('click', toggleTheme);

  const notificationPanel = document.getElementById('notification-panel');
  const notificationButtons = [
    document.getElementById('notification-button'),
    document.getElementById('mobile-notification-button'),
  ];

  notificationButtons.forEach((button) => button.addEventListener('click', () => {
    const opening = notificationPanel.classList.contains('hidden');
    notificationPanel.classList.toggle('hidden', !opening);
    button.setAttribute('aria-expanded', String(opening));
    notificationButtons.forEach((otherButton) => {
      if (otherButton !== button) otherButton.setAttribute('aria-expanded', 'false');
    });
    if (opening) markNotificationsRead(false);
  }));

  document.addEventListener('click', (event) => {
    const clickedNotificationButton = event.target.closest('.notification-button');
    if (!clickedNotificationButton && !notificationPanel.contains(event.target)) {
      notificationPanel.classList.add('hidden');
      notificationButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      notificationPanel.classList.add('hidden');
      notificationButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    }
  });

  document.getElementById('sign-out-button').addEventListener('click', logout);
  document.getElementById('sidebar-logout-button').addEventListener('click', logout);
  document.getElementById('sidebar-delete-account-button').addEventListener('click', deleteAccount);

  document.getElementById('search-button').addEventListener('click', () => {
    const term = document.getElementById('global-search').value.trim();
    appState.filters = { ...appState.filters, search: term };
    showPage('explore');
    renderExplore();
  });

  document.getElementById('global-search').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const term = event.target.value.trim();
      appState.filters.search = term;
      showPage('explore');
      renderExplore();
    }
  });

  const sidebar = document.getElementById('sidebar');
  const sidebarToggles = [
    document.getElementById('menu-toggle'),
    document.getElementById('desktop-menu-toggle'),
  ];

  sidebarToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 980px)').matches) {
        if (sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
        } else {
          sidebar.classList.remove('collapsed');
          sidebar.classList.add('open');
        }
        toggle.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
        return;
      }

      sidebar.classList.toggle('collapsed');
      toggle.setAttribute('aria-expanded', String(!sidebar.classList.contains('collapsed')));
    });
  });

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      collapseSidebar();
      if (page === 'auth') {
        showPage('auth');
        return;
      }
      if (!getCurrentUser() && page !== 'auth') {
        showToast('Please log in to access this section.', 'error');
        showPage('auth');
        return;
      }
      showPage(page);
    });
  });

  document.getElementById('register-form').addEventListener('submit', (event) => handleAuthSubmit(event));
}

function initApp() {
  ensureStorage();
  bindGlobalControls();
  renderAll();
  if (getCurrentUser()) {
    showPage('home');
  } else {
    showPage('auth');
  }
  setInterval(updateCountdowns, 60000);
}

window.addEventListener('DOMContentLoaded', initApp);
