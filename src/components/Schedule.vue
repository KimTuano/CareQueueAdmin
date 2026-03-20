<template>
  <div class="layout">

    <!-- ── NOTIFY DOCTOR MODAL (Admin only) ── -->
    <div class="modal-overlay" v-if="notifyModal.show" @click.self="notifyModal.show = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-header-icon notify-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>
          <div class="modal-header-text">
            <h3>Notify Doctor</h3>
            <p class="modal-subtitle">
              Send a reminder to <strong>{{ notifyModal.doctorName }}</strong>
              for their appointment on <strong>{{ notifyModal.date }}</strong>
            </p>
          </div>
          <button class="modal-close" @click="notifyModal.show = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="notif-appt-box">
            <div class="notif-appt-row"><span class="notif-appt-label">Patient</span><span class="notif-appt-val">{{ notifyModal.patientName }}</span></div>
            <div class="notif-appt-row"><span class="notif-appt-label">Doctor</span><span class="notif-appt-val">{{ notifyModal.doctorName }}</span></div>
            <div class="notif-appt-row"><span class="notif-appt-label">Date & Time</span><span class="notif-appt-val">{{ notifyModal.date }}{{ notifyModal.time ? ' · ' + notifyModal.time : '' }}</span></div>
            <div class="notif-appt-row"><span class="notif-appt-label">Status</span><span class="appt-status approved">approved</span></div>
          </div>
          <div class="notif-sent-box">
            <div class="notif-sent-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </div>
            <div>
              <p class="notif-sent-title">Push notification sent!</p>
              <p class="notif-sent-sub">The doctor's app has been notified about this approved appointment.</p>
            </div>
          </div>
          <div class="modal-divider-label">Also notify via SMS or Email?</div>
          <div class="notify-options">
            <div class="notify-option" @click="goToSmsBlast" role="button">
              <div class="notify-option-icon sms">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              </div>
              <div class="notify-option-body"><p class="notify-option-title">Send via SMS</p><p class="notify-option-desc">Go to SMS Blast to send a text message to the doctor.</p></div>
              <svg class="notify-option-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
            <div class="notify-option" @click="goToSmsBlast" role="button">
              <div class="notify-option-icon email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div class="notify-option-body"><p class="notify-option-title">Send via Email</p><p class="notify-option-desc">Go to SMS Blast to send an email notification to the doctor.</p></div>
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
              <button class="dropdown-item" @click="$router.push('/edit-profile'); accountOpen=false">
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

      <!-- ACCESS DENIED -->
      <main v-if="!canAccess" class="content">
        <div class="access-denied">
          <div class="access-denied-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h2 class="access-denied-title">Access Restricted</h2>
          <p class="access-denied-msg">You don't have permission to view the Schedule. Please contact your administrator to request access.</p>
        </div>
      </main>

      <!-- PAGE CONTENT -->
      <main v-else class="content">
        <div class="page-header">
          <div>
            <h1 class="page-title">SCHEDULE</h1>
            <p class="breadcrumb">Home / Schedule</p>
          </div>
          <div class="header-stats">
            <div class="stat-pill teal">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ todayCount }} Today
            </div>
            <div class="stat-pill purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              {{ monthCount }} This Month
            </div>
            <div class="stat-pill" :class="isAdmin ? 'green' : 'blue'">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              {{ isAdmin ? 'All Doctors' : 'My Appointments' }}
            </div>
            <!-- ── Admin only: open the availability manager ── -->
            <button v-if="isAdmin" class="btn-manage-avail" @click="openAvailModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Manage Availability
            </button>
          </div>
        </div>

        <div class="schedule-layout">

          <!-- LEFT: CALENDAR -->
          <div class="calendar-card">
            <div class="cal-header">
              <button class="cal-nav" @click="prevMonth">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div class="cal-month-year">
                <span class="cal-month">{{ monthNames[currentMonth] }}</span>
                <span class="cal-year">{{ currentYear }}</span>
              </div>
              <button class="cal-nav" @click="nextMonth">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            <div class="cal-days-header">
              <span v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">{{ d }}</span>
            </div>

            <div class="cal-grid">
              <div
                v-for="(cell, idx) in calendarCells"
                :key="idx"
                :class="[
                  'cal-cell',
                  { 'other-month': !cell.currentMonth },
                  { 'today': cell.isToday },
                  { 'selected': cell.date && isSelected(cell.date) },
                  { 'has-appts': cell.date && getAppointmentCount(cell.date) > 0 }
                ]"
                @click="cell.date && selectDay(cell.date)"
              >
                <span class="cal-date">{{ cell.day }}</span>
                <div class="cal-dots" v-if="cell.date && getAppointmentCount(cell.date) > 0">
                  <span
                    v-for="(dot, di) in getAppointmentDots(cell.date)"
                    :key="di"
                    class="cal-dot"
                    :style="{ background: dot }"
                  ></span>
                </div>
              </div>
            </div>

            <div class="cal-legend">
              <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span> Pending</div>
              <div class="legend-item"><span class="legend-dot" style="background:#3aa6a6"></span> Approved</div>
              <div class="legend-item"><span class="legend-dot" style="background:#6c63ff"></span> Arrived</div>
              <div class="legend-item"><span class="legend-dot" style="background:#16a34a"></span> Completed</div>
            </div>
          </div>

          <!-- RIGHT: APPOINTMENTS PANEL -->
          <div class="appt-panel">
            <div class="appt-panel-header">
              <div>
                <h3 class="appt-panel-title">
                  {{ selectedDate ? formatSelectedDate(selectedDate) : 'Select a date' }}
                </h3>
                <p class="appt-panel-sub" v-if="selectedDate">
                  {{ selectedDayAppts.length }} appointment{{ selectedDayAppts.length !== 1 ? 's' : '' }}
                  <span v-if="!isAdmin" class="my-appts-tag">· Your appointments only</span>
                </p>
              </div>
              <button class="btn-today" @click="goToday">Today</button>
            </div>

            <!-- Doctor search bar (admin only) -->
            <div class="appt-doctor-filter" v-if="isAdmin">
              <div class="appt-doctor-filter-input-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input
                  class="appt-doctor-filter-input"
                  type="text"
                  placeholder="Filter by doctor name…"
                  v-model="doctorFilterSearch"
                />
                <button v-if="doctorFilterSearch" class="avail-search-clear" @click="doctorFilterSearch = ''">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <span class="appt-doctor-filter-count" v-if="doctorFilterSearch">
                {{ filteredSelectedDayAppts.length }} result{{ filteredSelectedDayAppts.length !== 1 ? 's' : '' }} for "{{ doctorFilterSearch }}"
              </span>
            </div>

            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading schedule...</p>
            </div>

            <div v-else-if="fetchError" class="empty-panel error-panel">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              <p>{{ fetchError }}</p>
              <button class="btn-today" @click="fetchAppointments" style="margin-top:4px">Retry</button>
            </div>

            <div v-else-if="!selectedDate" class="empty-panel">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <p>Click any date on the calendar to see appointments</p>
            </div>

            <div v-else-if="selectedDayAppts.length === 0" class="empty-panel">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <p>No appointments on this date</p>
            </div>

            <div v-else class="appt-list">
              <div
                v-for="appt in filteredSelectedDayAppts"
                :key="appt.id"
                class="appt-card"
                @click="viewAppt(appt)"
              >
                <div class="appt-time-col">
                  <span class="appt-time">{{ appt.appointment_time ? formatTime(appt.appointment_time) : '—' }}</span>
                  <div class="appt-time-line"></div>
                </div>
                <div class="appt-info">
                  <div class="appt-info-top">
                    <span class="appt-patient-name">{{ appt.last_name }}, {{ appt.first_name }}</span>
                    <span :class="['appt-status', appt.status]">{{ appt.status }}</span>
                  </div>
                  <p class="appt-doctor">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    {{ appt.doctor || 'Unassigned' }}
                  </p>
                  <div class="appt-actions" @click.stop>
                    <template v-if="isAdmin || doctorCan('manage_appointments')">
                      <!-- ✅ Only Complete remains here too -->
                      <button class="appt-btn complete" v-if="appt.status === 'arrived'" @click="updateStatus(appt, 'completed')">Complete</button>
                    </template>
                    <button v-if="isAdmin" class="appt-btn notify" @click="openNotifyModal(appt)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                      Notify Doctor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- APPOINTMENT DETAIL MODAL -->
    <div class="modal-overlay" v-if="viewingAppt" @click.self="viewingAppt = null">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-header-icon" style="background:#e0f2fe;color:#0369a1">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div class="modal-header-text"><h3>Appointment Details</h3></div>
          <button class="modal-close" @click="viewingAppt = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body" v-if="viewingAppt">
          <div class="modal-patient-header">
            <div class="modal-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div>
              <p class="modal-patient-name">{{ viewingAppt.last_name }}, {{ viewingAppt.first_name }}</p>
              <p class="modal-appt-id">{{ viewingAppt.appointment_id }}</p>
            </div>
            <span :class="['appt-status modal-status', viewingAppt.status]">{{ viewingAppt.status }}</span>
          </div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Doctor</span><span class="detail-val">{{ viewingAppt.doctor || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Date</span><span class="detail-val">{{ formatDate(viewingAppt.appointment_date) }}</span></div>
            <div class="detail-item"><span class="detail-label">Time</span><span class="detail-val">{{ viewingAppt.appointment_time ? formatTime(viewingAppt.appointment_time) : '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Mobile</span><span class="detail-val">{{ viewingAppt.mobile || '—' }}</span></div>
            <div class="detail-item span-2"><span class="detail-label">Condition / Notes</span><span class="detail-val">{{ viewingAppt.condition_notes || '—' }}</span></div>
            <div class="detail-item span-2"><span class="detail-label">Additional Note</span><span class="detail-val">{{ viewingAppt.note || '—' }}</span></div>
          </div>
          <!-- ✅ Only Complete in modal; Mark Arrived & Cancel moved to Queue -->
          <div class="modal-actions" v-if="isAdmin || doctorCan('manage_appointments')">
            <button class="appt-btn complete" v-if="viewingAppt.status === 'arrived'" @click="updateStatus(viewingAppt, 'completed')">✓ Complete</button>
          </div>
          <!-- Notify Doctor in modal: admin only -->
          <div class="modal-notify-row" v-if="isAdmin">
            <button class="appt-btn notify notify-lg" @click="openNotifyModal(viewingAppt)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              Notify Doctor
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-close-modal" @click="viewingAppt = null">Close</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
         MANAGE AVAILABILITY MODAL  (Admin only)
         Admin picks a doctor → selects weekday tab →
         toggles time-slot chips → saves.
         server stores to doctor_schedules table.
         Mobile app reads via GET /doctors/:id/available-slots.
    ══════════════════════════════════════════════════ -->
    <div class="modal-overlay" v-if="availModal.show" @click.self="availModal.show = false">
      <div class="modal avail-modal">

        <!-- header -->
        <div class="modal-header">
          <div class="modal-header-icon" style="background:#e0f2fe;color:#0369a1">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <div class="modal-header-text">
            <h3>Manage Doctor Availability</h3>
            <p class="modal-subtitle">Set the time slots patients can book in the mobile app</p>
          </div>
          <button class="modal-close" @click="availModal.show = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- body -->
        <div class="modal-body avail-body">

          <!-- ── SUMMARY VIEW (after save) ── -->
          <template v-if="availModal.view === 'summary'">
            <div class="avail-summary-view">
              <div class="avail-summary-success">
                <div class="avail-summary-success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <p class="avail-summary-success-title">Schedule Saved!</p>
                  <p class="avail-summary-success-sub">{{ availModal.doctorSearch }} · {{ availModal.hospital }}</p>
                </div>
                <button class="avail-summary-edit-btn" @click="availModal.view = 'edit'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  Edit
                </button>
              </div>

              <div class="avail-summary-days">
                <div
                  v-for="(label, idx) in availDayLabels"
                  :key="idx"
                  class="avail-summary-day-row"
                  :class="{ empty: availSlotsForDay(idx).length === 0 }"
                >
                  <div class="avail-summary-day-label">
                    <span class="avail-summary-day-name">{{ label }}</span>
                    <span class="avail-summary-slot-count" :class="{ zero: availSlotsForDay(idx).length === 0 }">
                      {{ availSlotsForDay(idx).length }} slot{{ availSlotsForDay(idx).length !== 1 ? 's' : '' }}
                    </span>
                  </div>
                  <div class="avail-summary-slots" v-if="availSlotsForDay(idx).length > 0">
                    <span
                      v-for="slot in availSlotsForDay(idx).sort()"
                      :key="slot"
                      class="avail-summary-slot-chip"
                    >{{ slot }}</span>
                  </div>
                  <div class="avail-summary-no-slots" v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                    No slots — unavailable
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ── EDIT VIEW ── -->
          <template v-else>

          <!-- Doctor picker with search -->
          <div class="avail-field-row">
            <label class="avail-label">Doctor</label>
            <div class="avail-doctor-search-wrap" v-click-outside="() => availModal.dropdownOpen = false">
              <div class="avail-doctor-search-input-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input
                  class="avail-doctor-search-input"
                  type="text"
                  placeholder="Search doctor by name or specialization…"
                  v-model="availModal.doctorSearch"
                  @focus="availModal.dropdownOpen = true"
                  @input="availModal.dropdownOpen = true; availModal.doctorId = ''; availModal.hospital = ''; availModal.selectedSlots = {}"
                />
                <button v-if="availModal.doctorSearch" class="avail-search-clear" @click="availModal.doctorSearch = ''; availModal.doctorId = ''; availModal.hospital = ''; availModal.selectedSlots = {}; availModal.dropdownOpen = false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div class="avail-doctor-dropdown" v-if="availModal.dropdownOpen && filteredAvailDoctors.length > 0">
                <div
                  v-for="d in filteredAvailDoctors"
                  :key="d.id"
                  class="avail-doctor-option"
                  :class="{ selected: availModal.doctorId === d.id }"
                  @mousedown.prevent="selectAvailDoctor(d)"
                >
                  <div class="avail-doctor-option-avatar">{{ d.first_name[0] }}{{ d.last_name[0] }}</div>
                  <div class="avail-doctor-option-info">
                    <span class="avail-doctor-option-name">Dr. {{ d.first_name }} {{ d.last_name }}</span>
                    <span class="avail-doctor-option-spec">{{ d.specialization }}</span>
                  </div>
                  <svg v-if="availModal.doctorId === d.id" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#3aa6a6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
              <div class="avail-doctor-dropdown" v-else-if="availModal.dropdownOpen && availModal.doctorSearch && filteredAvailDoctors.length === 0">
                <div class="avail-doctor-no-result">No doctors found for "{{ availModal.doctorSearch }}"</div>
              </div>
              <!-- Selected doctor chip -->
              <div class="avail-selected-doctor-chip" v-if="availModal.doctorId">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                {{ availModal.doctorSearch }}
              </div>
            </div>
          </div>

          <!-- Hospital picker — shown after doctor is selected -->
          <div class="avail-field-row" v-if="availModal.doctorId">
            <label class="avail-label">Hospital</label>
            <div class="avail-hospital-display" v-if="availModal.hospital">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              <span>{{ availModal.hospital }}</span>
            </div>
            <div class="avail-hospital-none" v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"/></svg>
              No hospital assigned to this doctor
            </div>
          </div>

          <!-- Slot editor — only shown once a doctor AND hospital is chosen -->
          <template v-if="availModal.doctorId && availModal.hospital">

            <div v-if="availModal.loadingSlots" class="avail-loading">
              <div class="spinner"></div> Loading saved schedule…
            </div>

            <template v-else>
              <!-- Day-of-week tabs -->
              <div class="avail-day-tabs">
                <button
                  v-for="(label, idx) in availDayLabels"
                  :key="idx"
                  :class="['avail-day-tab', { active: availModal.activeDay === idx }]"
                  @click="availModal.activeDay = idx"
                >{{ label }}</button>
              </div>

              <!-- Hint -->
              <p class="avail-hint">
                Toggle slots for <strong>{{ availDayLabels[availModal.activeDay] }}</strong>.
                Booked slots are hidden automatically from patients.
              </p>

              <!-- Quick-select row -->
              <div class="avail-quick-row">
                <button class="avail-quick-btn" @click="setAllDay(availModal.activeDay, true)">Select all</button>
                <button class="avail-quick-btn" @click="setAllDay(availModal.activeDay, false)">Clear all</button>
              </div>

              <!-- Time slot chip grid -->
              <div class="avail-slots-grid">
                <button
                  v-for="slot in availAllSlots"
                  :key="slot"
                  :class="['avail-slot-chip', { active: isSlotActive(availModal.activeDay, slot) }]"
                  @click="toggleSlot(availModal.activeDay, slot)"
                >{{ slot }}</button>
              </div>

              <!-- Per-day summary pills -->
              <div class="avail-summary">
                <span
                  v-for="(label, idx) in availDayLabels"
                  :key="idx"
                  :class="['avail-summary-pill', { has: availSlotsForDay(idx).length > 0 }]"
                >
                  {{ label.slice(0,3) }}
                  <span class="avail-count">{{ availSlotsForDay(idx).length }}</span>
                </span>
              </div>
            </template>

          </template>

          <!-- Prompt when no doctor/hospital selected -->
          <div v-else class="avail-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <p v-if="!availModal.doctorId">Select a doctor above to manage their available time slots</p>
            <p v-else>Now select a hospital to set this doctor's schedule for that hospital</p>
          </div>

          </template><!-- /edit view -->

        </div><!-- /modal-body -->

        <!-- footer -->
        <div class="modal-footer">
          <button class="btn-skip" @click="availModal.show = false">Close</button>
          <template v-if="availModal.view === 'summary'">
            <button class="btn-save-avail" @click="availModal.view = 'edit'">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Edit Schedule
            </button>
          </template>
          <template v-else>
            <button
              class="btn-save-avail"
              :disabled="!availModal.doctorId || !availModal.hospital || availModal.saving"
              @click="saveSchedule"
            >
              <svg v-if="!availModal.saving" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              {{ availModal.saving ? 'Saving…' : 'Save Schedule' }}
            </button>
          </template>
        </div>

      </div><!-- /modal -->
    </div>

    <!-- SUCCESS TOAST -->
    <transition name="toast">
      <div v-if="toast" class="toast" :class="toast.type">
        <svg v-if="toast.type==='success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script>
const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://carequeue-admin.com/api'

export default {
  name: 'Schedule',
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
      doctors: [],
      notifLoading: false,
      notifications: [],
      unreadCount: 0,
      notifCompose: false,
      notifForm: { target: '', title: '', body: '' },
      accountOpen: false,
      appointmentsOpen: false,
      loading: false,
      fetchError: null,
      currentMonth: now.getMonth(),
      currentYear: now.getFullYear(),
      selectedDate: null,
      appointments: [],
      viewingAppt: null,
      toast: null,

      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),

      notifyModal: { show: false, doctorName: '', patientName: '', date: '', time: '' },

      // ── Manage Availability modal state ─────────────────────
      availModal: {
        show:        false,
        doctorId:    '',
        doctorSearch: '',
        dropdownOpen: false,
        hospital:    '',
        activeDay:   1,
        selectedSlots: {},
        loadingSlots: false,
        saving:       false,
        view:         'edit',   // 'edit' | 'summary'
      },
      doctorFilterSearch: '',
      hospitals: [],

      monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      // ✅ All statuses shown on calendar based on appointment_date
      statusColors: {
        pending:   '#f59e0b',
        approved:  '#3aa6a6',
        arrived:   '#6c63ff',
        completed: '#16a34a',
        cancelled: '#ef4444'
      }
    }
  },
  computed: {
    isAdmin() { return localStorage.getItem('role') === 'admin' },
    canAccess() { return this.isAdmin || this.doctorCan('view_schedule') },

    today() {
      const t = new Date()
      return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`
    },

    myDoctorName() {
      if (this.isAdmin) return null
      return (this.currentUser.name || '').toLowerCase().replace(/^dr\.\s*/i, '').trim()
    },

    // ── All appointments filtered by role (all statuses — for calendar & panel) ──
    visibleAppointments() {
      return this.appointments.filter(a => {
        // Exclude cancelled from panel view (still show on calendar)
        if (a.status === 'cancelled') return false
        if (!this.isAdmin) {
          const apptDoctor = (a.doctor || '').toLowerCase().replace(/^dr\.\s*/i, '').trim()
          return apptDoctor && this.myDoctorName && apptDoctor.includes(this.myDoctorName)
        }
        return true
      })
    },

    // ── All appointments including cancelled — used for calendar dots ──
    calendarAppointments() {
      return this.appointments.filter(a => {
        if (!this.isAdmin) {
          const apptDoctor = (a.doctor || '').toLowerCase().replace(/^dr\.\s*/i, '').trim()
          return apptDoctor && this.myDoctorName && apptDoctor.includes(this.myDoctorName)
        }
        return true
      })
    },

    visibleTodayAppointments() {
      return this.visibleAppointments.filter(a =>
        a.appointment_date && a.appointment_date.slice(0, 10) === this.today
      )
    },

    todayCount() { return this.visibleTodayAppointments.length },

    monthCount() {
      return this.visibleAppointments.filter(a => {
        if (!a.appointment_date) return false
        const d = new Date(a.appointment_date)
        return d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear
      }).length
    },

    // ── Selected day appointments ─────────────────────────────
    selectedDayAppts() {
      if (!this.selectedDate) return []
      return this.visibleAppointments
        .filter(a => a.appointment_date && a.appointment_date.slice(0, 10) === this.selectedDate)
        .sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''))
    },

    calendarCells() {
      const cells = []
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay()
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      const daysInPrev = new Date(this.currentYear, this.currentMonth, 0).getDate()

      for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrev - i
        const m = this.currentMonth === 0 ? 11 : this.currentMonth - 1
        const y = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear
        cells.push({ day, currentMonth: false, isToday: false, date: `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` })
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const date = `${this.currentYear}-${String(this.currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
        cells.push({ day: d, currentMonth: true, isToday: date === this.today, date })
      }
      const remaining = 42 - cells.length
      for (let d = 1; d <= remaining; d++) {
        const m = this.currentMonth === 11 ? 0 : this.currentMonth + 1
        const y = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear
        cells.push({ day: d, currentMonth: false, isToday: false, date: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` })
      }
      return cells
    },

    // ── Doctor search for availability modal ────────────────
    filteredAvailDoctors() {
      const q = (this.availModal.doctorSearch || '').toLowerCase().trim()
      if (!q) return this.doctors
      return this.doctors.filter(d =>
        `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) ||
        (d.specialization || '').toLowerCase().includes(q)
      )
    },

    // ── Doctor filter for appointments panel ────────────────
    filteredSelectedDayAppts() {
      const q = (this.doctorFilterSearch || '').toLowerCase().trim()
      if (!q) return this.selectedDayAppts
      return this.selectedDayAppts.filter(a =>
        (a.doctor || '').toLowerCase().includes(q)
      )
    },

    // ── Availability modal helpers ───────────────────────────
    availDayLabels() {
      return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    },
    availAllSlots() {
      return [
        '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
        '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
      ]
    }
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

    async fetchAppointments() {
      this.loading = true
      this.fetchError = null
      try {
        const res = await fetch(`${API_BASE}/appointments`)
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        this.appointments = await res.json()
      } catch (err) {
        this.fetchError = err.message || 'Could not load appointments.'
        console.error('Failed to fetch appointments:', err)
      } finally { this.loading = false }
    },

    // ✅ Calendar uses appointment_date for ALL statuses (not just approved)
    getAppointmentCount(date) {
      return this.calendarAppointments.filter(a =>
        a.appointment_date && a.appointment_date.slice(0, 10) === date
      ).length
    },

    getAppointmentDots(date) {
      const appts = this.calendarAppointments.filter(a =>
        a.appointment_date && a.appointment_date.slice(0, 10) === date
      )
      const seen = new Set()
      return appts
        .map(a => this.statusColors[a.status] || '#3aa6a6')
        .filter(c => { if (seen.has(c)) return false; seen.add(c); return true })
        .slice(0, 3)
    },

    isSelected(date) { return date === this.selectedDate },
    selectDay(date) { this.selectedDate = date },

    selectDayFromNotif(appt) {
      this.notifOpen = false
      if (appt.appointment_date) {
        this.selectedDate = appt.appointment_date.slice(0, 10)
        this.currentMonth = new Date(appt.appointment_date).getMonth()
        this.currentYear  = new Date(appt.appointment_date).getFullYear()
      }
    },

    goToday() {
      const now = new Date()
      this.currentMonth = now.getMonth()
      this.currentYear  = now.getFullYear()
      this.selectedDate = this.today
    },

    prevMonth() {
      if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear-- }
      else this.currentMonth--
    },
    nextMonth() {
      if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++ }
      else this.currentMonth++
    },

    viewAppt(appt) { this.viewingAppt = { ...appt } },

    async updateStatus(appt, status) {
      try {
        const res = await fetch(`${API_BASE}/appointments/${appt.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
        if (!res.ok) throw new Error()
        const idx = this.appointments.findIndex(a => a.id === appt.id)
        if (idx !== -1) this.appointments[idx].status = status
        if (this.viewingAppt && this.viewingAppt.id === appt.id) this.viewingAppt.status = status
        this.showToast(`Appointment marked as ${status}`, 'success')
      } catch { this.showToast('Failed to update status', 'error') }
    },

    openNotifyModal(appt) {
      const doctorRaw = (appt.doctor || 'Unassigned').replace(/^dr\.\s*/i, '').trim()
      this.notifyModal = {
        show: true,
        doctorName: doctorRaw,
        patientName: `${appt.first_name} ${appt.last_name}`,
        date: this.formatDate(appt.appointment_date),
        time: this.formatTime(appt.appointment_time),
      }
      this.sendDoctorPushNotification(appt)
    },

    async sendDoctorPushNotification(appt) {
      try {
        await fetch(`${API_BASE}/notifications/push`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctor:         appt.doctor,
            title:          'Appointment Reminder 📋',
            body:           `Reminder: You have an approved appointment with ${appt.first_name} ${appt.last_name}` +
                            ` on ${this.formatDate(appt.appointment_date)}` +
                            `${appt.appointment_time ? ' at ' + this.formatTime(appt.appointment_time) : ''}.`,
            type:           'doctor_appointment_reminder',
            appointment_id: appt.id,
          })
        })
      } catch (err) { console.warn('Doctor push notification failed (non-critical):', err) }
    },

    goToSmsBlast() { this.notifyModal.show = false; this.$router.push('/sms-blast') },

    showToast(message, type = 'success') {
      this.toast = { message, type }
      setTimeout(() => { this.toast = null }, 3000)
    },

    // ── FORMAT helpers (aligned with AllAppointments.vue) ──────
    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },

    formatTime(timeStr) {
      if (!timeStr) return ''
      const [h, m] = timeStr.split(':').map(Number)
      const period = h >= 12 ? 'PM' : 'AM'
      const hour = h % 12 || 12
      return `${hour}:${String(m).padStart(2, '0')} ${period}`
    },

    formatSelectedDate(d) {
      if (!d) return ''
      return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },

    handleLogout() { localStorage.removeItem('user'); this.$router.push('/') },

    // ── Availability modal methods ───────────────────────────

    openAvailModal() {
      this.availModal.show         = true
      this.availModal.doctorId     = ''
      this.availModal.doctorSearch = ''
      this.availModal.dropdownOpen = false
      this.availModal.hospital     = ''
      this.availModal.activeDay    = 1
      this.availModal.selectedSlots = {}
      this.availModal.saving       = false
      this.availModal.view         = 'edit'
    },

    selectAvailDoctor(d) {
      this.availModal.doctorId      = d.id
      this.availModal.doctorSearch  = `Dr. ${d.first_name} ${d.last_name} · ${d.specialization}`
      this.availModal.dropdownOpen  = false
      this.availModal.hospital      = d.hospital || ''
      this.availModal.selectedSlots = {}
      if (d.hospital) this.loadDoctorSchedule()
    },

    async loadDoctorSchedule() {
      const id = this.availModal.doctorId
      const hospital = this.availModal.hospital
      if (!id || !hospital) return
      this.availModal.loadingSlots  = true
      this.availModal.selectedSlots = {}
      try {
        const url = `${API_BASE}/doctors/${id}/schedules?hospital=${encodeURIComponent(hospital)}`
        const res  = await fetch(url)
        const data = await res.json()
        const map  = {}
        for (const row of (data.schedules || [])) {
          if (!map[row.day_of_week]) map[row.day_of_week] = new Set()
          map[row.day_of_week].add(row.time_slot)
        }
        this.availModal.selectedSlots = map
      } catch (err) {
        console.error('loadDoctorSchedule error:', err)
      } finally {
        this.availModal.loadingSlots = false
      }
    },

    isSlotActive(dayIdx, slot) {
      const set = this.availModal.selectedSlots[dayIdx]
      return set ? set.has(slot) : false
    },

    availSlotsForDay(dayIdx) {
      const set = this.availModal.selectedSlots[dayIdx]
      return set ? [...set] : []
    },

    toggleSlot(dayIdx, slot) {
      const map = this.availModal.selectedSlots
      if (!map[dayIdx]) map[dayIdx] = new Set()
      if (map[dayIdx].has(slot)) map[dayIdx].delete(slot)
      else map[dayIdx].add(slot)
      // Force Vue reactivity
      this.availModal.selectedSlots = { ...map }
    },

    setAllDay(dayIdx, value) {
      const map = { ...this.availModal.selectedSlots }
      map[dayIdx] = value ? new Set(this.availAllSlots) : new Set()
      this.availModal.selectedSlots = map
    },

    async saveSchedule() {
      const id = this.availModal.doctorId
      if (!id) return
      this.availModal.saving = true
      try {
        // Flatten the selectedSlots map into a flat array of {day_of_week, time_slot}
        const slots = []
        for (const [dow, set] of Object.entries(this.availModal.selectedSlots)) {
          for (const slot of set) {
            slots.push({ day_of_week: Number(dow), time_slot: slot })
          }
        }
        const res = await fetch(`${API_BASE}/doctors/${id}/schedules`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ slots, hospital: this.availModal.hospital }),
        })
        if (!res.ok) throw new Error()
        this.showToast('Schedule saved — patients will see updated slots instantly ✓', 'success')
        this.availModal.view = 'summary'
      } catch {
        this.showToast('Failed to save schedule', 'error')
      } finally {
        this.availModal.saving = false
      }
    }
  },
  beforeUnmount() {
    clearInterval(this._notifPoll)
  },

  mounted() {
    this.fetchAppointments()
    this.selectedDate = this.today
    this.fetchNotifications()
    fetch('https://carequeue-admin.com/api/doctors').then(r=>r.json()).then(d=>{this.doctors=d}).catch(()=>{})
    fetch('https://carequeue-admin.com/api/hospitals').then(r=>r.json()).then(d=>{this.hospitals=d}).catch(()=>{})
    this._notifPoll = setInterval(() => this.fetchNotifications(), 30000)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }

/* SIDEBAR */
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

/* TOPBAR */
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; }
.hamburger:hover { background: rgba(255,255,255,0.15); }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.topbar-btn { position: relative; background: none; border: none; cursor: pointer; color: #fff; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.topbar-btn:hover { background: rgba(255,255,255,0.15); }
.notif-wrapper { position: relative; cursor: pointer; color: white; padding: 8px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.notif-wrapper:hover { background: rgba(255,255,255,0.15); }
.notif-badge { position: absolute; top: 2px; right: 2px; background: #ef4444; color: white; font-size: 9px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #3aa6a6; padding: 0 2px; }
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); z-index: 200; overflow: hidden; animation: fadeDown 0.15s ease; }
@keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
.dropdown-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
.notif-count-label { font-size: 11px; background: #3aa6a6; color: white; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.notif-dropdown { width: 320px; }
.notif-empty { padding: 20px; text-align: center; color: #94a3b8; font-size: 13px; }
.notif-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #f8fafc; }
.notif-item:hover { background: #f8fafc; }
.notif-item.unread { background: #f0fafa; }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #3aa6a6; margin-top: 5px; flex-shrink: 0; }
.notif-title { font-size: 13px; color: #1e293b; font-weight: 600; }
.notif-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
.notif-time { font-size: 11px; color: #94a3b8; margin-top: 3px; display: flex; align-items: center; gap: 4px; text-transform: capitalize; }
.notif-more { padding: 10px 16px; text-align: center; font-size: 12px; color: #3aa6a6; font-weight: 600; cursor: pointer; }
.status-pip { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.status-pip.approved  { background: #3aa6a6; }
.status-pip.pending   { background: #f59e0b; }
.status-pip.arrived   { background: #6c63ff; }
.status-pip.completed { background: #16a34a; }
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

/* ACCESS DENIED */
.access-denied { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 16px; }
.access-denied-icon { width: 96px; height: 96px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; }
.access-denied-title { font-size: 20px; font-weight: 700; color: #1e293b; }
.access-denied-msg { font-size: 14px; color: #64748b; max-width: 380px; line-height: 1.6; }

/* CONTENT */
.content { padding: 28px; flex: 1; overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.header-stats { display: flex; gap: 10px; flex-wrap: wrap; }
.stat-pill { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.stat-pill.teal   { background: #ccf2f2; color: #2e8b8b; }
.stat-pill.purple { background: #ede9fe; color: #5b21b6; }
.stat-pill.green  { background: #dcfce7; color: #166534; }
.stat-pill.blue   { background: #dbeafe; color: #1e40af; }

/* SCHEDULE LAYOUT */
.schedule-layout { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }

/* CALENDAR */
.calendar-card { background: white; border-radius: 16px; padding: 22px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.cal-nav { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #475569; transition: all 0.2s; }
.cal-nav:hover { background: #3aa6a6; color: white; }
.cal-month-year { display: flex; gap: 8px; align-items: baseline; }
.cal-month { font-size: 17px; font-weight: 700; color: #1e293b; }
.cal-year  { font-size: 14px; color: #94a3b8; font-weight: 500; }
.cal-days-header { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 8px; }
.cal-days-header span { text-align: center; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; padding: 4px 0; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-cell { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 10px; cursor: pointer; transition: all 0.15s; position: relative; padding: 2px; }
.cal-cell:hover:not(.other-month) { background: #f0fafa; }
.cal-cell.other-month { opacity: 0.3; cursor: default; }
.cal-cell.today .cal-date { background: #3aa6a6; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
.cal-cell.selected { background: #e6f7f7; }
.cal-cell.selected .cal-date { color: #2e8b8b; font-weight: 700; }
.cal-date { font-size: 13px; font-weight: 500; color: #374151; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
.cal-dots { display: flex; gap: 2px; margin-top: 2px; }
.cal-dot { width: 5px; height: 5px; border-radius: 50%; }
.cal-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9; }
.legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #64748b; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* APPOINTMENT PANEL */
.appt-panel { background: white; border-radius: 16px; padding: 22px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); min-height: 500px; display: flex; flex-direction: column; }
.appt-panel-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.appt-panel-title { font-size: 16px; font-weight: 700; color: #1e293b; }
.appt-panel-sub { font-size: 12px; color: #94a3b8; margin-top: 3px; }
.my-appts-tag { color: #3949ab; font-weight: 600; font-size: 11px; background: #e8eaf6; padding: 2px 8px; border-radius: 10px; margin-left: 4px; }
.btn-today { padding: 7px 16px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-today:hover { background: #2e8b8b; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #94a3b8; flex: 1; }
.spinner { width: 30px; height: 30px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-panel { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px 20px; color: #94a3b8; flex: 1; text-align: center; }
.empty-panel p { font-size: 13px; max-width: 240px; }
.error-panel { color: #ef4444; }
.appt-list { display: flex; flex-direction: column; gap: 12px; flex: 1; }
.upcoming-section { flex: 1; }
.upcoming-title { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }

/* APPOINTMENT CARD */
.appt-card { display: flex; gap: 14px; padding: 14px; border: 1.5px solid #f1f5f9; border-radius: 12px; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
.appt-card:hover { border-color: #3aa6a6; box-shadow: 0 2px 12px rgba(58,166,166,0.1); }
.appt-time-col { display: flex; flex-direction: column; align-items: center; width: 50px; flex-shrink: 0; }
.appt-time { font-size: 11px; font-weight: 700; color: #3aa6a6; white-space: nowrap; }
.appt-time-line { flex: 1; width: 2px; background: #f1f5f9; margin-top: 6px; border-radius: 2px; min-height: 20px; }
.appt-info { flex: 1; min-width: 0; }
.appt-info-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px; }
.appt-patient-name { font-size: 14px; font-weight: 700; color: #1e293b; }
.appt-doctor { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
.appt-notes { font-size: 12px; color: #94a3b8; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.appt-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }

/* STATUS BADGE */
.appt-status { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; text-transform: capitalize; flex-shrink: 0; }
.appt-status.approved  { color: #0369a1; background: #e0f2fe; }
.appt-status.pending   { color: #c2410c; background: #ffedd5; }
.appt-status.arrived   { color: #5b21b6; background: #ede9fe; }
.appt-status.completed { color: #15803d; background: #dcfce7; }
.appt-status.cancelled { color: #dc2626; background: #fee2e2; }

/* ACTION BUTTONS */
.appt-btn { padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; border: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 5px; }
.appt-btn.complete { background: #dcfce7; color: #15803d; }
.appt-btn.complete:hover { background: #15803d; color: white; }
.appt-btn.notify   { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
.appt-btn.notify:hover   { background: #f59e0b; color: white; border-color: #f59e0b; }
.notify-lg { padding: 7px 16px; font-size: 12px; }
.modal-notify-row { padding-top: 8px; border-top: 1px dashed #e2e8f0; display: flex; }

/* MODALS */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; animation: bgFadeIn 0.15s ease; }
@keyframes bgFadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal { background: white; border-radius: 18px; width: 460px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.2); overflow: hidden; animation: slideUp 0.2s ease; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.modal-header { display: flex; align-items: flex-start; gap: 14px; padding: 20px 22px 16px; border-bottom: 1px solid #f1f5f9; }
.modal-header-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.notify-icon { background: #fef3c7; color: #b45309; }
.modal-header-text { flex: 1; }
.modal-header-text h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-subtitle { font-size: 13px; color: #64748b; margin-top: 3px; line-height: 1.5; }
.modal-close { background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; padding: 4px; border-radius: 6px; transition: all 0.15s; flex-shrink: 0; }
.modal-close:hover { color: #1e293b; background: #f1f5f9; }
.modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
.notif-appt-box { background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
.notif-appt-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.notif-appt-label { color: #94a3b8; font-weight: 500; font-size: 12px; }
.notif-appt-val { color: #1e293b; font-weight: 600; }
.notif-sent-box { display: flex; align-items: flex-start; gap: 12px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 14px 16px; }
.notif-sent-icon { width: 36px; height: 36px; border-radius: 10px; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.notif-sent-title { font-size: 13px; font-weight: 700; color: #166534; }
.notif-sent-sub   { font-size: 12px; color: #15803d; margin-top: 3px; line-height: 1.5; }
.modal-divider-label { font-size: 11.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; text-align: center; position: relative; }
.modal-divider-label::before, .modal-divider-label::after { content: ''; position: absolute; top: 50%; width: 30%; height: 1px; background: #e2e8f0; }
.modal-divider-label::before { left: 0; }
.modal-divider-label::after  { right: 0; }
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
.modal-footer { padding: 14px 22px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
.btn-skip { padding: 9px 22px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-skip:hover { background: #e2e8f0; }
.btn-close-modal { padding: 9px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-close-modal:hover { background: #e2e8f0; }
.modal-patient-header { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, #3aa6a6, #2e8b8b); border-radius: 12px; padding: 16px; color: white; }
.modal-avatar { width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-patient-name { font-size: 16px; font-weight: 700; }
.modal-appt-id { font-size: 11px; opacity: 0.8; font-family: monospace; margin-top: 2px; }
.modal-status { margin-left: auto; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-item.span-2 { grid-column: span 2; }
.detail-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.detail-val { font-size: 13px; font-weight: 600; color: #1e293b; }
.modal-actions { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 4px; border-top: 1px solid #f1f5f9; }

/* TOAST */
.toast { position: fixed; bottom: 30px; right: 30px; padding: 14px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 9999; color: white; }
.toast.success { background: #16a34a; }
.toast.error   { background: #dc2626; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }

/* ── Schedule Summary View ───────────────────────────────── */
.avail-summary-view { display: flex; flex-direction: column; gap: 16px; }
.avail-summary-success {
  display: flex; align-items: center; gap: 12px;
  background: #f0fdf4; border: 1.5px solid #bbf7d0;
  border-radius: 12px; padding: 14px 16px;
}
.avail-summary-success-icon {
  width: 44px; height: 44px; border-radius: 50%;
  background: #16a34a; color: #fff; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.avail-summary-success-title { font-size: 14px; font-weight: 700; color: #166534; }
.avail-summary-success-sub { font-size: 12px; color: #15803d; margin-top: 2px; }
.avail-summary-edit-btn {
  margin-left: auto; display: flex; align-items: center; gap: 6px;
  background: #fff; border: 1.5px solid #bbf7d0; border-radius: 8px;
  padding: 6px 12px; font-size: 12.5px; font-weight: 600; color: #166534;
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.avail-summary-edit-btn:hover { background: #dcfce7; }

.avail-summary-days { display: flex; flex-direction: column; gap: 10px; }
.avail-summary-day-row {
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 12px 14px; background: #fff;
  transition: border-color 0.15s;
}
.avail-summary-day-row:not(.empty) { border-color: #a7f3d0; }
.avail-summary-day-label {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.avail-summary-day-name { font-size: 13px; font-weight: 700; color: #1e293b; }
.avail-summary-slot-count {
  font-size: 11.5px; font-weight: 600; padding: 2px 8px;
  border-radius: 20px; background: #d1fae5; color: #065f46;
}
.avail-summary-slot-count.zero { background: #f1f5f9; color: #94a3b8; }
.avail-summary-slots { display: flex; flex-wrap: wrap; gap: 6px; }
.avail-summary-slot-chip {
  padding: 4px 10px; border-radius: 20px;
  background: #e0f2fe; color: #0369a1;
  font-size: 12px; font-weight: 600;
}
.avail-summary-no-slots {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #94a3b8; font-style: italic;
}

/* ── Doctor search in availability modal ─────────────────── */
.avail-doctor-search-wrap { position: relative; }
.avail-doctor-search-input-row {
  display: flex; align-items: center; gap: 8px;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  padding: 8px 12px; background: #fff; transition: border-color 0.2s;
}
.avail-doctor-search-input-row:focus-within { border-color: #3aa6a6; }
.avail-doctor-search-input {
  flex: 1; border: none; outline: none;
  font-size: 13.5px; color: #1e293b; background: transparent;
}
.avail-search-clear {
  background: none; border: none; cursor: pointer;
  color: #94a3b8; padding: 0; display: flex; align-items: center;
}
.avail-search-clear:hover { color: #ef4444; }
.avail-doctor-dropdown {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 100;
  max-height: 220px; overflow-y: auto;
}
.avail-doctor-option {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; cursor: pointer; transition: background 0.15s;
}
.avail-doctor-option:hover { background: #f0fafa; }
.avail-doctor-option.selected { background: #e6f7f7; }
.avail-doctor-option-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: #3aa6a6; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.avail-doctor-option-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.avail-doctor-option-name { font-size: 13.5px; font-weight: 600; color: #1e293b; }
.avail-doctor-option-spec { font-size: 12px; color: #64748b; }
.avail-doctor-no-result { padding: 14px; font-size: 13px; color: #94a3b8; text-align: center; }
.avail-selected-doctor-chip {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 8px; padding: 4px 10px; border-radius: 20px;
  background: #e6f7f7; color: #0f766e; font-size: 12.5px; font-weight: 600;
}

/* ── Doctor filter in appointments panel ─────────────────── */
.appt-doctor-filter { padding: 10px 16px 4px; border-bottom: 1px solid #f1f5f9; }
.appt-doctor-filter-input-row {
  display: flex; align-items: center; gap: 8px;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  padding: 7px 12px; background: #f8fafc; transition: border-color 0.2s;
}
.appt-doctor-filter-input-row:focus-within { border-color: #3aa6a6; background: #fff; }
.appt-doctor-filter-input {
  flex: 1; border: none; outline: none;
  font-size: 13px; color: #1e293b; background: transparent;
}
.appt-doctor-filter-count { display: block; margin-top: 5px; font-size: 12px; color: #64748b; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

@media (max-width: 1024px) { .schedule-layout { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
  .content { padding: 16px; }
  .page-header { flex-direction: column; }
}

/* ── Manage Availability button ─────────────────────────── */
.btn-manage-avail {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 20px;
  background: #0369a1; color: white;
  border: none; font-size: 12px; font-weight: 700;
  cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.btn-manage-avail:hover { background: #0284c7; }

/* ── Availability modal ─────────────────────────────────── */
.avail-modal { width: 560px; }
.avail-body  { gap: 14px; }

.avail-field-row  { display: flex; flex-direction: column; gap: 6px; }
.avail-label      { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.avail-select     { width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
                    font-size: 13px; color: #1e293b; font-family: inherit; outline: none; background: white; }
.avail-select:focus { border-color: #3aa6a6; }

.avail-hospital-display {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border: 1.5px solid #3aa6a6; border-radius: 8px;
  background: #f0fafa; color: #0f766e; font-size: 13.5px; font-weight: 600;
}
.avail-hospital-display svg { flex-shrink: 0; color: #3aa6a6; }
.avail-hospital-none {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border: 1.5px dashed #e2e8f0; border-radius: 8px;
  color: #94a3b8; font-size: 13px; font-style: italic;
}

.avail-loading    { display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 13px; padding: 12px 0; }

.avail-day-tabs   { display: flex; gap: 4px; flex-wrap: wrap; }
.avail-day-tab    { padding: 6px 12px; border-radius: 8px; border: 1.5px solid #e2e8f0;
                    background: white; color: #64748b; font-size: 12px; font-weight: 600;
                    cursor: pointer; font-family: inherit; transition: all 0.15s; }
.avail-day-tab:hover  { border-color: #3aa6a6; color: #3aa6a6; }
.avail-day-tab.active { background: #3aa6a6; color: white; border-color: #3aa6a6; }

.avail-hint  { font-size: 12px; color: #64748b; }

.avail-quick-row { display: flex; gap: 8px; }
.avail-quick-btn { padding: 5px 12px; border: 1.5px solid #e2e8f0; border-radius: 6px;
                   background: white; color: #475569; font-size: 11px; font-weight: 600;
                   cursor: pointer; font-family: inherit; transition: all 0.15s; }
.avail-quick-btn:hover { border-color: #3aa6a6; color: #3aa6a6; }

.avail-slots-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.avail-slot-chip  { padding: 7px 14px; border-radius: 8px; border: 1.5px solid #e2e8f0;
                    background: white; color: #475569; font-size: 12px; font-weight: 600;
                    cursor: pointer; font-family: inherit; transition: all 0.15s; }
.avail-slot-chip:hover  { border-color: #3aa6a6; color: #3aa6a6; }
.avail-slot-chip.active { background: #3aa6a6; color: white; border-color: #3aa6a6; }

.avail-summary      { display: flex; gap: 6px; flex-wrap: wrap; padding-top: 8px; border-top: 1px solid #f1f5f9; }
.avail-summary-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
                      border-radius: 20px; background: #f1f5f9; color: #94a3b8;
                      font-size: 11px; font-weight: 700; transition: all 0.15s; }
.avail-summary-pill.has { background: #ccf2f2; color: #2e8b8b; }
.avail-count        { font-size: 10px; font-weight: 800; }

.avail-empty { display: flex; flex-direction: column; align-items: center; gap: 10px;
               padding: 30px 0; color: #94a3b8; text-align: center; }
.avail-empty p { font-size: 13px; max-width: 260px; line-height: 1.5; }

.btn-save-avail { display: inline-flex; align-items: center; gap: 6px;
                  padding: 9px 22px; background: #3aa6a6; color: white; border: none;
                  border-radius: 8px; font-size: 13px; font-weight: 600;
                  cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-save-avail:hover:not(:disabled) { background: #2e8b8b; }
.btn-save-avail:disabled { opacity: 0.5; cursor: not-allowed; }
</style>