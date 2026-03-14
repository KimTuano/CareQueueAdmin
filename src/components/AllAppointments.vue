<template>
  <div class="layout">

    <!-- ── NOTIFY MODAL (Approve / Cancel) ── -->
    <div class="modal-overlay" v-if="notifyModal.show" @click.self="notifyModal.show = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-header-icon" :class="notifyModal.type">
            <svg v-if="notifyModal.type === 'approve'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="modal-header-text">
            <h3>{{ notifyModal.type === 'approve' ? 'Appointment Approved' : 'Appointment Cancelled' }}</h3>
            <p class="modal-subtitle">
              {{ notifyModal.type === 'approve' ? 'Approved for' : 'Cancelled for' }}
              <strong>{{ notifyModal.patientName }}</strong>
            </p>
          </div>
          <button class="modal-close" @click="notifyModal.show = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Push notification sent confirmation — approve only -->
          <div class="notif-sent-box" v-if="notifyModal.type === 'approve'">
            <div class="notif-sent-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </div>
            <div>
              <p class="notif-sent-title">Push notification sent!</p>
              <p class="notif-sent-sub">The patient's mobile app has been notified of their approved appointment.</p>
            </div>
          </div>

          <div class="modal-divider-label">Would you also like to notify via SMS or Email?</div>

          <div class="notify-options">
            <div class="notify-option" @click="goToSmsBlast" role="button">
              <div class="notify-option-icon sms">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              </div>
              <div class="notify-option-body">
                <p class="notify-option-title">Send via SMS</p>
                <p class="notify-option-desc">Go to SMS Blast to send a text message notification to the patient.</p>
              </div>
              <svg class="notify-option-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>

            <div class="notify-option" @click="goToSmsBlast" role="button">
              <div class="notify-option-icon email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div class="notify-option-body">
                <p class="notify-option-title">Send via Email</p>
                <p class="notify-option-desc">Go to SMS Blast to send an email notification to the patient.</p>
              </div>
              <svg class="notify-option-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-skip" @click="notifyModal.show = false">Skip for now</button>
        </div>
      </div>
    </div>

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
            <div class="account-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="dropdown account-dropdown" v-show="accountOpen" @click.stop>
              <div class="dropdown-header account-info">
                <p class="account-name">{{ currentUser.name }}</p>
                <p class="account-email">{{ currentUser.email }}</p>
                <span class="role-pill" :class="isAdmin ? 'admin' : 'doctor'">{{ isAdmin ? 'Admin' : 'Doctor' }}</span>
              </div>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item" @click="goTo('edit-account')">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Edit Account
              </button>
              <button class="dropdown-item" @click="goTo('settings')">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Settings
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
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="access-denied-title">Access Restricted</h2>
          <p class="access-denied-msg">You don't have permission to view All Appointments. Please contact your administrator to request access.</p>
        </div>
      </main>

      <!-- ── PAGE CONTENT ── -->
      <main v-else class="content">
        <div class="page-header">
          <h1 class="page-title">All Appointments</h1>
          <p class="breadcrumb">Appointments / All Appointments</p>
        </div>

        <div class="table-card">
          <div v-if="loadingAppointments" class="state-box">
            <div class="spinner"></div>
            <p>Loading appointments…</p>
          </div>
          <div v-else-if="fetchError" class="state-box error-box">
            <p>⚠️ {{ fetchError }}</p>
            <button class="retry-btn" @click="fetchAppointments">Retry</button>
          </div>

          <template v-else>
            <div class="toolbar">
              <div class="toolbar-left">
                <div class="search-box">
                  <input type="text" v-model="searchId" placeholder="Search ID" class="search-input" />
                  <button class="search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
                </div>
                <div class="search-box">
                  <input type="text" v-model="searchName" placeholder="Search Name" class="search-input" />
                  <button class="search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
                </div>
              </div>
              <button class="refresh-btn" @click="fetchAppointments" title="Refresh">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Refresh
              </button>
            </div>

            <table class="records-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Name</th>
                  <th>Doctor</th>
                  <th>Mobile</th>
                  <th>Date &amp; Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appt in filteredAppointments" :key="appt.id">
                  <td>{{ appt.appointment_id }}</td>
                  <td>{{ appt.first_name }} {{ appt.last_name }}</td>
                  <td>{{ appt.doctor || '—' }}</td>
                  <td>{{ appt.mobile || '—' }}</td>
                  <td class="date-cell">
                    {{ formatDate(appt.appointment_date) }}
                    <span v-if="appt.appointment_time"> · {{ formatTime(appt.appointment_time) }}</span>
                  </td>
                  <td>
                    <span class="status-badge" :class="appt.status">{{ appt.status }}</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <template v-if="isAdmin || doctorCan('manage_appointments')">
                        <!--
                          ✅ APPROVE
                          - Updates status → 'approved'
                          - Fires push notification to patient's mobile app
                          - Opens modal: "send SMS/Email?" → goes to SMS Blast
                        -->
                        <button class="btn-approve" @click="approveAppt(appt)">Approve</button>
                        <!--
                          ❌ CANCEL
                          - Updates status → 'cancelled'
                          - Opens modal: "send SMS/Email?" → goes to SMS Blast
                        -->
                        <button class="btn-cancel" @click="cancelAppt(appt)">Cancel</button>
                      </template>
                      <span v-else class="badge-view-only">View Only</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredAppointments.length === 0">
                  <td colspan="7" class="empty-row">No appointments found.</td>
                </tr>
              </tbody>
            </table>

            <div class="pagination">
              <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
              <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
            </div>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://${import.meta.env.VITE_API_BASE}'

export default {
  name: 'AllAppointments',
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
      appointmentsOpen: true,
      searchId: '',
      searchName: '',
      currentPage: 1,
      perPage: 11,

      appointments: [],
      loadingAppointments: false,
      fetchError: null,

      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),

      // ── Notification modal ─────────────────────────────────
      notifyModal: {
        show: false,
        type: 'approve',      // 'approve' | 'cancel'
        patientName: '',
      },
    }
  },

  computed: {
    isAdmin() { return localStorage.getItem('role') === 'admin' },
    canAccess() { return this.isAdmin || this.doctorCan('view_appointments') },
    filtered() {
      let list = this.appointments
      if (this.searchId)   list = list.filter(a => String(a.appointment_id ?? a.id).toLowerCase().includes(this.searchId.toLowerCase()))
      if (this.searchName) list = list.filter(a => `${a.first_name} ${a.last_name}`.toLowerCase().includes(this.searchName.toLowerCase()))
      return list
    },
    filteredAppointments() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filtered.slice(start, start + this.perPage)
    },
    totalPages() { return Math.max(1, Math.ceil(this.filtered.length / this.perPage)) }
  },

  beforeUnmount() {
    clearInterval(this._notifPoll)
  },

  mounted() {
    if (this.canAccess) this.fetchAppointments()
    this.fetchNotifications()
    this._notifPoll = setInterval(() => this.fetchNotifications(), 30000)
    fetch('http://${import.meta.env.VITE_API_BASE}/doctors').then(r => r.json()).then(d => { this.doctors = d }).catch(() => {})
  },

  methods: {

    async fetchNotifications() {
      this.notifLoading = true
      try {
        const role = localStorage.getItem('role')
        const user = JSON.parse(localStorage.getItem('user')) || {}
        let url = `http://${import.meta.env.VITE_API_BASE}/notifications?role=${role}`
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
      await fetch('http://${import.meta.env.VITE_API_BASE}/notifications/mark-read', {
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
      await fetch('http://${import.meta.env.VITE_API_BASE}/notifications', {
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

    // ── FETCH ─────────────────────────────────────────────────
    async fetchAppointments() {
      this.loadingAppointments = true
      this.fetchError = null
      try {
        const role = localStorage.getItem('role')
        const user = JSON.parse(localStorage.getItem('user')) || {}
        const doctorParam = role !== 'admin' && user.name
          ? `?doctor=${encodeURIComponent(user.name.replace(/^Dr\.\s*/i, ''))}`
          : ''
        const res = await fetch(`${API_BASE}/appointments${doctorParam}`)
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        this.appointments = await res.json()
      } catch (err) {
        this.fetchError = err.message || 'Could not load appointments.'
      } finally {
        this.loadingAppointments = false
      }
    },

    // ── APPROVE ───────────────────────────────────────────────
    // 1. Updates status → 'approved'
    // 2. Sends push notification to patient mobile app
    // 3. Opens modal offering to also send SMS / Email via SMS Blast
    async approveAppt(appt) {
      try {
        const res = await fetch(`${API_BASE}/appointments/${appt.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' })
        })
        if (!res.ok) throw new Error('Failed to approve appointment')
        appt.status = 'approved'

        // Fire push notification (best-effort, non-blocking)
        await this.sendPushNotification(appt)

        // Show notification modal
        this.notifyModal = {
          show: true,
          type: 'approve',
          patientName: `${appt.first_name} ${appt.last_name}`,
        }
      } catch (err) {
        alert('Error: ' + err.message)
      }
    },

    // ── CANCEL ────────────────────────────────────────────────
    // 1. Updates status → 'cancelled'
    // 2. Opens modal offering to send SMS / Email via SMS Blast
    async cancelAppt(appt) {
      if (!confirm(`Cancel appointment for ${appt.first_name} ${appt.last_name}?`)) return
      try {
        const res = await fetch(`${API_BASE}/appointments/${appt.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled' })
        })
        if (!res.ok) throw new Error('Failed to cancel')
        appt.status = 'cancelled'

        // Show notification modal
        this.notifyModal = {
          show: true,
          type: 'cancel',
          patientName: `${appt.first_name} ${appt.last_name}`,
        }
      } catch (err) {
        alert('Error: ' + err.message)
      }
    },

    // ── PUSH NOTIFICATION → patient mobile app ────────────────
    // Calls your backend which should relay to Expo / FCM / APNs
    async sendPushNotification(appt) {
      try {
        await fetch(`${API_BASE}/notifications/push`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patient_id:     appt.patient_id ?? appt.id,
            title:          'Appointment Confirmed ✅',
            body:           `Dear ${appt.first_name}, your appointment on ${this.formatDate(appt.appointment_date)}` +
                            `${appt.appointment_time ? ' at ' + this.formatTime(appt.appointment_time) : ''}` +
                            ` with ${appt.doctor || 'your doctor'} has been approved.`,
            type:           'appointment_approved',
            appointment_id: appt.id,
          })
        })
      } catch (err) {
        // Non-critical — push notification failure should not block the UI
        console.warn('Push notification failed (non-critical):', err)
      }
    },

    // ── REDIRECT TO SMS BLAST ─────────────────────────────────
    goToSmsBlast() {
      this.notifyModal.show = false
      this.$router.push('/sms-blast')
    },

    // ── FORMAT helpers ────────────────────────────────────────
    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const [h, m] = timeStr.split(':').map(Number)
      const period = h >= 12 ? 'PM' : 'AM'
      const hour = h % 12 || 12
      return `${hour}:${String(m).padStart(2, '0')} ${period}`
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
.sidebar.collapsed .sidebar-logo-text, .sidebar.collapsed .nav-label, .sidebar.collapsed .nav-arrow, .sidebar.collapsed .nav-sub { display: none; }
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
.role-tag { display: flex; align-items: center; gap: 8px; padding: 10px 16px; color: #64748b; font-size: 12px; font-weight: 500; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); }

/* ── MAIN ── */
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #ffffff; display: flex; padding: 6px; border-radius: 8px; transition: background 0.2s; }
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
.account-wrapper { position: relative; cursor: pointer; }
.account-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: white; transition: background 0.2s; }
.account-wrapper:hover .account-avatar { background: rgba(255,255,255,0.35); }
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
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }

.table-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.toolbar-left { display: flex; gap: 12px; }
.search-box { display: flex; align-items: center; border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.search-box:focus-within { border-color: #3aa6a6; }
.search-input { padding: 8px 12px; border: none; outline: none; font-size: 13px; color: #475569; font-family: inherit; width: 160px; }
.search-btn { padding: 8px 12px; background: #3aa6a6; border: none; cursor: pointer; color: white; display: flex; align-items: center; }
.search-btn:hover { background: #2e8b8b; }
.refresh-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.refresh-btn:hover { background: #3aa6a6; color: white; border-color: #3aa6a6; }
.state-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; color: #94a3b8; font-size: 14px; }
.error-box { color: #ef4444; }
.spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.retry-btn { padding: 8px 20px; background: #3aa6a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 13px; }

/* ── TABLE ── */
.records-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.records-table th { text-align: left; padding: 10px 16px; color: #64748b; font-weight: 600; font-size: 13px; border-bottom: 2px solid #f1f5f9; }
.records-table td { padding: 11px 16px; color: #475569; border-bottom: 1px solid #f8fafc; }
.records-table tr:hover td { background: #f8fafc; }
.date-cell { color: #475569; }

.status-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
.status-badge.waiting    { background: #fef9c3; color: #854d0e; }
.status-badge.approved   { background: #dcfce7; color: #166534; }
.status-badge.arrived    { background: #dbeafe; color: #1e40af; }
.status-badge.cancelled  { background: #fee2e2; color: #991b1b; }
.status-badge.completed  { background: #f3f4f6; color: #374151; }

/* Action buttons — "Arrive" removed per spec */
.action-btns { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.btn-approve { padding: 5px 12px; background: white; color: #16a34a; border: 1.5px solid #16a34a; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-approve:hover { background: #16a34a; color: white; }
.btn-cancel  { padding: 5px 12px; background: white; color: #ef4444; border: 1.5px solid #ef4444; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-cancel:hover  { background: #ef4444; color: white; }
.badge-view-only { display: inline-block; padding: 4px 12px; background: #f1f5f9; color: #94a3b8; border-radius: 6px; font-size: 11px; font-weight: 600; }

.empty-row { text-align: center; color: #94a3b8; padding: 60px; font-size: 14px; }

.pagination { display: flex; justify-content: center; gap: 6px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
.page-btn { padding: 6px 12px; border: 1.5px solid #e2e8f0; background: white; border-radius: 6px; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.page-btn:hover:not(:disabled) { border-color: #3aa6a6; color: #3aa6a6; }
.page-btn.active { background: #3aa6a6; color: white; border-color: #3aa6a6; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── NOTIFY MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; animation: bgFadeIn 0.15s ease; }
@keyframes bgFadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal { background: white; border-radius: 18px; width: 460px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.2); overflow: hidden; animation: slideUp 0.2s ease; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Modal header */
.modal-header { display: flex; align-items: flex-start; gap: 14px; padding: 22px 22px 18px; border-bottom: 1px solid #f1f5f9; }
.modal-header-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-header-icon.approve { background: #dcfce7; color: #16a34a; }
.modal-header-icon.cancel  { background: #fee2e2; color: #ef4444; }
.modal-header-text { flex: 1; }
.modal-header-text h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-subtitle { font-size: 13px; color: #64748b; margin-top: 3px; }
.modal-close { background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; padding: 4px; border-radius: 6px; transition: all 0.15s; flex-shrink: 0; }
.modal-close:hover { color: #1e293b; background: #f1f5f9; }

/* Modal body */
.modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }

/* Push notif sent confirmation badge */
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

/* Divider label */
.modal-divider-label { font-size: 11.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; text-align: center; position: relative; }
.modal-divider-label::before, .modal-divider-label::after { content: ''; position: absolute; top: 50%; width: 30%; height: 1px; background: #e2e8f0; }
.modal-divider-label::before { left: 0; }
.modal-divider-label::after  { right: 0; }

/* Notify options */
.notify-options { display: flex; flex-direction: column; gap: 10px; }
.notify-option { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1.5px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.notify-option:hover { border-color: #3aa6a6; background: #f0fafa; }
.notify-option-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.notify-option-icon.sms   { background: #eff6ff; color: #2563eb; }
.notify-option-icon.email { background: #fff7ed; color: #ea580c; }
.notify-option-body { flex: 1; }
.notify-option-title { font-size: 13px; font-weight: 600; color: #1e293b; }
.notify-option-desc  { font-size: 12px; color: #64748b; margin-top: 2px; line-height: 1.4; }
.notify-option-arrow { color: #94a3b8; flex-shrink: 0; transition: transform 0.2s, color 0.2s; }
.notify-option:hover .notify-option-arrow { transform: translateX(3px); color: #3aa6a6; }

/* Modal footer */
.modal-footer { padding: 14px 22px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }
.btn-skip { padding: 9px 22px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-skip:hover { background: #e2e8f0; }
</style>