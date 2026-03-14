<template>
  <div class="layout">
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

    <div class="main-wrapper">
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
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

              <div v-if="notifLoading" class="notif-loading-row">
                <div class="notif-spinner"></div> Loading...
              </div>

              <div v-else-if="notifications.length === 0" class="notif-empty-row">
                No notifications
              </div>

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
            <div class="account-avatar"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item" @click="goTo('edit-account')">Edit Account</button>
              <button class="dropdown-item" @click="goTo('settings')">Settings</button>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item logout" @click="handleLogout">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <!-- ── TOAST ERROR ── -->
      <transition name="toast">
        <div class="toast-error" v-if="fetchError">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          <span>Cannot connect to server. Make sure the backend is running on port 8000.</span>
          <button class="toast-close" @click="fetchError = false">✕</button>
        </div>
      </transition>

      <!-- ACCESS DENIED -->
      <main class="content" v-if="!isAdmin && !doctorCan('view_patients')">
        <div class="access-denied-page">
          <div class="access-denied-icon"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
          <h2 class="access-denied-title">Access Restricted</h2>
          <p class="access-denied-text">You don't have permission to view Patients. Please contact your administrator.</p>
          <button class="btn-go-back" @click="$router.push('/dashboard')">← Go to Dashboard</button>
        </div>
      </main>

      <main class="content" v-else>
        <div class="page-header">
          <h1 class="page-title">All Patients</h1>
          <p class="breadcrumb">Patients / All Patients</p>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon blue"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
            <div><p class="stat-value">{{ patients.length }}</p><p class="stat-label">Total Patients</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg></div>
            <div><p class="stat-value">{{ newThisMonth }}</p><p class="stat-label">New This Month</p></div>
          </div>
        </div>

        <div class="table-card">
          <!-- ── TOOLBAR ── -->
          <div class="toolbar">
            <div class="toolbar-left">
              <div class="search-box">
                <input type="text" v-model="searchId" placeholder="Search ID" class="search-input" @input="currentPage = 1" />
                <button class="search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
              </div>
              <div class="search-box">
                <input type="text" v-model="searchName" placeholder="Search Name" class="search-input" @input="currentPage = 1" />
                <button class="search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
              </div>
            </div>

            <div class="toolbar-right">
              <!-- ── DATE FILTER BUTTON ── -->
              <div class="filter-wrap" v-click-outside="() => filterOpen = false">
                <button class="outline-btn" :class="{ 'filter-active': dateFrom || dateTo }" @click="filterOpen = !filterOpen">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Filter Date
                  <span v-if="dateFrom || dateTo" class="filter-dot"></span>
                </button>
                <div class="filter-dropdown" v-show="filterOpen">
                  <p class="filter-title">Filter by Registration Date</p>
                  <div class="filter-row">
                    <label>From</label>
                    <input type="date" v-model="dateFrom" @change="currentPage = 1" class="filter-date-input" />
                  </div>
                  <div class="filter-row">
                    <label>To</label>
                    <input type="date" v-model="dateTo" @change="currentPage = 1" class="filter-date-input" />
                  </div>
                  <div class="filter-actions">
                    <button class="btn-clear-filter" @click="clearDateFilter">Clear</button>
                    <button class="btn-apply-filter" @click="filterOpen = false">Apply</button>
                  </div>
                </div>
              </div>

              <!-- ── PRINT BUTTON ── -->
              <button class="outline-btn" @click="printRecords" title="Print Records">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print
              </button>

              <!-- ── EXPORT BUTTON with dropdown ── -->
              <div class="export-wrap" v-click-outside="() => exportOpen = false">
                <button class="outline-btn" @click="exportOpen = !exportOpen">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Export
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="export-dropdown" v-show="exportOpen">
                  <button class="export-item" @click="exportExcel(); exportOpen = false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Export as Excel (.xlsx)
                  </button>
                  <button class="export-item" @click="exportCSV(); exportOpen = false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Export as CSV
                  </button>
                </div>
              </div>

              <!-- ── REFRESH ── -->
              <button class="teal-btn" @click="fetchAll" :disabled="loading">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="{ 'spin-icon': loading }"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Refresh
              </button>
            </div>
          </div>

          <!-- Active filter chips -->
          <div class="active-filters" v-if="dateFrom || dateTo">
            <span class="filter-chip">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ dateFrom || '…' }} → {{ dateTo || '…' }}
              <button class="chip-close" @click="clearDateFilter">✕</button>
            </span>
            <span class="filter-result-count">{{ filteredTotal }} result(s)</span>
          </div>

          <!-- TABLE -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading patients...</p>
          </div>

          <!-- SERVER ERROR STATE -->
          <div v-else-if="fetchError && patients.length === 0" class="error-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            <p class="error-state-title">Cannot connect to server</p>
            <p class="error-state-sub">Make sure your backend is running on <strong>https://carequeue-admin.com/api</strong></p>
            <button class="teal-btn" @click="fetchAll" style="margin-top:8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Try Again
            </button>
          </div>

          <table v-else class="patients-table" id="patients-print-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Mobile</th>
                <th>Appointed Doctor(s)</th>
                <th>Registered</th>
                <th class="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pagedPatients.length === 0">
                <td colspan="8" class="empty-row">
                  <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <p>No patients found.</p>
                  </div>
                </td>
              </tr>
              <tr v-for="patient in pagedPatients" :key="patient.id">
                <td><span class="id-badge">{{ patient.patient_id }}</span></td>
                <td class="name-cell">{{ patient.first_name }} {{ patient.middle_name || '' }} {{ patient.last_name }}</td>
                <td><span class="gender-badge" :class="(patient.gender || '').toLowerCase()">{{ patient.gender || '—' }}</span></td>
                <td>{{ patient.mobile || '—' }}</td>
                <td class="doctors-cell">
                  <template v-if="getDoctors(patient.id).length > 0">
                    <span v-for="(doc, i) in getDoctors(patient.id)" :key="i" class="doctor-tag">{{ doc }}</span>
                  </template>
                  <span v-else class="no-doctor">No appointment yet</span>
                </td>
                <td class="date-cell">{{ formatDate(patient.created_at) }}</td>
                <td class="no-print">
                  <div class="action-btns">
                    <button v-if="isAdmin || doctorCan('view_patient_profile')" class="btn-view" @click="viewPatient(patient)">View</button>
                    <button v-if="isAdmin" class="btn-deactivate" @click="deactivatePatient(patient)">Remove</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="pagination" v-if="totalPages > 1">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
            <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
          </div>
        </div>
      </main>
    </div>

    <!-- ── VIEW MODAL ── -->
    <div class="modal-overlay" v-if="viewingPatient" @click.self="viewingPatient = null">
      <div class="modal">
        <div class="modal-header">
          <h3>Patient Details</h3>
          <button class="modal-close" @click="viewingPatient = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-avatar-initials">
            <span>{{ initials(viewingPatient) }}</span>
          </div>
          <div class="modal-row"><span class="modal-label">Patient ID</span><span>{{ viewingPatient.patient_id }}</span></div>
          <div class="modal-row"><span class="modal-label">Name</span><span>{{ viewingPatient.first_name }} {{ viewingPatient.middle_name || '' }} {{ viewingPatient.last_name }}</span></div>
          <div class="modal-row"><span class="modal-label">Gender</span><span>{{ viewingPatient.gender || '—' }}</span></div>
          <div class="modal-row"><span class="modal-label">Date of Birth</span><span>{{ viewingPatient.date_of_birth || '—' }}</span></div>
          <div class="modal-row"><span class="modal-label">Age</span><span>{{ viewingPatient.age || '—' }}</span></div>
          <div class="modal-row"><span class="modal-label">Mobile</span><span>{{ viewingPatient.mobile || '—' }}</span></div>
          <div class="modal-row"><span class="modal-label">Religion</span><span>{{ viewingPatient.religion || '—' }}</span></div>
          <div class="modal-row"><span class="modal-label">Registered</span><span>{{ formatDate(viewingPatient.created_at) }}</span></div>
          <div class="modal-section-title">Appointment History</div>
          <div v-if="getAppointments(viewingPatient.id).length === 0" class="modal-no-appt">No appointments found.</div>
          <div v-else class="appt-list">
            <div v-for="appt in getAppointments(viewingPatient.id)" :key="appt.id" class="appt-item">
              <div class="appt-left">
                <span class="appt-date">{{ formatDate(appt.appointment_date) }}</span>
                <span class="appt-time">{{ formatTime(appt.appointment_time) }}</span>
              </div>
              <div class="appt-center">
                <span class="appt-doctor">{{ appt.doctor || '—' }}</span>
                <span class="appt-condition">{{ appt.condition_notes || 'No notes' }}</span>
              </div>
              <span class="appt-status" :class="appt.status">{{ appt.status }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-view" @click="viewingPatient = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API = 'https://carequeue-admin.com/api'

export default {
  name: 'Patients',
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
    return {
      sidebarCollapsed: false,
      notifOpen: false,
      doctors: [],
      notifLoading: false,
      notifications: [],
      unreadCount: 0,
      notifCompose: false,
      notifForm: { target: '', title: '', body: '' },
      accountOpen: false,
      appointmentsOpen: false,
      searchId: '',
      searchName: '',
      currentPage: 1,
      perPage: 11,
      viewingPatient: null,
      patients: [],
      appointments: [],
      loading: false,
      fetchError: false,                                                         // ← NEW: tracks connection errors
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),
      dateFrom: '',
      dateTo: '',
      filterOpen: false,
      exportOpen: false,
    }
  },
  computed: {
    isAdmin() { return localStorage.getItem('role') === 'admin' },
    filteredList() {
      let list = this.patients
      if (this.searchId)
        list = list.filter(p => (p.patient_id || '').toLowerCase().includes(this.searchId.toLowerCase()))
      if (this.searchName)
        list = list.filter(p => `${p.first_name} ${p.last_name}`.toLowerCase().includes(this.searchName.toLowerCase()))
      if (this.dateFrom)
        list = list.filter(p => p.created_at && p.created_at.slice(0, 10) >= this.dateFrom)
      if (this.dateTo)
        list = list.filter(p => p.created_at && p.created_at.slice(0, 10) <= this.dateTo)
      return list
    },
    filteredTotal() { return this.filteredList.length },
    pagedPatients() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredList.slice(start, start + this.perPage)
    },
    totalPages() { return Math.max(1, Math.ceil(this.filteredList.length / this.perPage)) },
    newThisMonth() {
      const now = new Date()
      return this.patients.filter(p => {
        const d = new Date(p.created_at)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length
    }
  },
  beforeUnmount() {
    clearInterval(this._notifPoll)
  },

  mounted() {
    this.fetchAll()
    this.fetchNotifications()
    fetch('https://carequeue-admin.com/api/doctors').then(r=>r.json()).then(d=>{this.doctors=d}).catch(()=>{})
    this._notifPoll = setInterval(() => this.fetchNotifications(), 30000)
  },
  methods: {

    async fetchNotifications() {
      this.notifLoading = true
      try {
        const role = localStorage.getItem('role')
        const user = JSON.parse(localStorage.getItem('user')) || {}
        let url = `https://carequeue-admin.com/api/notifications?role=${role}`
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
      await fetch('https://carequeue-admin.com/api/notifications/mark-read', {
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
      await fetch('https://carequeue-admin.com/api/notifications', {
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

    async fetchAll() {
      this.loading = true
      this.fetchError = false
      try {
        const role = localStorage.getItem('role')
        const user = JSON.parse(localStorage.getItem('user')) || {}
        // Send full name as-is (e.g. "Dr. Emill Rodriguez") — matches what's stored in appointments.doctor
        const doctorParam = role !== 'admin' && user.name
          ? `?doctor=${encodeURIComponent(user.name)}`
          : ''
        const [pRes, aRes] = await Promise.all([
          fetch(`${API}/patients${doctorParam}`),
          fetch(`${API}/appointments${doctorParam}`)
        ])
        if (!pRes.ok || !aRes.ok) throw new Error('Bad response from server')   // ← HANDLE non-200 responses
        this.patients     = await pRes.json()
        this.appointments = await aRes.json()
      } catch (err) {
        console.error('Fetch error:', err)
        this.fetchError = true                                                   // ← SET error flag (no alert!)
        // Auto-hide toast after 6 seconds
        setTimeout(() => { this.fetchError = false }, 6000)
      } finally {
        this.loading = false                                                     // ← ALWAYS stop spinner
      }
    },

    appointmentBelongsTo(appt, patient) {
      if (appt.patient_id && String(appt.patient_id) === String(patient.id)) return true
      const apptFirst  = (appt.first_name   || '').trim().toLowerCase()
      const apptLast   = (appt.last_name    || '').trim().toLowerCase()
      const ptFirst    = (patient.first_name || '').trim().toLowerCase()
      const ptLast     = (patient.last_name  || '').trim().toLowerCase()
      const apptMobile = (appt.mobile    || '').replace(/\D/g, '')
      const ptMobile   = (patient.mobile || '').replace(/\D/g, '')
      if (apptFirst && apptLast && ptFirst && ptLast) {
        if (apptFirst === ptFirst && apptLast === ptLast) return true
      }
      if (apptMobile.length >= 10 && ptMobile.length >= 10 && apptMobile === ptMobile) return true
      return false
    },

    getDoctors(patientId) {
      const patient = this.patients.find(p => p.id === patientId)
      if (!patient) return []
      const matched = this.appointments.filter(a =>
        this.appointmentBelongsTo(a, patient) && a.doctor
      )
      return [...new Set(matched.map(a => a.doctor))]
    },

    getAppointments(patientId) {
      const patient = this.patients.find(p => p.id === patientId)
      if (!patient) return []
      return this.appointments
        .filter(a => this.appointmentBelongsTo(a, patient))
        .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    },

    initials(patient) {
      return `${(patient.first_name || '')[0] || ''}${(patient.last_name || '')[0] || ''}`.toUpperCase()
    },

    goTo(page) {
      this.accountOpen = false
      if (page === 'edit-account') this.$router.push('/edit-profile')
      if (page === 'settings') alert('Settings coming soon')
    },
    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    },

    viewPatient(patient) { this.viewingPatient = patient },

    deactivatePatient(patient) {
      if (!confirm(`Remove patient ${patient.first_name} ${patient.last_name}?`)) return
      this.patients = this.patients.filter(p => p.id !== patient.id)
    },

    clearDateFilter() {
      this.dateFrom = ''
      this.dateTo = ''
      this.currentPage = 1
      this.filterOpen = false
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    formatTime(timeStr) {
      if (!timeStr) return '—'
      const [h, m] = timeStr.split(':')
      const hour = parseInt(h)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      return `${hour % 12 || 12}:${m} ${ampm}`
    },

    printRecords() {
      const dateRange = (this.dateFrom || this.dateTo)
        ? `Registration: ${this.dateFrom || '…'} to ${this.dateTo || '…'}`
        : 'All dates'
      const rows = this.filteredList.map(p => {
        const docs = this.getDoctors(p.id)
        return `<tr>
          <td>${p.patient_id || ''}</td>
          <td>${p.first_name} ${p.middle_name || ''} ${p.last_name}</td>
          <td>${p.gender || '—'}</td>
          <td>${p.mobile || '—'}</td>
          <td>${docs.length ? docs.join(', ') : '—'}</td>
          <td>${this.formatDate(p.created_at)}</td>
        </tr>`
      }).join('')
      const win = window.open('', '_blank')
      win.document.write(`
        <!DOCTYPE html><html><head>
        <title>Patient Records</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 32px; color: #1e293b; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #1b2540; color: white; padding: 9px 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
          td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) td { background: #f8fafc; }
          @media print { body { padding: 0; } }
        </style>
        </head><body>
        <h1>Patient Records</h1>
        <p class="meta">Printed: ${new Date().toLocaleString()} &nbsp;|&nbsp; Filter: ${dateRange} &nbsp;|&nbsp; Total: ${this.filteredList.length}</p>
        <table>
          <thead><tr><th>Patient ID</th><th>Name</th><th>Gender</th><th>Mobile</th><th>Appointed Doctor(s)</th><th>Registered</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        </body></html>`)
      win.document.close()
      win.focus()
      setTimeout(() => win.print(), 400)
    },

    exportExcel() {
      const headers = ['Patient ID', 'Last Name', 'First Name', 'Middle Name', 'Gender', 'Mobile', 'Appointed Doctor(s)', 'Registered Date']
      const rows = this.filteredList.map(p => {
        const docs = this.getDoctors(p.id).join('; ')
        return [
          p.patient_id, p.last_name, p.first_name, p.middle_name || '',
          p.gender || '', p.mobile || '', docs || '', this.formatDate(p.created_at)
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
      })
      const csv = [headers.join(','), ...rows].join('\n')
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csv], { type: 'application/vnd.ms-excel;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `patients_${new Date().toISOString().slice(0,10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    },

    exportCSV() {
      const headers = ['Patient ID', 'Last Name', 'First Name', 'Middle Name', 'Gender', 'Mobile', 'Appointed Doctor(s)', 'Registered Date']
      const rows = this.filteredList.map(p => {
        const docs = this.getDoctors(p.id).join('; ')
        return [
          p.patient_id, p.last_name, p.first_name, p.middle_name || '',
          p.gender || '', p.mobile || '', docs || '', this.formatDate(p.created_at)
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
      })
      const csv = [headers.join(','), ...rows].join('\n')
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `patients_${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
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
.sidebar-logo-img { width: 60%; height: 60%; border-radius: 10px; object-fit: cover; background: white; padding: 2px; transition: width 0.3s ease, height 0.3s ease; }
.sidebar.collapsed .sidebar-logo-img { margin-top: 5px; margin-bottom: 5px; width: 40px; height: 40px; }
.sidebar-nav { padding: 12px 0; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; color: #94a3b8; text-decoration: none; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; white-space: nowrap; }
.nav-item:hover { color: white; background: rgba(255,255,255,0.06); }
.nav-item.active { color: white; background: rgba(58,166,166,0.15); border-left-color: #3aa6a6; }
.nav-icon { flex-shrink: 0; display: flex; }
.nav-arrow { margin-left: auto; transition: transform 0.3s; }
.nav-dropdown.open .nav-arrow { transform: rotate(180deg); }
.nav-sub { padding-left: 46px; background: rgba(0,0,0,0.15); }
.nav-sub-item { display: block; padding: 9px 12px; color: #94a3b8; text-decoration: none; font-size: 13px; transition: color 0.2s; white-space: nowrap; }
.nav-sub-item:hover, .nav-sub-item.active { color: #3aa6a6; }
.role-tag { display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #3aa6a6; font-size: 12px; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.06); margin-top: auto; }

/* ── TOPBAR ── */
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; transition: background 0.2s; }
.hamburger:hover { background: rgba(255,255,255,0.15); }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.topbar-btn { position: relative; background: none; border: none; cursor: pointer; color: #ffffff; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
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
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: white; transition: background 0.2s; }
.account-wrapper:hover .account-avatar { background: rgba(255,255,255,0.35); }
.account-dropdown { width: 230px; }
.account-info { flex-direction: column; align-items: flex-start !important; gap: 3px; }
.account-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.account-email { font-size: 11px; color: #94a3b8; }
.role-pill { margin-top: 4px; font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
.role-pill.admin { background: #dbeafe; color: #1d4ed8; }
.role-pill.doctor { background: #d1fae5; color: #065f46; }
.dropdown-divider { border: none; border-top: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.dropdown-item:hover { background: #f8fafc; color: #1e293b; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-item.logout:hover { background: #fff5f5; }

/* ── TOAST ERROR ── */
.toast-error { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); background: #1e293b; color: white; padding: 12px 20px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; z-index: 999; box-shadow: 0 8px 30px rgba(0,0,0,0.2); max-width: 520px; width: calc(100% - 48px); border-left: 4px solid #ef4444; }
.toast-close { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 14px; margin-left: auto; padding: 0 4px; line-height: 1; }
.toast-close:hover { color: white; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-12px); }

/* ── ERROR STATE ── */
.error-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 60px 20px; color: #f87171; text-align: center; }
.error-state-title { font-size: 16px; font-weight: 700; color: #dc2626; }
.error-state-sub { font-size: 13px; color: #64748b; }

/* ACCESS DENIED */
.access-denied-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; text-align: center; padding: 40px; }
.access-denied-icon { width: 100px; height: 100px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #dc2626; }
.access-denied-title { font-size: 24px; font-weight: 700; color: #1e293b; }
.access-denied-text { font-size: 14px; color: #64748b; max-width: 400px; line-height: 1.7; }
.btn-go-back { padding: 11px 28px; background: #3aa6a6; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-go-back:hover { background: #2e8b8b; }

/* ── CONTENT ── */
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }

/* STATS */
.stats-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.stat-card { background: white; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); flex: 1; min-width: 150px; }
.stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.blue { background: #dbeafe; color: #2563eb; }
.stat-icon.green { background: #dcfce7; color: #16a34a; }
.stat-value { font-size: 22px; font-weight: 700; color: #1e293b; }
.stat-label { font-size: 12px; color: #94a3b8; }

/* TABLE CARD */
.table-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

/* ── TOOLBAR ── */
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
.toolbar-left { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.toolbar-right { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.search-box { display: flex; align-items: center; border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden; transition: border-color 0.2s; }
.search-box:focus-within { border-color: #3aa6a6; }
.search-input { padding: 8px 12px; border: none; outline: none; font-size: 13px; color: #475569; font-family: inherit; width: 160px; }
.search-btn { padding: 8px 12px; background: #3aa6a6; border: none; cursor: pointer; color: white; display: flex; align-items: center; }
.teal-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; white-space: nowrap; }
.teal-btn:hover:not(:disabled) { background: #2e8b8b; }
.teal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.outline-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: white; color: #475569; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap; position: relative; }
.outline-btn:hover { border-color: #3aa6a6; color: #3aa6a6; background: #f0fafa; }
.outline-btn.filter-active { border-color: #3aa6a6; color: #3aa6a6; background: #f0fafa; }
.filter-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: #3aa6a6; border-radius: 50%; border: 1.5px solid white; }

/* Spin animation for refresh icon */
.spin-icon { animation: spin 0.8s linear infinite; }

/* ── DATE FILTER DROPDOWN ── */
.filter-wrap { position: relative; }
.filter-dropdown { position: absolute; top: calc(100% + 8px); left: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; padding: 16px; min-width: 240px; animation: fadeDown 0.15s ease; }
.filter-title { font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.filter-row label { font-size: 12px; font-weight: 600; color: #64748b; width: 32px; flex-shrink: 0; }
.filter-date-input { flex: 1; padding: 7px 10px; border: 1.5px solid #e2e8f0; border-radius: 7px; font-size: 12.5px; color: #475569; font-family: inherit; outline: none; }
.filter-date-input:focus { border-color: #3aa6a6; }
.filter-actions { display: flex; gap: 8px; margin-top: 14px; }
.btn-clear-filter { flex: 1; padding: 8px; border: 1.5px solid #e2e8f0; background: white; border-radius: 7px; font-size: 12.5px; font-weight: 600; color: #64748b; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-clear-filter:hover { border-color: #ef4444; color: #ef4444; }
.btn-apply-filter { flex: 1; padding: 8px; background: #3aa6a6; color: white; border: none; border-radius: 7px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-apply-filter:hover { background: #2e8b8b; }

/* Active filter chips */
.active-filters { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.filter-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; background: #f0fafa; border: 1.5px solid #3aa6a6; color: #0f766e; border-radius: 20px; font-size: 12px; font-weight: 600; }
.chip-close { background: none; border: none; cursor: pointer; color: #0f766e; font-size: 12px; line-height: 1; padding: 0; margin-left: 2px; opacity: 0.7; }
.chip-close:hover { opacity: 1; }
.filter-result-count { font-size: 12px; color: #94a3b8; font-weight: 500; }

/* ── EXPORT DROPDOWN ── */
.export-wrap { position: relative; }
.export-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; min-width: 200px; animation: fadeDown 0.15s ease; }
.export-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.export-item:hover { background: #f0fafa; color: #3aa6a6; }

/* ── TABLE ── */
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #94a3b8; }
.spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.patients-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.patients-table th { text-align: left; padding: 10px 16px; color: #64748b; font-weight: 600; font-size: 13px; border-bottom: 2px solid #f1f5f9; }
.patients-table td { padding: 11px 16px; color: #475569; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.patients-table tr:last-child td { border-bottom: none; }
.patients-table tr:hover td { background: #f8fafc; }
.id-badge { background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #475569; }
.name-cell { font-weight: 600; color: #1e293b; }
.gender-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.gender-badge.male { background: #dbeafe; color: #1e40af; }
.gender-badge.female { background: #fce7f3; color: #9d174d; }
.date-cell { color: #94a3b8; font-size: 12px; white-space: nowrap; }
.doctors-cell { max-width: 200px; }
.doctor-tag { display: inline-block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 12px; font-size: 11px; font-weight: 600; padding: 2px 8px; margin: 2px 2px 2px 0; white-space: nowrap; }
.no-doctor { color: #cbd5e1; font-size: 13px; }
.action-btns { display: flex; gap: 8px; }
.btn-view { padding: 5px 14px; background: white; color: #3aa6a6; border: 1.5px solid #3aa6a6; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-view:hover { background: #3aa6a6; color: white; }
.btn-deactivate { padding: 5px 14px; background: white; color: #ef4444; border: 1.5px solid #ef4444; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-deactivate:hover { background: #ef4444; color: white; }
.empty-row { text-align: center; padding: 60px 0; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; color: #94a3b8; }
.empty-state p { font-size: 14px; }

/* ── PAGINATION ── */
.pagination { display: flex; justify-content: center; gap: 6px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
.page-btn { padding: 6px 12px; border: 1.5px solid #e2e8f0; background: white; border-radius: 6px; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.page-btn:hover:not(:disabled) { border-color: #3aa6a6; color: #3aa6a6; }
.page-btn.active { background: #3aa6a6; color: white; border-color: #3aa6a6; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 500; }
.modal { background: white; border-radius: 16px; width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; background: white; z-index: 1; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-close { background: none; border: none; font-size: 16px; color: #94a3b8; cursor: pointer; }
.modal-close:hover { color: #1e293b; }
.modal-avatar-initials { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #3aa6a6, #1b2540); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; margin: 0 auto 16px; letter-spacing: 1px; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
.modal-row { display: flex; justify-content: space-between; font-size: 13px; color: #475569; gap: 12px; }
.modal-label { font-weight: 600; color: #1e293b; white-space: nowrap; }
.modal-section-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #f1f5f9; padding-top: 14px; margin-top: 4px; }
.modal-no-appt { font-size: 13px; color: #94a3b8; text-align: center; padding: 16px 0; }
.appt-list { display: flex; flex-direction: column; gap: 8px; }
.appt-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1.5px solid #f1f5f9; border-radius: 10px; background: #f8fafc; }
.appt-left { display: flex; flex-direction: column; gap: 2px; min-width: 90px; }
.appt-date { font-size: 12px; font-weight: 600; color: #1e293b; }
.appt-time { font-size: 11px; color: #94a3b8; }
.appt-center { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.appt-doctor { font-size: 12.5px; font-weight: 600; color: #0f766e; }
.appt-condition { font-size: 11px; color: #64748b; }
.appt-status { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; white-space: nowrap; text-transform: capitalize; }
.appt-status.waiting   { background: #fef9c3; color: #854d0e; }
.appt-status.approved  { background: #dcfce7; color: #166534; }
.appt-status.completed { background: #dbeafe; color: #1e40af; }
.appt-status.cancelled { background: #fee2e2; color: #991b1b; }
.appt-status.arrived   { background: #f3e8ff; color: #6b21a8; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; position: sticky; bottom: 0; background: white; }

/* ── PRINT STYLES ── */
@media print {
  .no-print { display: none !important; }
}
</style>
