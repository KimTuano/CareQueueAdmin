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
              <button class="dropdown-item logout" @click="handleLogout">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <!-- ACCESS DENIED -->
      <main class="content" v-if="!isAdmin && !doctorCan('view_medical_records')">
        <div class="access-denied-page">
          <div class="access-denied-icon"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
          <h2 class="access-denied-title">Access Restricted</h2>
          <p class="access-denied-text">You don't have permission to view Medical Records. Please contact your administrator.</p>
          <button class="btn-go-back" @click="$router.push('/dashboard')">← Go to Dashboard</button>
        </div>
      </main>

      <main class="content" v-else>
        <div class="page-header">
          <h1 class="page-title">{{ patient ? patient.first_name + ' ' + patient.last_name : 'Loading...' }}</h1>
          <p class="breadcrumb">
            <span class="breadcrumb-link" @click="$router.push('/medical-records')">Medical Records</span>
            / {{ patient ? patient.patient_id : '...' }}
          </p>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading patient record...</p>
        </div>

        <div class="record-layout" v-else-if="patient">
          <div class="left-panel">
            <div class="patient-card">
              <p class="patient-card-label">PATIENT RECORDS</p>
              <div class="patient-photo-wrap">
                <div class="patient-photo"><svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
              </div>
              <nav class="record-nav">
                <button :class="['record-nav-item', { active: activeTab === 'visits' }]" @click="activeTab = 'visits'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Past Visits
                </button>
                <button :class="['record-nav-item', { active: activeTab === 'prescriptions' }]" @click="switchTab('prescriptions')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Prescriptions
                </button>
                <button :class="['record-nav-item', { active: activeTab === 'reports' }]" @click="switchTab('reports')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  Reports
                </button>
                <button :class="['record-nav-item', { active: activeTab === 'profile' }]" @click="activeTab = 'profile'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  Patient Profile
                </button>
              </nav>
            </div>
          </div>

          <div class="right-panel">

            <!-- ── PAST VISITS ───────────────────────────────── -->
            <div v-if="activeTab === 'visits'" class="panel-card">
              <div class="panel-toolbar">
                <h2 class="panel-title">PAST VISITS</h2>
                <button v-if="isAdmin || doctorCan('print_records')" class="action-btn teal" @click="printTab('visits')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print
                </button>
              </div>
              <table class="data-table" v-if="appointments.length > 0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Doctor</th>
                    <th>Date &amp; Time</th>
                    <th>Condition / Notes</th>
                    <th>Status</th>
                    <th v-if="isAdmin || doctorCan('view_patient_profile')">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="appt in appointments" :key="appt.id">
                    <td class="mono">{{ appt.appointment_id }}</td>
                    <td>{{ appt.doctor || '—' }}</td>
                    <td>{{ formatDateTime(appt.appointment_date, appt.appointment_time) }}</td>
                    <td class="notes-cell">{{ appt.condition_notes || appt.note || '—' }}</td>
                    <td><span :class="['status-badge', appt.status]">{{ appt.status }}</span></td>
                    <td v-if="isAdmin || doctorCan('view_patient_profile')">
                      <div class="row-actions">
                        <button class="btn-sm view" @click="viewAppointment(appt)">View</button>
                        <button class="btn-sm prescribe" @click="openPrescribeModal(appt)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          Prescribe
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="empty-panel" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p>No past visits recorded.</p>
              </div>
            </div>

            <!-- ── PRESCRIPTIONS ──────────────────────────────── -->
            <div v-if="activeTab === 'prescriptions'" class="panel-card">
              <div class="panel-toolbar">
                <h2 class="panel-title">PRESCRIPTIONS</h2>
                <button v-if="isAdmin || doctorCan('print_records')" class="action-btn teal" @click="printTab('prescriptions')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print
                </button>
              </div>

              <div v-if="loadingRx" class="loading-mini">
                <div class="spinner-sm"></div>
                <span>Loading prescriptions…</span>
              </div>

              <table class="data-table" v-else-if="prescriptions.length > 0">
                <thead>
                  <tr>
                    <th>Rx ID</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Instructions</th>
                    <th>Prescribed By</th>
                    <th>Date Prescribed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="rx in prescriptions" :key="rx.id">
                    <td class="mono">RX-{{ String(rx.id).padStart(4,'0') }}</td>
                    <td><strong>{{ rx.medication }}</strong></td>
                    <td>{{ rx.dosage || '—' }}</td>
                    <td class="notes-cell">{{ rx.instructions || '—' }}</td>
                    <td>{{ rx.prescribed_by || '—' }}</td>
                    <td>{{ formatDate(rx.prescribed_date) }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="empty-panel" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <p>No prescriptions found. Use the <strong>Prescribe</strong> button in Past Visits.</p>
              </div>
            </div>

            <!-- ── REPORTS ──────────────────────────────────── -->
            <div v-if="activeTab === 'reports'" class="panel-card">
              <div class="panel-toolbar">
                <h2 class="panel-title">REPORTS</h2>
                <div class="toolbar-btn-group">
                  <button v-if="isAdmin || doctorCan('print_records')" class="action-btn teal" @click="printTab('reports')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    Print
                  </button>
                  <!-- Import File (label wraps hidden input) -->
                  <label class="action-btn blue" title="Import a file">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    Import File
                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display:none" ref="fileInput" @change="handleImportFile" />
                  </label>
                  <!-- New Report -->
                  <button class="action-btn green" @click="openNewReportModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    New Report
                  </button>
                </div>
              </div>

              <div v-if="reports.length > 0" class="reports-list">
                <div v-for="(r, i) in reports" :key="i" class="report-row">
                  <div class="report-icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </div>
                  <div class="report-info">
                    <p class="report-title">{{ r.title }}</p>
                    <p class="report-meta">{{ r.type }} &nbsp;·&nbsp; {{ r.created_by }} &nbsp;·&nbsp; {{ formatDate(r.date) }}</p>
                    <p class="report-notes" v-if="r.notes">{{ r.notes }}</p>
                  </div>
                  <button class="btn-sm del" @click="removeReport(i)">Remove</button>
                </div>
              </div>

              <div class="empty-panel" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <p>No reports yet. Create a new report or import a file.</p>
              </div>
            </div>

            <!-- ── PATIENT PROFILE ───────────────────────────── -->
            <div v-if="activeTab === 'profile'" class="panel-card">
              <div class="panel-toolbar">
                <h2 class="panel-title">PATIENT PROFILE</h2>
                <button v-if="isAdmin || doctorCan('print_records')" class="action-btn teal" @click="printTab('profile')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print
                </button>
              </div>
              <div class="profile-section-title">PERSONAL INFORMATION</div>
              <div class="profile-grid">
                <div class="profile-field"><label>Last Name</label><input type="text" :value="patient.last_name" readonly /></div>
                <div class="profile-field"><label>First Name</label><input type="text" :value="patient.first_name" readonly /></div>
                <div class="profile-field"><label>Name Extension (If available)</label><input type="text" :value="patient.name_extension || ''" readonly /></div>
                <div class="profile-field"><label>Middle Name</label><input type="text" :value="patient.middle_name || ''" readonly /></div>
              </div>
              <div class="profile-grid cols-4">
                <div class="profile-field">
                  <label>Gender</label>
                  <div class="radio-group">
                    <label class="radio-label"><input type="radio" :checked="patient.gender === 'Male'" disabled /> Male</label>
                    <label class="radio-label"><input type="radio" :checked="patient.gender === 'Female'" disabled /> Female</label>
                  </div>
                </div>
                <div class="profile-field"><label>Date of Birth</label><input type="text" :value="formatDate(patient.date_of_birth)" readonly /></div>
                <div class="profile-field"><label>Age</label><input type="text" :value="patient.age || ''" readonly /></div>
                <div class="profile-field"><label>Religion</label><input type="text" :value="patient.religion || ''" readonly /></div>
              </div>
              <div class="profile-section-title">CONTACT INFORMATION</div>
              <div class="profile-grid">
                <div class="profile-field"><label>Landline Number</label><input type="text" :value="patient.landline || ''" readonly /></div>
                <div class="profile-field"><label>Mobile Number</label><input type="text" :value="patient.mobile || ''" readonly /></div>
                <div class="profile-field span-2"><label>Email Address</label><input type="text" :value="patient.email || ''" readonly /></div>
              </div>
              <div class="profile-section-title">ADDRESS</div>
              <div class="profile-grid cols-5">
                <div class="profile-field"><label>Unit/Room/Floor</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Building No.</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Street</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Subdivision/Village</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Barangay</label><input type="text" value="N/A" readonly /></div>
              </div>
              <div class="profile-grid cols-3">
                <div class="profile-field"><label>City/Municipality</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>Province</label><input type="text" value="N/A" readonly /></div>
                <div class="profile-field"><label>ZIP</label><input type="text" value="N/A" readonly /></div>
              </div>
            </div>

          </div>
        </div>

        <div class="not-found" v-else-if="!loading">
          <p>Patient not found. <span class="back-link" @click="$router.push('/medical-records')">Go back</span></p>
        </div>
      </main>
    </div>

    <!-- ── APPOINTMENT DETAIL MODAL ──────────────────────── -->
    <div class="modal-overlay" v-if="viewingAppt" @click.self="viewingAppt = null">
      <div class="modal">
        <div class="modal-header">
          <h3>Appointment Detail</h3>
          <button class="modal-close" @click="viewingAppt = null">✕</button>
        </div>
        <div class="modal-body" v-if="viewingAppt">
          <div class="detail-row"><span class="detail-label">Appointment ID</span><span class="detail-value mono">{{ viewingAppt.appointment_id }}</span></div>
          <div class="detail-row"><span class="detail-label">Doctor</span><span class="detail-value">{{ viewingAppt.doctor || '—' }}</span></div>
          <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">{{ formatDate(viewingAppt.appointment_date) }}</span></div>
          <div class="detail-row"><span class="detail-label">Time</span><span class="detail-value">{{ viewingAppt.appointment_time || '—' }}</span></div>
          <div class="detail-row"><span class="detail-label">Status</span><span :class="['status-badge', viewingAppt.status]">{{ viewingAppt.status }}</span></div>
          <div class="detail-row"><span class="detail-label">Condition / Notes</span><span class="detail-value">{{ viewingAppt.condition_notes || '—' }}</span></div>
          <div class="detail-row"><span class="detail-label">Additional Note</span><span class="detail-value">{{ viewingAppt.note || '—' }}</span></div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="viewingAppt = null">Close</button>
          <button v-if="isAdmin || doctorCan('print_records')" class="btn-print-confirm" @click="printAppointment(viewingAppt)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print
          </button>
        </div>
      </div>
    </div>

    <!-- ── PRESCRIBE MODAL ───────────────────────────────── -->
    <div class="modal-overlay" v-if="prescribeModal.open" @click.self="closePrescribeModal">
      <div class="modal modal-wide">
        <div class="modal-header">
          <div>
            <h3>Prescribe Medication</h3>
            <p class="modal-subtitle" v-if="prescribeModal.appt">
              For visit: <span class="mono">{{ prescribeModal.appt.appointment_id }}</span>
              &nbsp;·&nbsp; {{ formatDate(prescribeModal.appt.appointment_date) }}
            </p>
          </div>
          <button class="modal-close" @click="closePrescribeModal">✕</button>
        </div>

        <div class="modal-body">
          <!-- Patient banner -->
          <div class="rx-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span>Patient: <strong>{{ patient ? patient.first_name + ' ' + patient.last_name : '' }}</strong></span>
          </div>

          <!-- Medication rows -->
          <div v-for="(med, idx) in prescribeModal.medications" :key="idx" class="med-block">
            <div class="med-block-header">
              <span class="med-index">Medication {{ idx + 1 }}</span>
              <button v-if="prescribeModal.medications.length > 1" class="btn-remove-med" @click="removeMed(idx)">✕ Remove</button>
            </div>
            <div class="med-grid">
              <div class="form-field col-span-2">
                <label>Medication Name <span class="req">*</span></label>
                <input type="text" v-model="med.medication" placeholder="e.g. Amoxicillin 500mg" class="form-input" />
              </div>
              <div class="form-field">
                <label>Dosage</label>
                <input type="text" v-model="med.dosage" placeholder="e.g. 1 tablet 3x/day" class="form-input" />
              </div>
              <div class="form-field col-span-3">
                <label>Instructions / Notes</label>
                <textarea v-model="med.instructions" placeholder="e.g. Take after meals for 7 days. Avoid alcohol." class="form-textarea" rows="2"></textarea>
              </div>
            </div>
          </div>

          <button class="btn-add-med" @click="addMed">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Another Medication
          </button>

          <div class="form-field" style="margin-top:14px">
            <label>Prescribed By</label>
            <input type="text" v-model="prescribeModal.prescribed_by" placeholder="Doctor's name" class="form-input" style="max-width:320px" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closePrescribeModal" :disabled="savingRx">Cancel</button>
          <button class="btn-save-rx" @click="savePrescriptions" :disabled="savingRx">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            {{ savingRx ? 'Saving…' : 'Save Prescription' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── NEW REPORT MODAL ───────────────────────────────── -->
    <div class="modal-overlay" v-if="reportModal.open" @click.self="closeReportModal">
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3>Create New Report</h3>
          <button class="modal-close" @click="closeReportModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label>Report Title <span class="req">*</span></label>
            <input type="text" v-model="reportModal.title" placeholder="e.g. CBC Result, X-Ray, ECG Report" class="form-input" />
          </div>
          <div class="med-grid" style="margin-top:10px">
            <div class="form-field col-span-2">
              <label>Report Type</label>
              <select v-model="reportModal.type" class="form-input">
                <option>Lab Result</option>
                <option>Imaging</option>
                <option>Clinical Notes</option>
                <option>Discharge Summary</option>
                <option>Referral Letter</option>
                <option>Other</option>
              </select>
            </div>
            <div class="form-field">
              <label>Created By</label>
              <input type="text" v-model="reportModal.created_by" placeholder="Doctor / Staff name" class="form-input" />
            </div>
          </div>
          <div class="form-field" style="margin-top:10px">
            <label>Findings / Notes</label>
            <textarea v-model="reportModal.notes" placeholder="Enter findings, observations, or any relevant notes…" class="form-textarea" rows="5"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeReportModal">Cancel</button>
          <button class="btn-save-rx" style="background:#16a34a" @click="saveReport">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Save Report
          </button>
        </div>
      </div>
    </div>

    <!-- ── HIDDEN PRINT AREA ──────────────────────────────── -->
    <div id="print-section" style="display:none">
      <div class="print-doc" v-if="patient">
        <div class="print-header">
          <h1>CareQueue — {{ printTitle }}</h1>
          <p>Patient: <strong>{{ patient.last_name }}, {{ patient.first_name }}</strong> | ID: {{ patient.patient_id }}</p>
          <p>Printed: {{ new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' }) }}</p>
        </div>
        <template v-if="printMode === 'profile'">
          <table class="print-table">
            <tbody>
              <tr><td class="pl"><strong>Last Name</strong></td><td>{{ patient.last_name }}</td><td class="pl"><strong>First Name</strong></td><td>{{ patient.first_name }}</td></tr>
              <tr><td class="pl"><strong>Middle Name</strong></td><td>{{ patient.middle_name || '—' }}</td><td class="pl"><strong>Extension</strong></td><td>{{ patient.name_extension || '—' }}</td></tr>
              <tr><td class="pl"><strong>Gender</strong></td><td>{{ patient.gender || '—' }}</td><td class="pl"><strong>Date of Birth</strong></td><td>{{ formatDate(patient.date_of_birth) }}</td></tr>
              <tr><td class="pl"><strong>Age</strong></td><td>{{ patient.age || '—' }}</td><td class="pl"><strong>Religion</strong></td><td>{{ patient.religion || '—' }}</td></tr>
              <tr><td class="pl"><strong>Mobile</strong></td><td>{{ patient.mobile || '—' }}</td><td class="pl"><strong>Landline</strong></td><td>{{ patient.landline || '—' }}</td></tr>
              <tr><td class="pl"><strong>Email</strong></td><td colspan="3">{{ patient.email || '—' }}</td></tr>
            </tbody>
          </table>
        </template>
        <template v-if="printMode === 'visits'">
          <table class="print-appt-table">
            <thead><tr><th>ID</th><th>Doctor</th><th>Date</th><th>Time</th><th>Notes</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="a in appointments" :key="a.id">
                <td>{{ a.appointment_id }}</td><td>{{ a.doctor || '—' }}</td>
                <td>{{ formatDate(a.appointment_date) }}</td><td>{{ a.appointment_time || '—' }}</td>
                <td>{{ a.condition_notes || a.note || '—' }}</td><td>{{ a.status }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="appointments.length === 0" style="color:#666;font-size:13px">No records found.</p>
        </template>
        <template v-if="printMode === 'prescriptions'">
          <table class="print-appt-table">
            <thead><tr><th>Rx ID</th><th>Medication</th><th>Dosage</th><th>Instructions</th><th>Prescribed By</th><th>Date</th></tr></thead>
            <tbody>
              <tr v-for="rx in prescriptions" :key="rx.id">
                <td>RX-{{ String(rx.id).padStart(4,'0') }}</td>
                <td>{{ rx.medication }}</td>
                <td>{{ rx.dosage || '—' }}</td>
                <td>{{ rx.instructions || '—' }}</td>
                <td>{{ rx.prescribed_by || '—' }}</td>
                <td>{{ formatDate(rx.prescribed_date) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="prescriptions.length === 0" style="color:#666;font-size:13px">No prescriptions found.</p>
        </template>
        <div class="print-footer"><p>CareQueue Medical Information System — Confidential</p></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientRecord',
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
      activeTab: 'visits',
      loading: true,
      loadingRx: false,
      savingRx: false,
      patient: null,
      appointments: [],
      prescriptions: [],
      reports: [],
      viewingAppt: null,
      printMode: 'visits',
      printTitle: '',
      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),

      /* ── Prescribe modal state ── */
      prescribeModal: {
        open: false,
        appt: null,
        prescribed_by: '',
        medications: [{ medication: '', dosage: '', instructions: '' }]
      },

      /* ── New-report modal state ── */
      reportModal: {
        open: false,
        title: '',
        type: 'Lab Result',
        created_by: '',
        notes: ''
      }
    }
  },
  computed: {
    isAdmin() { return localStorage.getItem('role') === 'admin' }
  },
  beforeUnmount() {
    clearInterval(this._notifPoll)
  },

  async mounted() {
    await this.fetchPatient(this.$route.params.id)
    this.fetchNotifications()
    fetch('http://${import.meta.env.VITE_API_BASE}/doctors').then(r=>r.json()).then(d=>{this.doctors=d}).catch(()=>{})
    this._notifPoll = setInterval(() => this.fetchNotifications(), 30000)
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

    /* ── Data fetching ── */
    async fetchPatient(id) {
      this.loading = true
      try {
        const role = localStorage.getItem('role')
        const user = JSON.parse(localStorage.getItem('user')) || {}
        const doctorParam = role !== 'admin' && user.name
          ? `?doctor=${encodeURIComponent(user.name.replace(/^Dr\.\s*/i, ''))}`
          : ''
        const [pRes, aRes] = await Promise.all([
          fetch(`http://${import.meta.env.VITE_API_BASE}/patients/${id}`),
          fetch(`http://${import.meta.env.VITE_API_BASE}/appointments${doctorParam}`),
        ])
        this.patient = await pRes.json()
        const allAppts = await aRes.json()
        this.appointments = allAppts.filter(a =>
          a.first_name === this.patient.first_name && a.last_name === this.patient.last_name
        )
        // pre-fill prescribed_by with logged-in user name
        this.prescribeModal.prescribed_by = this.currentUser.name || ''
        this.reportModal.created_by       = this.currentUser.name || ''
      } catch (err) {
        console.error('Failed to load patient:', err)
        this.patient = null
      } finally {
        this.loading = false
      }
    },

    async fetchPrescriptions() {
      if (!this.patient) return
      this.loadingRx = true
      try {
        const role = localStorage.getItem('role')
        const user = JSON.parse(localStorage.getItem('user')) || {}
        const doctorParam = role !== 'admin' && user.name
          ? `&doctor=${encodeURIComponent(user.name.replace(/^Dr\.\s*/i, ''))}`
          : ''
        const res = await fetch(`http://${import.meta.env.VITE_API_BASE}/prescriptions?patient_id=${this.patient.id}${doctorParam}`)
        this.prescriptions = await res.json()
      } catch (err) {
        console.error('Failed to load prescriptions:', err)
        this.prescriptions = []
      } finally {
        this.loadingRx = false
      }
    },

    switchTab(tab) {
      this.activeTab = tab
      if (tab === 'prescriptions') this.fetchPrescriptions()
    },

    /* ── Appointment detail ── */
    viewAppointment(appt) { this.viewingAppt = appt },

    /* ── Prescribe modal ── */
    openPrescribeModal(appt) {
      this.prescribeModal.open = true
      this.prescribeModal.appt = appt
      this.prescribeModal.medications = [{ medication: '', dosage: '', instructions: '' }]
      this.prescribeModal.prescribed_by = this.currentUser.name || ''
    },
    closePrescribeModal() { this.prescribeModal.open = false },
    addMed() { this.prescribeModal.medications.push({ medication: '', dosage: '', instructions: '' }) },
    removeMed(idx) { this.prescribeModal.medications.splice(idx, 1) },

    async savePrescriptions() {
      const filled = this.prescribeModal.medications.filter(m => m.medication.trim())
      if (!filled.length) { alert('Please enter at least one medication name.'); return }

      this.savingRx = true
      try {
        const today = new Date().toISOString().slice(0, 10)
        await Promise.all(
          filled.map(med =>
            fetch('http://${import.meta.env.VITE_API_BASE}/prescriptions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                patient_id:     this.patient.id,
                appointment_id: this.prescribeModal.appt?.id || null,
                medication:     med.medication.trim(),
                dosage:         med.dosage.trim()        || null,
                instructions:   med.instructions.trim()  || null,
                prescribed_by:  this.prescribeModal.prescribed_by.trim() || null,
                prescribed_date: today
              })
            })
          )
        )
        this.closePrescribeModal()
        // Navigate to Prescriptions tab and reload
        await this.fetchPrescriptions()
        this.activeTab = 'prescriptions'
      } catch (err) {
        alert('Failed to save prescription. Please try again.')
        console.error(err)
      } finally {
        this.savingRx = false
      }
    },

    /* ── Reports ── */
    openNewReportModal() {
      this.reportModal = {
        open: true,
        title: '',
        type: 'Lab Result',
        created_by: this.currentUser.name || '',
        notes: ''
      }
    },
    closeReportModal() { this.reportModal.open = false },
    saveReport() {
      if (!this.reportModal.title.trim()) { alert('Please enter a report title.'); return }
      this.reports.push({
        title:      this.reportModal.title.trim(),
        type:       this.reportModal.type,
        created_by: this.reportModal.created_by.trim() || 'Unknown',
        notes:      this.reportModal.notes.trim(),
        date:       new Date().toISOString()
      })
      this.closeReportModal()
    },
    handleImportFile(e) {
      const file = e.target.files[0]
      if (!file) return
      this.reports.push({
        title:      file.name,
        type:       'Imported File',
        created_by: this.currentUser.name || 'Unknown',
        notes:      '',
        date:       new Date().toISOString()
      })
      // reset input so same file can be imported again if needed
      this.$refs.fileInput.value = ''
    },
    removeReport(idx) {
      if (confirm('Remove this report entry?')) this.reports.splice(idx, 1)
    },

    /* ── Print ── */
    printTab(tab) {
      const titles = { visits: 'Past Visits', prescriptions: 'Prescriptions', reports: 'Reports', profile: 'Patient Profile' }
      this.printMode = tab
      this.printTitle = titles[tab]
      this.$nextTick(() => {
        const orig = document.body.innerHTML
        document.body.innerHTML = document.getElementById('print-section').innerHTML
        window.print()
        document.body.innerHTML = orig
        window.location.reload()
      })
    },
    printAppointment() {
      this.printMode = 'visits'
      this.printTitle = 'Appointment Detail'
      this.$nextTick(() => {
        const orig = document.body.innerHTML
        document.body.innerHTML = document.getElementById('print-section').innerHTML
        window.print()
        document.body.innerHTML = orig
        window.location.reload()
      })
    },

    /* ── Formatters ── */
    formatDate(d) {
      if (!d) return 'N/A'
      return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    formatDateTime(date, time) {
      if (!date) return '—'
      const d = new Date(date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
      return time ? `${d} ${time}` : d
    },
    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.layout { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }
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
.role-tag { display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #3aa6a6; font-size: 12px; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.06); margin-top: auto; }
.main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { height: 60px; background: #3aa6a6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 100; }
.hamburger { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 6px; border-radius: 8px; }
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
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; }
.dropdown-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
.account-dropdown { width: 220px; }
.account-info { flex-direction: column; align-items: flex-start !important; gap: 3px; }
.account-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.account-email { font-size: 11px; color: #94a3b8; }
.role-pill { margin-top: 4px; font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
.role-pill.admin { background: #dbeafe; color: #1d4ed8; }
.role-pill.doctor { background: #d1fae5; color: #065f46; }
.dropdown-divider { border: none; border-top: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-item:hover { background: #f8fafc; }
.access-denied-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; text-align: center; padding: 40px; }
.access-denied-icon { width: 100px; height: 100px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #dc2626; }
.access-denied-title { font-size: 24px; font-weight: 700; color: #1e293b; }
.access-denied-text { font-size: 14px; color: #64748b; max-width: 400px; line-height: 1.7; }
.btn-go-back { padding: 11px 28px; background: #3aa6a6; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-go-back:hover { background: #2e8b8b; }
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.breadcrumb-link { color: #3aa6a6; cursor: pointer; text-decoration: underline; }
.page-header { margin-bottom: 20px; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px; color: #94a3b8; }
.loading-mini { display: flex; align-items: center; gap: 10px; padding: 40px; justify-content: center; color: #94a3b8; font-size: 13px; }
.spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
.spinner-sm { width: 16px; height: 16px; border: 2px solid #e2e8f0; border-top-color: #3aa6a6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.record-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }
.patient-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.patient-card-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; }
.patient-photo-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
.patient-photo { width: 120px; height: 120px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; border: 3px solid #f1f5f9; }
.record-nav { display: flex; flex-direction: column; gap: 4px; }
.record-nav-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; background: none; border: none; text-align: left; font-size: 13.5px; font-weight: 500; color: #64748b; cursor: pointer; border-radius: 10px; font-family: inherit; transition: all 0.2s; }
.record-nav-item:hover { background: #f0fafa; color: #3aa6a6; }
.record-nav-item.active { background: #3aa6a6; color: white; }
.right-panel { min-width: 0; overflow: hidden; }
.panel-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.panel-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
.panel-title { font-size: 15px; font-weight: 700; color: #1e293b; }
.toolbar-btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
.action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.action-btn.teal  { background: #3aa6a6; color: white; }
.action-btn.teal:hover  { background: #2e8b8b; }
.action-btn.blue  { background: #3b82f6; color: white; }
.action-btn.blue:hover  { background: #2563eb; }
.action-btn.green { background: #16a34a; color: white; }
.action-btn.green:hover { background: #15803d; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 10px 14px; color: #64748b; font-weight: 600; font-size: 12px; border-bottom: 2px solid #f1f5f9; }
.data-table td { padding: 12px 14px; color: #475569; border-bottom: 1px solid #f8fafc; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8fafc; }
.mono { font-family: monospace; font-size: 12px; color: #94a3b8; }
.notes-cell { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: #64748b; }
.row-actions { display: flex; gap: 6px; }
.btn-sm { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; border: 1.5px solid; }
.btn-sm.view     { color: #3aa6a6; border-color: #3aa6a6; background: white; }
.btn-sm.view:hover { background: #3aa6a6; color: white; }
.btn-sm.prescribe { display: inline-flex; align-items: center; gap: 4px; color: #7c3aed; border-color: #7c3aed; background: white; }
.btn-sm.prescribe:hover { background: #7c3aed; color: white; }
.btn-sm.del      { color: #ef4444; border-color: #ef4444; background: white; }
.btn-sm.del:hover { background: #ef4444; color: white; }
.status-badge { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; text-transform: capitalize; }
.status-badge.waiting   { color: #ea580c; background: #ffedd5; }
.status-badge.approved  { color: #0369a1; background: #e0f2fe; }
.status-badge.arrived   { color: #6c63ff; background: #ede9fe; }
.status-badge.completed { color: #16a34a; background: #dcfce7; }
.status-badge.cancelled { color: #dc2626; background: #fee2e2; }
.empty-panel { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #94a3b8; text-align: center; }
.empty-panel p { font-size: 13px; }
/* Reports list */
.reports-list { display: flex; flex-direction: column; gap: 10px; }
.report-row { display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px; border: 1.5px solid #f1f5f9; border-radius: 12px; transition: border-color 0.2s; }
.report-row:hover { border-color: #3aa6a6; }
.report-icon-wrap { width: 40px; height: 40px; background: #f0fafa; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #3aa6a6; flex-shrink: 0; }
.report-info { flex: 1; min-width: 0; }
.report-title { font-size: 13.5px; font-weight: 600; color: #1e293b; margin-bottom: 3px; }
.report-meta  { font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
.report-notes { font-size: 12px; color: #64748b; line-height: 1.5; white-space: pre-wrap; }
/* Profile */
.profile-section-title { font-size: 11px; font-weight: 700; color: #3aa6a6; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 8px; border-bottom: 1.5px solid #e2e8f0; margin: 18px 0 12px; }
.profile-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 8px; }
.profile-grid.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.profile-grid.cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.profile-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.profile-field { display: flex; flex-direction: column; gap: 4px; }
.profile-field.span-2 { grid-column: span 2; }
.profile-field label { font-size: 11px; font-weight: 600; color: #374151; }
.profile-field input { width: 100%; padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; background: #f8fafc; font-family: inherit; outline: none; min-width: 0; }
.radio-group { display: flex; gap: 14px; padding: 8px 0; }
.radio-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #475569; }
/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; }
.modal { background: white; border-radius: 16px; width: 480px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden; }
.modal-wide { width: 580px; }
.modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
.modal-subtitle { font-size: 11px; color: #94a3b8; margin-top: 3px; }
.modal-close { background: none; border: none; font-size: 16px; color: #94a3b8; cursor: pointer; flex-shrink: 0; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
.detail-row:last-child { border-bottom: none; }
.detail-label { color: #94a3b8; font-weight: 500; }
.detail-value { color: #1e293b; font-weight: 600; text-align: right; }
.btn-cancel { padding: 9px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-print-confirm { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
/* Prescribe form */
.rx-banner { display: flex; align-items: center; gap: 10px; background: #f5f3ff; border: 1.5px solid #ddd6fe; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #5b21b6; }
.med-block { background: #fafafa; border: 1.5px solid #f1f5f9; border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.med-block-header { display: flex; justify-content: space-between; align-items: center; }
.med-index { font-size: 11px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px; }
.btn-remove-med { background: none; border: none; font-size: 11px; color: #ef4444; cursor: pointer; font-weight: 600; font-family: inherit; }
.btn-remove-med:hover { text-decoration: underline; }
.med-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }
.btn-add-med { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: white; border: 1.5px dashed #7c3aed; border-radius: 8px; font-size: 12px; font-weight: 600; color: #7c3aed; cursor: pointer; font-family: inherit; align-self: flex-start; }
.btn-add-med:hover { background: #f5f3ff; }
.btn-save-rx { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; background: #7c3aed; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-save-rx:disabled { opacity: 0.6; cursor: not-allowed; }
.form-field { display: flex; flex-direction: column; gap: 5px; }
.form-field label { font-size: 11px; font-weight: 600; color: #374151; }
.form-input { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; font-family: inherit; outline: none; background: white; width: 100%; transition: border-color 0.2s; }
.form-input:focus { border-color: #7c3aed; }
select.form-input { cursor: pointer; }
.form-textarea { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; font-family: inherit; outline: none; resize: vertical; width: 100%; transition: border-color 0.2s; }
.form-textarea:focus { border-color: #7c3aed; }
.req { color: #ef4444; }
.not-found { text-align: center; padding: 60px; color: #94a3b8; }
.back-link { color: #3aa6a6; cursor: pointer; text-decoration: underline; }
/* Print */
@media print {
  body * { visibility: hidden; }
  #print-section, #print-section * { visibility: visible; }
  #print-section { position: fixed; left: 0; top: 0; width: 100%; }
}
.print-doc { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
.print-header { border-bottom: 2px solid #3aa6a6; padding-bottom: 12px; margin-bottom: 16px; }
.print-header h1 { font-size: 20px; color: #3aa6a6; }
.print-header p { font-size: 12px; color: #64748b; margin-top: 4px; }
.print-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
.print-table td { padding: 8px 12px; border: 1px solid #e2e8f0; }
.print-table .pl { background: #f8fafc; width: 140px; }
.print-appt-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.print-appt-table th { background: #3aa6a6; color: white; padding: 8px 10px; text-align: left; }
.print-appt-table td { padding: 8px 10px; border: 1px solid #e2e8f0; }
.print-appt-table tr:nth-child(even) td { background: #f8fafc; }
.print-footer { border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 10px; font-size: 11px; color: #94a3b8; }
@media (max-width: 900px) {
  .record-layout { grid-template-columns: 1fr; }
  .profile-grid { grid-template-columns: 1fr 1fr; }
  .profile-grid.cols-5 { grid-template-columns: 1fr 1fr; }
  .med-grid { grid-template-columns: 1fr 1fr; }
  .col-span-2, .col-span-3 { grid-column: span 2; }
}
</style>