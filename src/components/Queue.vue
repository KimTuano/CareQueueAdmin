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
          <p class="access-denied-msg">You don't have permission to view the Queue. Please contact your administrator to request access.</p>
        </div>
      </main>

      <!-- MAIN CONTENT -->
      <main v-else class="content">
        <div class="page-header">
          <div>
            <h1 class="page-title">Queue</h1>
            <p class="breadcrumb">Appointments / Queue</p>
          </div>
          <!-- Stats for today -->
          <div class="header-stats">
            <div class="stat-pill teal">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ todayApprovedAppointments.length }} Approved Today
            </div>
            <div class="stat-pill purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ arrivedCount }} Arrived
            </div>
            <div class="stat-pill orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"/></svg>
              {{ pendingCount }} Pending
            </div>
          </div>
        </div>

        <div class="table-card">
          <div class="toolbar">
            <div class="toolbar-left">
              <div class="search-box">
                <input type="text" v-model="searchName" placeholder="Search patient name" class="search-input" />
                <button class="search-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </button>
              </div>
              <div class="search-box">
                <input type="text" v-model="searchDoctor" placeholder="Search doctor" class="search-input" />
                <button class="search-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </button>
              </div>
              <!-- Walk-in button -->
              <button v-if="isAdmin || doctorCan('book_appointment')" class="walkin-btn" @click="showWalkInModal = true">
                + Walk-in
              </button>
            </div>
            <div class="toolbar-right">
              <!-- Date display -->
              <div class="date-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ todayFormatted }}
              </div>
              <div class="dropdown-wrapper" v-click-outside="() => sortOpen = false">
                <button class="teal-btn" @click="sortOpen = !sortOpen">
                  Sort <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="toolbar-dropdown" v-show="sortOpen">
                  <button class="toolbar-dropdown-item" @click="sortKey = 'time'; sortOpen = false">By Time</button>
                  <button class="toolbar-dropdown-item" @click="sortKey = 'name'; sortOpen = false">By Name</button>
                  <button class="toolbar-dropdown-item" @click="sortKey = 'doctor'; sortOpen = false">By Doctor</button>
                  <button class="toolbar-dropdown-item" @click="sortKey = 'status'; sortOpen = false">By Status</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading today's queue...</p>
          </div>

          <div v-else-if="fetchError" class="loading-state error-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            <p>{{ fetchError }}</p>
            <button class="teal-btn" @click="fetchAppointments" style="margin-top:4px">Retry</button>
          </div>

          <template v-else>            <table class="records-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(appt, index) in paginatedQueue" :key="appt.id">
                  <td class="queue-num">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                  <td>
                    <div class="patient-cell">
                      <div class="photo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </div>
                      <div>
                        <p class="patient-name">{{ appt.last_name }}, {{ appt.first_name }}</p>
                        <p class="patient-id">{{ appt.appointment_id || '—' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="doctor-cell">{{ appt.doctor || 'Unassigned' }}</td>
                  <td class="time-cell">
                    <span class="time-badge">{{ formatTime(appt.appointment_time) }}</span>
                  </td>
                  <td class="contact-cell">{{ appt.mobile || '—' }}</td>
                  <td>
                    <span :class="['status-badge', appt.status]">{{ appt.status }}</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <!-- ✅ Mark Arrived (moved from Schedule) — only for approved appointments -->
                      <button
                        v-if="(isAdmin || doctorCan('manage_appointments')) && appt.status === 'approved'"
                        class="btn-arrived"
                        @click="updateStatus(appt, 'arrived')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        Mark Arrived
                      </button>

                      <!-- ✅ Cancel (moved from Schedule) — only for approved appointments -->
                      <button
                        v-if="(isAdmin || doctorCan('manage_appointments')) && appt.status === 'approved'"
                        class="btn-cancel"
                        @click="confirmCancel(appt)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        Cancel
                      </button>

                      <!-- Arrived badge — admin sees it, doctors get Done button instead -->
                      <span v-if="appt.status === 'arrived' && isAdmin" class="badge-arrived">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        Arrived
                      </span>

                      <!-- ✅ DONE button — doctors only, arrived patients only -->
                      <button
                        v-if="!isAdmin && appt.status === 'arrived'"
                        class="btn-done"
                        @click="confirmDone(appt)"
                        title="Mark consultation as completed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Done
                      </button>

                      <!-- Read-only fallback for doctors without manage permission -->
                      <span
                        v-if="!isAdmin && !doctorCan('manage_appointments') && appt.status !== 'arrived'"
                        :class="['badge-readonly', appt.status]"
                      >{{ appt.status }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredQueue.length === 0">
                  <td colspan="7" class="empty-row">
                    <div class="empty-queue">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <p>No approved appointments scheduled for today</p>
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
          </template>
        </div>
      </main>
    </div>

    <!-- ── WALK-IN MODAL ── -->
    <div class="modal-overlay" v-if="showWalkInModal" @click.self="showWalkInModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Add Walk-in Patient</h3>
          <button class="modal-close" @click="showWalkInModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="field-group">
            <label>Full Name</label>
            <input type="text" v-model="walkIn.name" placeholder="Enter full name" />
          </div>
          <div class="field-group">
            <label>Mobile Number</label>
            <input type="text" v-model="walkIn.mobile" placeholder="Enter mobile number" />
          </div>
          <div class="field-group">
            <label>Email Address</label>
            <input type="email" v-model="walkIn.email" placeholder="Enter email" />
          </div>
          <div class="field-group">
            <label>Doctor</label>
            <input type="text" v-model="walkIn.doctor" placeholder="Assign doctor (optional)" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel-modal" @click="showWalkInModal = false">Cancel</button>
          <button class="teal-btn" @click="addWalkIn">Add to Queue</button>
        </div>
      </div>
    </div>

    <!-- ── CANCEL CONFIRM MODAL ── -->
    <div class="modal-overlay" v-if="cancelTarget" @click.self="cancelTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <div class="modal-header-icon cancel-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
          </div>
          <div class="modal-header-text">
            <h3>Cancel Appointment</h3>
            <p class="modal-subtitle">This action cannot be undone.</p>
          </div>
          <button class="modal-close" @click="cancelTarget = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body" v-if="cancelTarget">
          <p class="confirm-text">
            Are you sure you want to cancel the appointment for
            <strong>{{ cancelTarget.first_name }} {{ cancelTarget.last_name }}</strong>
            with <strong>{{ cancelTarget.doctor || 'Unassigned' }}</strong>
            at <strong>{{ cancelTarget.appointment_time || 'N/A' }}</strong>?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel-modal" @click="cancelTarget = null">Keep Appointment</button>
          <button class="btn-confirm-cancel" @click="executeCancel">Yes, Cancel It</button>
        </div>
      </div>
    </div>


    <!-- ── DONE CONFIRM MODAL (doctor only) ── -->
    <div class="modal-overlay" v-if="doneTarget" @click.self="doneTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <div class="modal-header-icon done-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="modal-header-text">
            <h3>Mark as Completed</h3>
            <p class="modal-subtitle">This will close the consultation.</p>
          </div>
          <button class="modal-close" @click="doneTarget = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body" v-if="doneTarget">
          <p class="confirm-text">
            Mark consultation with
            <strong>{{ doneTarget.first_name }} {{ doneTarget.last_name }}</strong>
            as <strong>Completed</strong>? This will update the appointment across all records.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel-modal" @click="doneTarget = null">Not yet</button>
          <button class="btn-confirm-done" @click="executeDone" :disabled="doneLoading">
            <svg v-if="doneLoading" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="animation:spin 0.7s linear infinite"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            {{ doneLoading ? 'Saving...' : 'Yes, Mark Done' }}
          </button>
        </div>
      </div>
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
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://https://carequeue-admin.com/api'

export default {
  name: 'Queue',
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
      sortOpen: false,
      searchName: '',
      searchDoctor: '',
      sortKey: 'time',
      currentPage: 1,
      perPage: 10,
      loading: false,
      fetchError: null,
      showWalkInModal: false,
      cancelTarget: null,
      doneTarget: null,
      doneLoading: false,
      toast: null,
      walkIn: { name: '', mobile: '', email: '', doctor: '' },

      // Appointments fetched from backend
      appointments: [],
      // Walk-in queue (local only)
      walkInQueue: [],
      nextWalkInId: 9000,

      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),
    }
  },
  computed: {
    isAdmin() { return localStorage.getItem('role') === 'admin' },
    canAccess() { return this.isAdmin || this.doctorCan('view_queue') },

    today() {
      const t = new Date()
      return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`
    },

    todayFormatted() {
      return new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },

    // ✅ Only patients with appointment_date === TODAY and status === 'approved' (or arrived)
    todayApprovedAppointments() {
      return this.appointments.filter(a =>
        a.appointment_date &&
        a.appointment_date.slice(0, 10) === this.today &&
        (a.status === 'approved' || a.status === 'arrived')
      )
    },

    arrivedCount() {
      return this.todayApprovedAppointments.filter(a => a.status === 'arrived').length
    },

    pendingCount() {
      return this.todayApprovedAppointments.filter(a => a.status === 'approved').length
    },

    // Combined: scheduled appointments for today + walk-ins
    allQueueItems() {
      return [...this.todayApprovedAppointments, ...this.walkInQueue]
    },

    filteredQueue() {
      let list = this.allQueueItems
      if (this.searchName) {
        const q = this.searchName.toLowerCase()
        list = list.filter(a => {
          const full = ((a.first_name || '') + ' ' + (a.last_name || '') + ' ' + (a.name || '')).toLowerCase()
          return full.includes(q)
        })
      }
      if (this.searchDoctor) {
        const q = this.searchDoctor.toLowerCase()
        list = list.filter(a => (a.doctor || '').toLowerCase().includes(q))
      }
      // Sort
      return [...list].sort((a, b) => {
        if (this.sortKey === 'time')   return (a.appointment_time || '').localeCompare(b.appointment_time || '')
        if (this.sortKey === 'name')   return (a.last_name || a.name || '').localeCompare(b.last_name || b.name || '')
        if (this.sortKey === 'doctor') return (a.doctor || '').localeCompare(b.doctor || '')
        if (this.sortKey === 'status') return (a.status || '').localeCompare(b.status || '')
        return 0
      })
    },

    paginatedQueue() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredQueue.slice(start, start + this.perPage)
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredQueue.length / this.perPage))
    }
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

    async fetchAppointments() {
      this.loading = true
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
        console.error('Failed to fetch appointments:', err)
      } finally { this.loading = false }
    },

    // ✅ Mark Arrived — updates appointment status to 'arrived'
    async updateStatus(appt, status) {
      // Walk-in items are local only
      if (appt._walkIn) {
        appt.status = status
        this.showToast(`Marked as ${status}`, 'success')
        return
      }
      try {
        const res = await fetch(`${API_BASE}/appointments/${appt.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
        if (!res.ok) throw new Error()
        const idx = this.appointments.findIndex(a => a.id === appt.id)
        if (idx !== -1) this.appointments[idx].status = status
        this.showToast(`Patient marked as ${status}`, 'success')
      } catch { this.showToast('Failed to update status', 'error') }
    },

    // ✅ Cancel — shows confirmation modal first
    confirmCancel(appt) { this.cancelTarget = appt },

    async executeCancel() {
      if (!this.cancelTarget) return
      await this.updateStatus(this.cancelTarget, 'cancelled')
      this.cancelTarget = null
    },

    // Walk-in patient added directly to local queue
    addWalkIn() {
      if (!this.walkIn.name) return this.showToast('Please enter a patient name', 'error')
      this.walkInQueue.push({
        id: this.nextWalkInId++,
        _walkIn: true,
        first_name: this.walkIn.name.split(' ')[0] || this.walkIn.name,
        last_name:  this.walkIn.name.split(' ').slice(1).join(' ') || '',
        name:       this.walkIn.name,
        mobile:     this.walkIn.mobile,
        email:      this.walkIn.email,
        doctor:     this.walkIn.doctor || null,
        appointment_time: null,
        appointment_date: this.today,
        status: 'approved',
        appointment_id: `WALKIN-${this.nextWalkInId - 1}`,
      })
      this.walkIn = { name: '', mobile: '', email: '', doctor: '' }
      this.showWalkInModal = false
      this.showToast('Walk-in patient added to queue', 'success')
    },


    // ✅ Done — doctor marks arrived patient as completed
    confirmDone(appt) {
      this.doneTarget = appt
    },

    async executeDone() {
      if (!this.doneTarget) return
      this.doneLoading = true
      try {
        const appt = this.doneTarget
        if (appt._walkIn) {
          appt.status = 'completed'
        } else {
          const res = await fetch(`${API_BASE}/appointments/${appt.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
          })
          if (!res.ok) throw new Error()
          const idx = this.appointments.findIndex(a => a.id === appt.id)
          if (idx !== -1) this.appointments[idx].status = 'completed'
        }
        this.showToast(`Consultation completed for ${this.doneTarget.first_name} ${this.doneTarget.last_name}`, 'success')
        this.doneTarget = null
      } catch {
        this.showToast('Failed to mark as completed', 'error')
      } finally {
        this.doneLoading = false
      }
    },

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
      if (!timeStr) return '—'
      const [h, m] = timeStr.split(':').map(Number)
      const period = h >= 12 ? 'PM' : 'AM'
      const hour = h % 12 || 12
      return `${hour}:${String(m).padStart(2, '0')} ${period}`
    },

    handleLogout() { localStorage.removeItem('user'); this.$router.push('/') }
  },
  beforeUnmount() {
    clearInterval(this._notifPoll)
  },

  mounted() {
    this.fetchAppointments()
    this.fetchNotifications()
    fetch('http://https://carequeue-admin.com/api/doctors').then(r=>r.json()).then(d=>{this.doctors=d}).catch(()=>{})
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
.sidebar-logo-img { width: 60%; height: 60%; border-radius: 10px; object-fit: cover; background: white; padding: 2px; transition: width 0.3s ease, height 0.3s ease; }
.sidebar.collapsed .sidebar-logo-img { margin: 5px; width: 40px; height: 40px; }
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

/* TOPBAR */
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

/* ACCESS DENIED */
.access-denied { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 16px; }
.access-denied-icon { width: 96px; height: 96px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; }
.access-denied-title { font-size: 20px; font-weight: 700; color: #1e293b; }
.access-denied-msg { font-size: 14px; color: #64748b; max-width: 380px; line-height: 1.6; }

/* CONTENT */
.content { padding: 28px; flex: 1; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.header-stats { display: flex; gap: 10px; flex-wrap: wrap; }
.stat-pill { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.stat-pill.teal   { background: #ccf2f2; color: #2e8b8b; }
.stat-pill.purple { background: #ede9fe; color: #5b21b6; }
.stat-pill.orange { background: #ffedd5; color: #c2410c; }

/* TABLE CARD */
.table-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

/* TOOLBAR */
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.toolbar-left  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.toolbar-right { display: flex; gap: 10px; align-items: center; }
.search-box { display: flex; align-items: center; border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.search-box:focus-within { border-color: #3aa6a6; }
.search-input { padding: 8px 12px; border: none; outline: none; font-size: 13px; color: #475569; font-family: inherit; width: 160px; }
.search-btn { padding: 8px 12px; background: #3aa6a6; border: none; cursor: pointer; color: white; display: flex; align-items: center; }
.search-btn:hover { background: #2e8b8b; }
.walkin-btn { padding: 8px 20px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.walkin-btn:hover { background: #2e8b8b; }
.date-badge { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #f0fafa; border: 1.5px solid #ccf2f2; border-radius: 8px; font-size: 12px; font-weight: 600; color: #2e8b8b; white-space: nowrap; }
.teal-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.teal-btn:hover { background: #2e8b8b; }
.dropdown-wrapper { position: relative; }
.toolbar-dropdown { position: absolute; top: calc(100% + 6px); right: 0; background: white; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); z-index: 150; overflow: hidden; min-width: 150px; }
.toolbar-dropdown-item { display: block; width: 100%; padding: 10px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.toolbar-dropdown-item:hover { background: #f8fafc; color: #1e293b; }

/* LOADING */
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #94a3b8; }
.error-state { color: #ef4444; }
.spinner { width: 30px; height: 30px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* TABLE */
.records-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.records-table th { text-align: left; padding: 10px 16px; color: #64748b; font-weight: 600; font-size: 12px; border-bottom: 2px solid #f1f5f9; text-transform: uppercase; letter-spacing: 0.4px; }
.records-table td { padding: 12px 16px; color: #475569; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.records-table tr:hover td { background: #f8fafc; }
.queue-num { font-weight: 700; color: #3aa6a6; font-size: 13px; width: 40px; }
.patient-cell { display: flex; align-items: center; gap: 10px; }
.photo-placeholder { width: 34px; height: 34px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; flex-shrink: 0; }
.patient-name { font-size: 13px; font-weight: 700; color: #1e293b; }
.patient-id { font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 1px; }
.doctor-cell { font-size: 13px; color: #475569; }
.time-cell { }
.time-badge { display: inline-block; padding: 3px 10px; background: #f0fafa; color: #2e8b8b; border-radius: 6px; font-size: 12px; font-weight: 700; }
.contact-cell { font-size: 12px; color: #64748b; }

/* STATUS BADGES */
.status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: capitalize; }
.status-badge.approved  { background: #e0f2fe; color: #0369a1; }
.status-badge.arrived   { background: #ede9fe; color: #5b21b6; }
.status-badge.completed { background: #dcfce7; color: #15803d; }
.status-badge.cancelled { background: #fee2e2; color: #dc2626; }

/* ACTION BUTTONS */
.action-btns { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

/* ✅ Mark Arrived button (moved from Schedule) */
.btn-arrived { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; background: #ede9fe; color: #5b21b6; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-arrived:hover { background: #5b21b6; color: white; }

/* ✅ Cancel button (moved from Schedule) */
.btn-cancel { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; background: #fee2e2; color: #dc2626; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-cancel:hover { background: #dc2626; color: white; }

.badge-arrived { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #ede9fe; color: #5b21b6; border-radius: 6px; font-size: 11px; font-weight: 700; }
.badge-readonly { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge-readonly.approved { background: #e0f2fe; color: #0369a1; }
.badge-readonly.arrived  { background: #ede9fe; color: #5b21b6; }

.empty-queue { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px; color: #94a3b8; }
.empty-queue p { font-size: 13px; }

.pagination { display: flex; justify-content: center; gap: 6px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
.page-btn { padding: 6px 12px; border: 1.5px solid #e2e8f0; background: white; border-radius: 6px; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.page-btn:hover:not(:disabled) { border-color: #3aa6a6; color: #3aa6a6; }
.page-btn.active { background: #3aa6a6; color: white; border-color: #3aa6a6; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* MODALS */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; animation: bgFadeIn 0.15s ease; }
@keyframes bgFadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal { background: white; border-radius: 18px; width: 460px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.2); overflow: hidden; animation: slideUp 0.2s ease; }
.modal-sm { width: 400px; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.modal-header { display: flex; align-items: flex-start; gap: 14px; padding: 20px 22px 16px; border-bottom: 1px solid #f1f5f9; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-header-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cancel-icon { background: #fef2f2; color: #dc2626; }
.modal-header-text { flex: 1; }
.modal-header-text h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-subtitle { font-size: 12px; color: #94a3b8; margin-top: 3px; }
.modal-close { background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; padding: 4px; border-radius: 6px; transition: all 0.15s; }
.modal-close:hover { color: #1e293b; background: #f1f5f9; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
.confirm-text { font-size: 14px; color: #475569; line-height: 1.6; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label { font-size: 12px; font-weight: 600; color: #64748b; }
.field-group input { padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; font-family: inherit; outline: none; transition: border-color 0.2s; }
.field-group input:focus { border-color: #3aa6a6; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
.btn-cancel-modal { padding: 9px 20px; background: white; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-cancel-modal:hover { background: #f8fafc; }
.btn-confirm-cancel { padding: 9px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-confirm-cancel:hover { background: #b91c1c; }

/* TOAST */
.toast { position: fixed; bottom: 30px; right: 30px; padding: 14px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 9999; color: white; }
.toast.success { background: #16a34a; }
.toast.error   { background: #dc2626; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 300; height: 100vh; }
  .content { padding: 16px; }
  .page-header { flex-direction: column; }
  .records-table th:nth-child(5),
  .records-table td:nth-child(5) { display: none; }
}

/* ✅ Done button — doctors only */
.btn-done { display: inline-flex; align-items: center; gap: 5px; padding: 5px 14px; background: linear-gradient(135deg, #16a34a, #15803d); color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; box-shadow: 0 2px 6px rgba(22,163,74,0.3); }
.btn-done:hover { background: linear-gradient(135deg, #15803d, #166534); box-shadow: 0 4px 12px rgba(22,163,74,0.4); transform: translateY(-1px); }
.btn-done:active { transform: translateY(0); }

/* Done modal icon */
.done-icon { background: #dcfce7; color: #16a34a; }

/* Done confirm button */
.btn-confirm-done { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; background: #16a34a; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-confirm-done:hover { background: #15803d; }
.btn-confirm-done:disabled { opacity: 0.6; cursor: not-allowed; }

</style>