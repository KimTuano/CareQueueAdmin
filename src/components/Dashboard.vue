<template>
  <div class="layout">

    <!-- ── SIDEBAR ── -->
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-logo">
        <img src="../assets/CareQueueLogo.svg" alt="CareQueue" class="sidebar-logo-img" />
      </div>
      <nav class="sidebar-nav">
        <router-link v-if="isAdmin || doctorCan('view_dashboard')" to="/dashboard" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg></span>
          <span class="nav-label">Dashboard</span>
        </router-link>
        <router-link v-if="isAdmin || doctorCan('view_schedule')" to="/schedule" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></span>
          <span class="nav-label">Schedule</span>
        </router-link>
        <template v-if="isAdmin || doctorCan('book_appointment') || doctorCan('view_appointments') || doctorCan('view_queue')">
          <div class="nav-item nav-dropdown" :class="{ open: appointmentsOpen }" @click="appointmentsOpen = !appointmentsOpen">
            <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>
            <span class="nav-label">Appointments</span>
            <svg class="nav-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
          <div class="nav-sub" v-show="appointmentsOpen">
            <router-link v-if="isAdmin || doctorCan('book_appointment')" to="/appointments/book" class="nav-sub-item" active-class="active">Book Appointment</router-link>
            <router-link v-if="isAdmin || doctorCan('view_appointments')" to="/appointments/all" class="nav-sub-item" active-class="active">All Appointments</router-link>
            <router-link v-if="isAdmin || doctorCan('view_queue')" to="/appointments/queue" class="nav-sub-item" active-class="active">Queue</router-link>
          </div>
        </template>
        <router-link v-if="isAdmin || doctorCan('view_medical_records')" to="/medical-records" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></span>
          <span class="nav-label">Medical Records</span>
        </router-link>
        <router-link v-if="isAdmin || doctorCan('view_patients')" to="/patients" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></span>
          <span class="nav-label">Patients</span>
        </router-link>
        <router-link v-if="isAdmin" to="/adding-doctor" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg></span>
          <span class="nav-label">Doctors List</span>
        </router-link>
        <router-link v-if="isAdmin" to="/doctor-access" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></span>
          <span class="nav-label">Access Control</span>
        </router-link>
        <router-link v-if="isAdmin" to="/sms-blast" class="nav-item" active-class="active">
          <span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg></span>
          <span class="nav-label">SMS Blast</span>
        </router-link>
        <div v-if="!isAdmin" class="role-tag">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span class="nav-label">Doctor Account</span>
        </div>
      </nav>
    </aside>

    <!-- ── MAIN ── -->
    <div class="main-wrapper">

      <!-- TOPBAR -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
        <div class="topbar-right">
          <div class="topbar-btn notif-wrapper" @click="notifOpen = !notifOpen" v-click-outside="() => notifOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="notif-badge" v-if="unreadCount > 0">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>

            <div class="dropdown notif-dropdown" v-show="notifOpen" @click.stop>
              <div class="dropdown-header">
                <span>Notifications</span>
                <button class="mark-read" @click.stop="markAllRead" :disabled="unreadCount === 0">Mark all read</button>
              </div>

              <!-- Loading -->
              <div v-if="notifLoading" class="notif-loading-row">
                <div class="notif-spinner"></div> Loading...
              </div>

              <!-- Empty -->
              <div v-else-if="notifications.length === 0" class="notif-empty-row">
                No notifications
              </div>

              <!-- List -->
              <template v-else>
                <div
                  v-for="n in notifications"
                  :key="n.id"
                  class="notif-item"
                  :class="{ unread: !n.is_read }"
                  @click.stop="handleNotifClick(n)"
                >
                  <div class="notif-dot" :class="{ read: n.is_read }"></div>
                  <div>
                    <p class="notif-title">{{ n.title }}</p>
                    <p class="notif-time">{{ n.body }}</p>
                    <p class="notif-time" style="color:#b0c4c4; margin-top:2px">{{ formatNotifTime(n.created_at) }}</p>
                  </div>
                </div>
              </template>

              <!-- Admin compose button -->
              <div v-if="isAdmin" class="notif-compose-wrap">
                <button class="notif-compose-btn" @click.stop="notifCompose = !notifCompose">
                  + Send to Doctor
                </button>
                <div v-if="notifCompose" class="notif-compose-box" @click.stop>
                  <select v-model="notifForm.target" class="notif-compose-input">
                    <option value="">All Doctors</option>
                    <option v-for="d in doctors" :key="d.id" :value="`Dr. ${d.first_name} ${d.last_name}`">
                      Dr. {{ d.first_name }} {{ d.last_name }}
                    </option>
                  </select>
                  <input v-model="notifForm.title" class="notif-compose-input" placeholder="Title" />
                  <textarea v-model="notifForm.body" class="notif-compose-textarea" placeholder="Message..." rows="2"></textarea>
                  <div style="display:flex;gap:6px;margin-top:6px">
                    <button class="notif-cancel-btn" @click.stop="notifCompose = false">Cancel</button>
                    <button class="notif-send-btn" @click.stop="sendNotif" :disabled="!notifForm.title || !notifForm.body">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="account-wrapper" @click="accountOpen = !accountOpen" v-click-outside="() => accountOpen = false">
            <div class="account-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item" @click="goTo('edit-profile')">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Edit Account
              </button>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item logout" @click="handleLogout">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- ── ACCESS DENIED ── -->
      <main v-if="!canAccess" class="content">
        <div class="access-denied">
          <div class="access-denied-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h2 class="access-denied-title">Access Restricted</h2>
          <p class="access-denied-msg">You don't have permission to view the Dashboard.</p>
        </div>
      </main>

      <!-- ── PAGE CONTENT ── -->
      <main v-else class="content">
        <div class="page-header">
          <h1 class="page-title">DASHBOARD</h1>
          <p class="breadcrumb">Home / Dashboard</p>
        </div>

        <!-- ══ HERO CARD ══ -->
        <div class="hero-card">
          <div class="hero-profile">
            <div class="hero-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="hero-text">
              <p class="hero-greeting">Welcome back,</p>
              <h2 class="hero-name">{{ currentUser.name }}</h2>
              <span class="hero-role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Administrator' : 'Doctor' }}</span>
            </div>
          </div>
          <div class="hero-divider"></div>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-icon teal">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <div>
                <p class="hero-stat-num">{{ totalDoctors }}</p>
                <p class="hero-stat-label">Total Doctors</p>
                <div class="hero-stat-badges">
                  <span class="mini-badge in">{{ doctorsIN }} IN</span>
                  <span class="mini-badge out">{{ doctorsOUT }} OUT</span>
                </div>
              </div>
            </div>
            <div class="hero-stat-sep"></div>
            <div class="hero-stat">
              <div class="hero-stat-icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <p class="hero-stat-num">{{ totalPatients }}</p>
                <p class="hero-stat-label">Total Patients</p>
                <p class="hero-stat-sub">Registered in system</p>
              </div>
            </div>
            <div class="hero-stat-sep"></div>
            <div class="hero-stat">
              <div class="hero-stat-icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              </div>
              <div>
                <p class="hero-stat-num">{{ totalAppointments }}</p>
                <p class="hero-stat-label">Appointments</p>
                <div class="hero-stat-badges">
                  <span class="mini-badge waiting">{{ waitingCount }} waiting</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ BOTTOM GRID: Status chart + Doctors ══ -->
        <div class="bottom-grid">

          <!-- Status Overview Chart -->
          <div class="chart-card">
            <div class="chart-card-header">
              <h3>Appointment Status Overview</h3>
              <span class="total-chip">{{ totalAppointments }} total</span>
            </div>
            <div class="donut-section">
              <div class="donut-wrap">
                <canvas ref="pieChart" width="200" height="200"></canvas>
                <div class="donut-center">
                  <span class="donut-center-num">{{ totalAppointments }}</span>
                  <span class="donut-center-label">Total</span>
                </div>
              </div>
              <div class="donut-legend">
                <div class="legend-row" v-for="s in appointmentStats" :key="s.label">
                  <div class="legend-color-bar" :style="{ background: s.color }"></div>
                  <div class="legend-info">
                    <span class="legend-label">{{ s.label }}</span>
                    <span class="legend-pct">{{ totalAppointments ? Math.round(s.count / totalAppointments * 100) : 0 }}%</span>
                  </div>
                  <span class="legend-count">{{ s.count }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Doctors Card -->
          <div class="doctors-card">
            <div class="doctors-header">
              <h3>Available Doctors</h3>
              <span class="available-count">{{ doctorsIN }} available</span>
            </div>
            <input type="text" class="search-input" placeholder="Search doctor or office..." v-model="doctorSearch" />
            <div v-if="loadingData" class="loading-mini">Loading...</div>
            <template v-else>
              <table class="doctors-table">
                <thead>
                  <tr><th>Name</th><th>Office</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr v-if="pagedDoctors.length === 0"><td colspan="3" class="empty-doctors">No doctors found.</td></tr>
                  <tr v-for="doc in pagedDoctors" :key="doc.id">
                    <td>Dr. {{ doc.last_name }}, {{ doc.first_name }}</td>
                    <td>{{ doc.office }}</td>
                    <td><span :class="['status-badge', doc.status === 'IN' ? 'in' : 'out']">{{ doc.status }}</span></td>
                  </tr>
                  <tr v-for="i in emptyRowCount" :key="'empty-' + i" class="placeholder-row"><td colspan="3">&nbsp;</td></tr>
                </tbody>
              </table>
              <div class="doc-pagination" v-if="docTotalPages > 1">
                <button class="doc-page-btn nav-btn" :disabled="docCurrentPage === 1" @click="docCurrentPage--">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <template v-for="(item, idx) in docPaginationItems" :key="idx">
                  <span v-if="item === '...'" class="doc-ellipsis">…</span>
                  <button v-else class="doc-page-btn" :class="{ active: item === docCurrentPage }" @click="docCurrentPage = item">{{ item }}</button>
                </template>
                <button class="doc-page-btn nav-btn" :disabled="docCurrentPage === docTotalPages" @click="docCurrentPage++">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
                <span class="doc-page-info">{{ docCurrentPage }} / {{ docTotalPages }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- ══ MONTHLY CHART CARD ══ -->
        <div class="monthly-card">
          <!-- Header row -->
          <div class="monthly-header">
            <div class="monthly-title-group">
              <h3>Monthly Appointments</h3>
              <span class="monthly-sub">Daily breakdown by status</span>
            </div>

            <!-- Month / Year navigator -->
            <div class="monthly-nav">
              <button class="mnav-btn" @click="shiftMonth(-1)" title="Previous month">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <span class="mnav-label">{{ monthLabel }}</span>
              <button class="mnav-btn" @click="shiftMonth(1)" :disabled="isCurrentMonth" title="Next month">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            <!-- Status filter pills -->
            <div class="monthly-filters">
              <button
                v-for="f in monthlyFilters"
                :key="f.key"
                class="mfilter-btn"
                :class="{ active: activeFilters.includes(f.key) }"
                :style="activeFilters.includes(f.key) ? { background: f.color + '22', borderColor: f.color, color: f.color } : {}"
                @click="toggleFilter(f.key)"
              >
                <span class="mfilter-dot" :style="{ background: f.color }"></span>
                {{ f.label }}
              </button>
            </div>

            <!-- Summary chips -->
            <div class="monthly-summary">
              <div class="msum-chip">
                <span class="msum-num">{{ monthlyTotal }}</span>
                <span class="msum-label">Total</span>
              </div>
              <div class="msum-chip peak">
                <span class="msum-num">{{ monthlyPeak }}</span>
                <span class="msum-label">Peak day</span>
              </div>
            </div>
          </div>

          <!-- Chart -->
          <div class="monthly-chart-wrap" v-if="!loadingMonthly">
            <canvas ref="monthlyChart" height="110"></canvas>
          </div>
          <div class="monthly-loading" v-else>
            <div class="monthly-spinner"></div>
            <span>Loading chart…</span>
          </div>

          <!-- Bottom legend -->
          <div class="monthly-legend">
            <div class="mleg-item" v-for="f in monthlyFilters" :key="'leg'+f.key">
              <span class="mleg-dot" :style="{ background: f.color }"></span>
              {{ f.label }}
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const DOC_PER_PAGE = 7

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const STATUS_CONFIG = [
  { key: 'waiting',   label: 'Waiting',   color: '#f97316' },
  { key: 'approved',  label: 'Approved',  color: '#3aa6a6' },
  { key: 'arrived',   label: 'Arrived',   color: '#6c63ff' },
  { key: 'completed', label: 'Completed', color: '#16a34a' },
  { key: 'cancelled', label: 'Cancelled', color: '#ef4444' },
]

export default {
  name: 'Dashboard',

  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value(e) }
        document.addEventListener('click', el._clickOutside)
      },
      unmounted(el) { document.removeEventListener('click', el._clickOutside) }
    }
  },

  data() {
    const now = new Date()
    return {
      sidebarCollapsed: false,
      notifOpen: false,
      accountOpen: false,
      appointmentsOpen: false,
      doctorSearch: '',
      loadingData: true,
      docCurrentPage: 1,
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),

      doctors: [],
      patients: [],
      appointments: [],
      pieChartInstance: null,

      // ── Monthly chart state ──
      monthlyYear:  now.getFullYear(),
      monthlyMonth: now.getMonth() + 1,   // 1-based
      monthlyDays:  [],                    // array from API
      loadingMonthly: false,
      monthlyChartInstance: null,
      activeFilters: STATUS_CONFIG.map(s => s.key),  // all on by default
      monthlyFilters: STATUS_CONFIG,
      notifLoading: false,
      notifications: [],
      unreadCount: 0,
      notifCompose: false,
      notifForm: { target: '', title: '', body: '' },
    }
  },

  computed: {
    isAdmin()   { return localStorage.getItem('role') === 'admin' },
    canAccess() { return this.isAdmin || this.doctorCan('view_dashboard') },

    totalDoctors()      { return this.doctors.length },
    doctorsIN()         { return this.doctors.filter(d => d.status === 'IN').length },
    doctorsOUT()        { return this.doctors.filter(d => d.status === 'OUT').length },
    totalPatients()     { return this.patients.length },
    totalAppointments() { return this.appointments.length },
    waitingCount()      { return this.appointments.filter(a => a.status === 'waiting').length },
    completedCount()    { return this.appointments.filter(a => a.status === 'completed').length },
    cancelledCount()    { return this.appointments.filter(a => a.status === 'cancelled').length },
    approvedCount()     { return this.appointments.filter(a => a.status === 'approved').length },
    arrivedCount()      { return this.appointments.filter(a => a.status === 'arrived').length },

    appointmentStats() {
      return [
        { label: 'Waiting',   count: this.waitingCount,   color: '#f97316' },
        { label: 'Approved',  count: this.approvedCount,  color: '#3aa6a6' },
        { label: 'Arrived',   count: this.arrivedCount,   color: '#6c63ff' },
        { label: 'Completed', count: this.completedCount, color: '#16a34a' },
        { label: 'Cancelled', count: this.cancelledCount, color: '#ef4444' },
      ]
    },

    filteredDoctors() {
      const q = this.doctorSearch.toLowerCase()
      return this.doctors.filter(d =>
        `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) ||
        (d.office || '').toLowerCase().includes(q)
      )
    },
    docTotalPages() { return Math.max(1, Math.ceil(this.filteredDoctors.length / DOC_PER_PAGE)) },
    pagedDoctors() {
      const start = (this.docCurrentPage - 1) * DOC_PER_PAGE
      return this.filteredDoctors.slice(start, start + DOC_PER_PAGE)
    },
    emptyRowCount() { return Math.max(0, DOC_PER_PAGE - this.pagedDoctors.length) },
    docPaginationItems() {
      const total = this.docTotalPages, current = this.docCurrentPage
      if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
      const items = [], rs = Math.max(2, current - 1), re = Math.min(total - 1, current + 1)
      items.push(1)
      if (rs > 2) items.push('...')
      for (let i = rs; i <= re; i++) items.push(i)
      if (re < total - 1) items.push('...')
      items.push(total)
      return items
    },

    // ── Monthly ──
    monthLabel() {
      return `${MONTH_NAMES[this.monthlyMonth - 1]} ${this.monthlyYear}`
    },
    isCurrentMonth() {
      const now = new Date()
      return this.monthlyYear === now.getFullYear() && this.monthlyMonth === (now.getMonth() + 1)
    },
    monthlyTotal() {
      return this.monthlyDays.reduce((s, d) => s + d.total, 0)
    },
    monthlyPeak() {
      return this.monthlyDays.reduce((max, d) => d.total > max ? d.total : max, 0)
    },
  },

  watch: {
    doctorSearch() { this.docCurrentPage = 1 },
    appointmentStats: { deep: true, handler() { this.$nextTick(() => this.initPieChart()) } },
    activeFilters() { this.$nextTick(() => this.buildMonthlyChart()) },
  },

  methods: {
    
    async fetchNotifications() {
      this.notifLoading = true
      try {
        const role = localStorage.getItem('role')
        const user = JSON.parse(localStorage.getItem('user')) || {}
        let url = `http://https://carequeue-admin.com/api/notifications?role=${role}`
        if (role === 'doctor' && user.name) url += `&doctor=${encodeURIComponent(user.name)}`
        const res = await fetch(url)
        const data = await res.json()
        this.notifications = data.notifications || []
        this.unreadCount   = data.unreadCount   || 0
      } catch (err) {
        console.error('Notifications error:', err)
      } finally {
        this.notifLoading = false
      }
    },

    async markAllRead() {
      const role = localStorage.getItem('role')
      const user = JSON.parse(localStorage.getItem('user')) || {}
      await fetch('http://https://carequeue-admin.com/api/notifications/mark-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, doctor: user.name })
      }).catch(() => {})
      this.notifications = this.notifications.map(n => ({ ...n, is_read: 1 }))
      this.unreadCount = 0
    },

    handleNotifClick(n) {
      n.is_read = 1
      this.unreadCount = this.notifications.filter(x => !x.is_read).length
      if (n.link) { this.$router.push(n.link); this.notifOpen = false }
    },

    async sendNotif() {
      if (!this.notifForm.title || !this.notifForm.body) return
      await fetch('http://https://carequeue-admin.com/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: this.notifForm.target ? 'doctor' : 'both',
          target_doctor: this.notifForm.target || null,
          title: this.notifForm.title,
          body: this.notifForm.body
        })
      }).catch(() => {})
      this.notifForm = { target: '', title: '', body: '' }
      this.notifCompose = false
      await this.fetchNotifications()
    },

    formatNotifTime(dateStr) {
      if (!dateStr) return ''
      const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
      if (diff < 60)    return 'just now'
      if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },

    doctorCan(key) { return !!this.livePerms[key] },

    barWidth(count) {
      if (this.totalAppointments === 0) return 0
      return Math.round((count / this.totalAppointments) * 100)
    },

    async fetchAll() {
      this.loadingData = true
      try {
        const [dRes, pRes, aRes] = await Promise.all([
          fetch('http://https://carequeue-admin.com/api/doctors'),
          fetch('http://https://carequeue-admin.com/api/patients'),
          fetch('http://https://carequeue-admin.com/api/appointments'),
        ])
        this.doctors      = await dRes.json()
        this.patients     = await pRes.json()
        this.appointments = await aRes.json()
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        this.loadingData = false
        this.$nextTick(() => this.initPieChart())
      }
    },

    // ── Monthly data fetch ──────────────────────────────
    async fetchMonthly() {
      this.loadingMonthly = true
      try {
        const res = await fetch(
          `http://https://carequeue-admin.com/api/appointments/monthly?year=${this.monthlyYear}&month=${this.monthlyMonth}`
        )
        const data = await res.json()
        this.monthlyDays = data.days || []
      } catch (err) {
        console.error('Failed to fetch monthly data:', err)
        this.monthlyDays = []
      } finally {
        this.loadingMonthly = false
        this.$nextTick(() => this.buildMonthlyChart())
      }
    },

    shiftMonth(delta) {
      let m = this.monthlyMonth + delta
      let y = this.monthlyYear
      if (m < 1)  { m = 12; y-- }
      if (m > 12) { m = 1;  y++ }
      // Don't go past current month
      const now = new Date()
      if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth() + 1)) return
      this.monthlyMonth = m
      this.monthlyYear  = y
      this.fetchMonthly()
    },

    toggleFilter(key) {
      const idx = this.activeFilters.indexOf(key)
      if (idx === -1) {
        this.activeFilters.push(key)
      } else {
        if (this.activeFilters.length > 1) this.activeFilters.splice(idx, 1)
      }
    },

    // ── Build / rebuild the monthly stacked bar chart ──
    buildMonthlyChart() {
      if (this.monthlyChartInstance) {
        this.monthlyChartInstance.destroy()
        this.monthlyChartInstance = null
      }
      const ctx = this.$refs.monthlyChart?.getContext('2d')
      if (!ctx || !this.monthlyDays.length) return

      const labels   = this.monthlyDays.map(d => d.day)
      const today    = new Date()
      const todayDay = (today.getFullYear() === this.monthlyYear && (today.getMonth() + 1) === this.monthlyMonth)
        ? today.getDate() : -1

      const datasets = STATUS_CONFIG
        .filter(s => this.activeFilters.includes(s.key))
        .map(s => ({
          label: s.label,
          data:  this.monthlyDays.map(d => d[s.key] || 0),
          backgroundColor: s.color + 'cc',   // slight transparency
          borderColor: s.color,
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
        }))

      this.monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: { duration: 600, easing: 'easeInOutQuart' },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#94a3b8',
              bodyColor: '#f1f5f9',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                title: (items) => {
                  const day = items[0].label
                  return `${MONTH_NAMES[this.monthlyMonth - 1]} ${day}, ${this.monthlyYear}`
                },
                afterBody: (items) => {
                  const total = items.reduce((s, i) => s + i.parsed.y, 0)
                  return total > 0 ? [`─────────────`, `Total: ${total}`] : []
                }
              }
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: {
                color: (ctx) => ctx.tick.value + 1 === todayDay ? '#3aa6a6' : '#94a3b8',
                font: { size: 11 },
                maxRotation: 0,
                // Show every other day label on small screens to avoid crowding
                callback(val, idx) { return (idx + 1) % 2 === 1 ? this.getLabelForValue(val) : '' }
              },
              border: { display: false },
            },
            y: {
              stacked: true,
              grid: { color: '#f1f5f9', drawBorder: false },
              ticks: { color: '#94a3b8', font: { size: 11 }, stepSize: 1, precision: 0 },
              border: { display: false },
            }
          }
        },
        plugins: [{
          // Highlight today's column with a subtle background band
          id: 'todayHighlight',
          beforeDatasetsDraw(chart) {
            if (todayDay < 1) return
            const { ctx, scales: { x, y } } = chart
            const idx = todayDay - 1
            if (idx < 0 || idx >= x.ticks.length) return
            const xPos   = x.getPixelForValue(idx)
            const barW   = x.width / x.ticks.length
            const top    = y.top
            const bottom = y.bottom
            ctx.save()
            ctx.fillStyle = 'rgba(58,166,166,0.07)'
            ctx.fillRect(xPos - barW / 2, top, barW, bottom - top)
            ctx.restore()
          }
        }]
      })
    },

    initPieChart() {
      if (this.pieChartInstance) { this.pieChartInstance.destroy(); this.pieChartInstance = null }
      const ctx = this.$refs.pieChart?.getContext('2d')
      if (!ctx) return
      const stats   = this.appointmentStats
      const hasData = stats.some(s => s.count > 0)
      this.pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: stats.map(s => s.label),
          datasets: [{
            data: hasData ? stats.map(s => s.count) : [1],
            backgroundColor: hasData ? stats.map(s => s.color) : ['#e2e8f0'],
            borderWidth: hasData ? 3 : 0,
            borderColor: '#ffffff',
            hoverOffset: 8,
          }]
        },
        options: {
          responsive: false, cutout: '72%',
          animation: { animateRotate: true, duration: 900, easing: 'easeInOutQuart' },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: hasData,
              callbacks: {
                label: (ctx) => {
                  const val = ctx.parsed
                  const pct = this.totalAppointments ? Math.round(val / this.totalAppointments * 100) : 0
                  return ` ${ctx.label}: ${val} (${pct}%)`
                }
              },
              backgroundColor: '#1e293b', titleColor: '#94a3b8',
              bodyColor: '#f8fafc', padding: 10, cornerRadius: 8,
            }
          }
        }
      })
    },

    goTo(page)    { this.accountOpen = false; this.$router.push('/' + page) },
    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    }
  },

  mounted() {
    this.fetchAll()
    this.fetchMonthly()
    this.fetchNotifications()
    this._notifPoll = setInterval(() => this.fetchNotifications(), 30000)
  },

  beforeUnmount() {
  clearInterval(this._notifPoll)
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }

/* ── SIDEBAR ── */
.sidebar { width: 220px; min-height: 100vh; background: #1b2540; display: flex; flex-direction: column; transition: width 0.3s; overflow: hidden; flex-shrink: 0; }
.sidebar.collapsed { width: 64px; }
.sidebar.collapsed .nav-label, .sidebar.collapsed .nav-arrow, .sidebar.collapsed .nav-sub { display: none; }
.sidebar-logo { display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: -12px; }
.sidebar-logo-img { width: 60%; height: 60%; border-radius: 10px; object-fit: cover; background: white; padding: 2px; }
.sidebar.collapsed .sidebar-logo-img { margin: 5px; width: 40px; height: 40px; }
.sidebar-nav { padding: 12px 0; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; color: #94a3b8; text-decoration: none; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; white-space: nowrap; }
.nav-item:hover { color: white; background: rgba(255,255,255,0.06); }
.nav-item.active { color: white; background: rgba(58,166,166,0.15); border-left-color: #3aa6a6; }
.nav-icon { flex-shrink: 0; display: flex; }
.nav-arrow { margin-left: auto; transition: transform 0.3s; }
.nav-dropdown.open .nav-arrow { transform: rotate(180deg); }
.nav-sub { padding-left: 46px; background: rgba(0,0,0,0.15); }
.nav-sub-item { display: block; padding: 9px 12px; color: #94a3b8; text-decoration: none; font-size: 13px; transition: color 0.2s; }
.nav-sub-item:hover, .nav-sub-item.active { color: #3aa6a6; }
.role-tag { display: flex; align-items: center; gap: 8px; padding: 10px 16px; color: #64748b; font-size: 12px; font-weight: 500; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); }

/* ── TOPBAR ── */
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; transition: background 0.2s; }
.hamburger:hover { background: rgba(255,255,255,0.15); }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.topbar-btn { position: relative; background: none; border: none; cursor: pointer; color: #fff; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.topbar-btn:hover { background: rgba(255,255,255,0.15); }
.notif-badge { position: absolute; top: 4px; right: 4px; background: #ef4444; color: white; font-size: 9px; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; }
.notif-wrapper { position: relative; }
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; animation: fadeDown 0.15s ease; }
@keyframes fadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.dropdown-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
.mark-read { font-size: 11px; color: #3aa6a6; text-decoration: none; font-weight: 500; }
.notif-dropdown { width: 300px; }
.notif-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; }
.notif-item:hover { background: #f8fafc; }
.notif-item.unread { background: #f0fafa; }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #3aa6a6; margin-top: 5px; flex-shrink: 0; }
.notif-dot.read { background: #cbd5e1; }
.notif-title { font-size: 13px; color: #1e293b; font-weight: 500; }
.notif-time { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.notif-loading-row { display:flex; align-items:center; gap:8px; padding:16px; color:#94a3b8; font-size:13px; justify-content:center; }
.notif-spinner { width:16px; height:16px; border:2px solid #e2e8f0; border-top-color:#3aa6a6; border-radius:50%; animation:spin 0.7s linear infinite; }
.notif-empty-row { padding:20px; text-align:center; color:#94a3b8; font-size:13px; }
.mark-read { font-size:11px; color:#3aa6a6; background:none; border:none; cursor:pointer; font-weight:500; padding:0; }
.mark-read:disabled { opacity:0.4; cursor:default; }
.notif-compose-wrap { border-top:1px solid #f1f5f9; padding:10px 14px; }
.notif-compose-btn { width:100%; padding:7px; background:#f0fafa; border:1.5px dashed #3aa6a6; border-radius:8px; color:#0f766e; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.2s; }
.notif-compose-btn:hover { background:#ccfbf1; }
.notif-compose-box { margin-top:8px; display:flex; flex-direction:column; gap:6px; }
.notif-compose-input { width:100%; padding:7px 10px; border:1.5px solid #e2e8f0; border-radius:7px; font-size:12.5px; color:#475569; font-family:inherit; outline:none; }
.notif-compose-input:focus { border-color:#3aa6a6; }
.notif-compose-textarea { width:100%; padding:7px 10px; border:1.5px solid #e2e8f0; border-radius:7px; font-size:12.5px; color:#475569; font-family:inherit; outline:none; resize:none; }
.notif-compose-textarea:focus { border-color:#3aa6a6; }
.notif-cancel-btn { flex:1; padding:6px; border:1.5px solid #e2e8f0; background:white; border-radius:7px; font-size:12px; font-weight:600; color:#64748b; cursor:pointer; font-family:inherit; }
.notif-send-btn { flex:1; padding:6px; background:#3aa6a6; border:none; border-radius:7px; font-size:12px; font-weight:600; color:white; cursor:pointer; font-family:inherit; }
.notif-send-btn:disabled { opacity:0.5; cursor:not-allowed; }
.account-wrapper { position: relative; cursor: pointer; }
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: white; }
.account-dropdown { width: 220px; }
.account-info { flex-direction: column; align-items: flex-start; gap: 2px; }
.account-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.account-email { font-size: 11px; color: #94a3b8; }
.dropdown-divider { border: none; border-top: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.dropdown-item:hover { background: #f8fafc; color: #1e293b; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-item.logout:hover { background: #fff5f5; }
.role-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-top: 4px; }
.role-pill.admin  { background: #e0f2f1; color: #00796b; }
.role-pill.doctor { background: #e8eaf6; color: #3949ab; }

/* ── ACCESS DENIED ── */
.access-denied { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 16px; }
.access-denied-icon { width: 96px; height: 96px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; }
.access-denied-title { font-size: 20px; font-weight: 700; color: #1e293b; }
.access-denied-msg { font-size: 14px; color: #64748b; max-width: 380px; line-height: 1.6; }

/* ── CONTENT ── */
.content { padding: 28px; flex: 1; overflow-y: auto; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }

/* ══ HERO CARD ══ */
.hero-card {
  display: flex; align-items: center; gap: 0;
  background: linear-gradient(135deg,#1b2e4a 0%,#1e4a5c 50%,#1b3a4a 100%);
  border-radius: 18px; padding: 22px 28px; margin-bottom: 20px;
  box-shadow: 0 4px 24px rgba(27,37,64,0.18); overflow: hidden; position: relative;
}
.hero-card::before { content:''; position:absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:50%; background:rgba(58,166,166,0.12); pointer-events:none; }
.hero-card::after  { content:''; position:absolute; bottom:-30px; left:180px; width:100px; height:100px; border-radius:50%; background:rgba(108,99,255,0.1); pointer-events:none; }
.hero-profile { display:flex; align-items:center; gap:16px; flex-shrink:0; min-width:220px; }
.hero-avatar { width:60px; height:60px; border-radius:50%; background:rgba(58,166,166,0.25); border:2px solid rgba(58,166,166,0.5); display:flex; align-items:center; justify-content:center; color:#7edada; flex-shrink:0; }
.hero-greeting { font-size:12px; color:rgba(255,255,255,0.55); font-weight:500; margin-bottom:2px; }
.hero-name { font-size:17px; font-weight:700; color:white; line-height:1.2; }
.hero-role-pill { display:inline-block; margin-top:6px; padding:2px 10px; border-radius:999px; font-size:11px; font-weight:700; }
.hero-role-pill.admin  { background:rgba(58,166,166,0.25); color:#7edada; border:1px solid rgba(58,166,166,0.4); }
.hero-role-pill.doctor { background:rgba(108,99,255,0.25); color:#b0abff; border:1px solid rgba(108,99,255,0.4); }
.hero-divider { width:1px; height:70px; background:rgba(255,255,255,0.12); margin:0 28px; flex-shrink:0; }
.hero-stats { display:flex; align-items:center; gap:0; flex:1; }
.hero-stat { display:flex; align-items:flex-start; gap:14px; flex:1; padding:0 20px; }
.hero-stat-sep { width:1px; height:54px; background:rgba(255,255,255,0.1); flex-shrink:0; }
.hero-stat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:white; }
.hero-stat-icon.teal   { background:linear-gradient(135deg,#3aa6a6,#2dd4bf); }
.hero-stat-icon.purple { background:linear-gradient(135deg,#6c63ff,#a78bfa); }
.hero-stat-icon.orange { background:linear-gradient(135deg,#f97316,#fb923c); }
.hero-stat-num   { display:block; font-size:24px; font-weight:700; color:white; line-height:1; }
.hero-stat-label { display:block; font-size:11.5px; color:rgba(255,255,255,0.55); margin-top:3px; font-weight:500; }
.hero-stat-sub   { display:block; font-size:11px; color:rgba(255,255,255,0.4); margin-top:4px; }
.hero-stat-badges { display:flex; gap:4px; margin-top:5px; flex-wrap:wrap; }
.mini-badge { font-size:10px; font-weight:700; padding:2px 7px; border-radius:20px; }
.mini-badge.in      { background:rgba(22,163,74,0.25); color:#4ade80; border:1px solid rgba(74,222,128,0.3); }
.mini-badge.out     { background:rgba(239,68,68,0.2);  color:#f87171; border:1px solid rgba(248,113,113,0.3); }
.mini-badge.waiting { background:rgba(249,115,22,0.2); color:#fb923c; border:1px solid rgba(251,146,60,0.3); }

/* ══ BOTTOM GRID ══ */
.bottom-grid { display:grid; grid-template-columns:1fr 380px; gap:20px; margin-bottom:20px; }

/* ══ STATUS CHART CARD ══ */
.chart-card { background:white; border-radius:16px; padding:24px; box-shadow:0 1px 4px rgba(0,0,0,0.06); }
.chart-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.chart-card-header h3 { font-size:15px; font-weight:700; color:#1e293b; }
.total-chip { font-size:12px; font-weight:700; color:#3aa6a6; background:#e6f7f7; padding:4px 12px; border-radius:20px; }
.donut-section { display:flex; align-items:center; gap:28px; margin-bottom:20px; }
.donut-wrap { position:relative; flex-shrink:0; }
.donut-center { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; pointer-events:none; }
.donut-center-num   { display:block; font-size:26px; font-weight:800; color:#1e293b; line-height:1; }
.donut-center-label { display:block; font-size:11px; color:#94a3b8; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:0.5px; }
.donut-legend { display:flex; flex-direction:column; gap:10px; flex:1; }
.legend-row { display:flex; align-items:center; gap:10px; padding:6px 10px; border-radius:8px; transition:background 0.15s; }
.legend-row:hover { background:#f8fafc; }
.legend-color-bar { width:4px; height:32px; border-radius:4px; flex-shrink:0; }
.legend-info { flex:1; }
.legend-label { display:block; font-size:12.5px; font-weight:600; color:#374151; }
.legend-pct   { display:block; font-size:11px; color:#94a3b8; margin-top:1px; }
.legend-count { font-size:16px; font-weight:800; color:#1e293b; flex-shrink:0; }

/* ══ DOCTORS CARD ══ */
.doctors-card { background:white; border-radius:16px; padding:24px; box-shadow:0 1px 4px rgba(0,0,0,0.06); display:flex; flex-direction:column; }
.doctors-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.doctors-header h3 { font-size:15px; font-weight:700; color:#1e293b; }
.available-count { font-size:12px; font-weight:700; color:#16a34a; background:#dcfce7; padding:4px 12px; border-radius:20px; }
.search-input { width:100%; padding:9px 14px; border:1px solid #e2e8f0; border-radius:8px; font-size:13px; outline:none; margin-bottom:14px; font-family:inherit; color:#475569; transition:border-color 0.2s; }
.search-input:focus { border-color:#3aa6a6; }
.loading-mini { text-align:center; padding:20px; color:#94a3b8; font-size:13px; }
.doctors-table { width:100%; border-collapse:collapse; font-size:13px; }
.doctors-table th { text-align:left; padding:8px 10px; color:#94a3b8; font-weight:600; font-size:12px; border-bottom:1px solid #f1f5f9; }
.doctors-table td { padding:9px 10px; color:#475569; border-bottom:1px solid #f8fafc; }
.doctors-table tr:last-child td { border-bottom:none; }
.doctors-table tr:hover:not(.placeholder-row) td { background:#f8fafc; }
.placeholder-row td { border-bottom:1px solid #f8fafc; height:38px; }
.empty-doctors { text-align:center; color:#94a3b8; padding:20px; font-size:13px; }
.status-badge { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; }
.status-badge.in  { color:#16a34a; background:#dcfce7; }
.status-badge.out { color:#dc2626; background:#fee2e2; }
.doc-pagination { display:flex; align-items:center; justify-content:center; gap:4px; padding-top:14px; margin-top:auto; border-top:1px solid #f1f5f9; flex-wrap:nowrap; }
.doc-page-btn { min-width:28px; height:28px; padding:0 6px; border:1.5px solid #e2e8f0; background:white; border-radius:6px; font-size:12px; font-weight:500; color:#475569; cursor:pointer; font-family:inherit; transition:all 0.2s; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
.doc-page-btn:hover:not(:disabled) { border-color:#3aa6a6; color:#3aa6a6; background:#f0fafa; }
.doc-page-btn.active { background:#3aa6a6; color:white; border-color:#3aa6a6; font-weight:700; }
.doc-page-btn:disabled { opacity:0.35; cursor:not-allowed; }
.nav-btn { color:#64748b; }
.doc-ellipsis { min-width:24px; height:28px; display:inline-flex; align-items:center; justify-content:center; font-size:12px; color:#94a3b8; user-select:none; letter-spacing:1px; flex-shrink:0; }
.doc-page-info { font-size:11px; color:#94a3b8; font-weight:500; margin-left:4px; white-space:nowrap; }

/* ══ MONTHLY CHART CARD ══ */
.monthly-card {
  background: white;
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  margin-bottom: 8px;
}

.monthly-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.monthly-title-group h3 { font-size: 15px; font-weight: 700; color: #1e293b; }
.monthly-sub { font-size: 12px; color: #94a3b8; display: block; margin-top: 2px; }

/* Month navigator */
.monthly-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px 12px;
}
.mnav-label { font-size: 13px; font-weight: 700; color: #1e293b; min-width: 130px; text-align: center; }
.mnav-btn {
  background: none; border: none; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  padding: 4px; border-radius: 6px; transition: all 0.2s;
}
.mnav-btn:hover:not(:disabled) { background: #e2e8f0; color: #1e293b; }
.mnav-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* Filter pills */
.monthly-filters { display: flex; gap: 6px; flex-wrap: wrap; }
.mfilter-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600;
  border: 1.5px solid #e2e8f0; background: white; color: #64748b;
  cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.mfilter-btn:hover { border-color: #cbd5e1; color: #374151; }
.mfilter-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* Summary chips */
.monthly-summary { display: flex; gap: 10px; margin-left: auto; }
.msum-chip {
  text-align: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px 16px;
  min-width: 64px;
}
.msum-chip.peak { background: #fef3e8; border-color: #fed7aa; }
.msum-num   { display: block; font-size: 18px; font-weight: 800; color: #1e293b; line-height: 1; }
.msum-label { display: block; font-size: 10px; color: #94a3b8; margin-top: 3px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; }

/* Chart wrap */
.monthly-chart-wrap { padding: 4px 0; }

/* Loading state */
.monthly-loading {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 140px; gap: 12px; color: #94a3b8; font-size: 13px;
}
.monthly-spinner {
  width: 28px; height: 28px; border: 3px solid #e2e8f0;
  border-top-color: #3aa6a6; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Bottom legend */
.monthly-legend {
  display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;
  padding-top: 14px; border-top: 1px solid #f1f5f9;
}
.mleg-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; font-weight: 500; }
.mleg-dot  { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) { .bottom-grid { grid-template-columns: 1fr; } }
@media (max-width: 900px) {
  .hero-card { flex-wrap: wrap; gap: 16px; }
  .hero-divider { display: none; }
  .hero-stats { flex-wrap: wrap; }
  .hero-stat-sep { display: none; }
  .monthly-header { gap: 10px; }
  .monthly-summary { margin-left: 0; }
}
@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
  .content { padding: 16px; }
}
</style>