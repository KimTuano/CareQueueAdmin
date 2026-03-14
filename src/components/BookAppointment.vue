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
              <button class="dropdown-item" @click="goTo('edit-account')"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>Edit Account</button>
              <button class="dropdown-item" @click="goTo('settings')"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Settings</button>
              <hr class="dropdown-divider"/>
              <button class="dropdown-item logout" @click="handleLogout"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>Logout</button>
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
          <p class="access-denied-msg">You don't have permission to book appointments. Please contact your administrator to request access.</p>
        </div>
      </main>

      <!-- ── PAGE CONTENT ── -->
      <main v-else class="content">
        <div class="page-header">
          <h1 class="page-title">Book Appointment</h1>
          <p class="breadcrumb">Appointments / Book Appointment</p>
        </div>

        <div class="form-card">
          <!-- Card Header -->
          <div class="form-card-header">
            <div class="form-card-title-group">
              <h2 class="section-title">PATIENT INFORMATION</h2>
              <div v-if="selectedPatient" class="existing-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Existing Patient — {{ selectedPatient.patient_id }}
                <button class="clear-existing" @click="clearExistingPatient" title="Clear selection">✕</button>
              </div>
            </div>
            <div class="header-actions">
              <button class="btn-lookup-toggle" :class="{ active: lookupOpen }" @click="lookupOpen = !lookupOpen">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ lookupOpen ? 'Hide Record Check' : 'Check Existing Record' }}
              </button>
              <div class="dropdown-wrapper" v-click-outside="() => actionsOpen = false">
                <button class="teal-btn" @click="actionsOpen = !actionsOpen">
                  Actions
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="toolbar-dropdown" v-show="actionsOpen">
                  <button class="toolbar-dropdown-item" @click="clearForm(); actionsOpen = false">Clear Form</button>
                </div>
              </div>
              <button class="teal-btn" @click="handleSubmit" :disabled="submitting">
                {{ submitting ? 'Submitting...' : 'Submit' }}
              </button>
            </div>
          </div>

          <!-- ── COLLAPSIBLE RECORD CHECK PANEL ── -->
          <div class="lookup-panel" v-show="lookupOpen">
            <div class="lookup-inner">
              <p class="lookup-desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="vertical-align:middle;margin-right:4px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Search by name, mobile, or email to check if the patient already has a record. Clicking a result will auto-fill the form below.
              </p>
              <div class="lookup-search-row">
                <input type="text" v-model="lookupQuery" @keyup.enter="searchPatient" @input="onLookupInput" placeholder="Search by name, mobile, or email..." class="lookup-input" />
                <button class="lookup-btn" @click="searchPatient">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  Search
                </button>
              </div>
              <div v-if="lookupSearched" class="lookup-result">
                <div v-if="lookupResults.length > 0">
                  <div class="result-badge found">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {{ lookupResults.length }} record(s) found — click a result to auto-fill the form
                  </div>
                  <div class="result-list">
                    <div v-for="pt in lookupResults" :key="pt.id" class="result-item" :class="{ selected: selectedPatient && selectedPatient.id === pt.id }" @click="applyExistingPatient(pt)">
                      <div class="result-avatar"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
                      <div class="result-info">
                        <p class="result-name">{{ pt.first_name }} {{ pt.middle_name || '' }} {{ pt.last_name }}</p>
                        <p class="result-meta">{{ pt.patient_id }} · {{ pt.mobile || '—' }} · {{ pt.email || '—' }}</p>
                      </div>
                      <div v-if="selectedPatient && selectedPatient.id === pt.id" class="result-check"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Auto-filled</div>
                      <span v-else class="result-use">Use →</span>
                    </div>
                  </div>
                </div>
                <div v-else class="result-badge not-found">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  No existing record found — this is a new patient. Fill in the form below.
                </div>
              </div>
            </div>
          </div>

          <hr class="section-divider" />

          <!-- ── PATIENT INFORMATION FIELDS ── -->
          <div class="form-grid-4">
            <div class="field-group" :class="{ 'has-error': touched.lastName && !form.lastName.trim() }">
              <label>Last Name <span class="req">*</span></label>
              <input type="text" v-model="form.lastName" placeholder="Last name" @blur="touch('lastName')" />
              <span class="field-error" v-if="touched.lastName && !form.lastName.trim()">Last name is required.</span>
            </div>
            <div class="field-group" :class="{ 'has-error': touched.firstName && !form.firstName.trim() }">
              <label>First Name <span class="req">*</span></label>
              <input type="text" v-model="form.firstName" placeholder="First name" @blur="touch('firstName')" />
              <span class="field-error" v-if="touched.firstName && !form.firstName.trim()">First name is required.</span>
            </div>
            <div class="field-group">
              <label>Middle Name</label>
              <input type="text" v-model="form.middleName" placeholder="Middle name" />
            </div>
            <div class="field-group">
              <label>Name Extension</label>
              <input type="text" v-model="form.nameExtension" placeholder="Jr., Sr., III" />
            </div>
          </div>

          <div class="form-row-inline">
            <div class="field-group gender-group">
              <label>Gender</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" v-model="form.gender" value="Male" /> Male</label>
                <label class="radio-label"><input type="radio" v-model="form.gender" value="Female" /> Female</label>
              </div>
            </div>
            <div class="field-group dob-group">
              <label>Date of Birth</label>
              <input type="date" v-model="form.dateOfBirth" />
            </div>
            <div class="field-group age-group">
              <label>Age</label>
              <input type="number" v-model="form.age" min="0" placeholder="Age" />
            </div>
            <div class="field-group religion-group">
              <label>Religion</label>
              <input type="text" v-model="form.religion" placeholder="Religion" />
            </div>
          </div>

          <div class="form-grid-3">
            <!-- Landline -->
            <div class="field-group" :class="{ 'has-error': touched.landline && form.landline && !isValidLandline(form.landline) }">
              <label>Landline Number</label>
              <div class="input-with-prefix">
                <input
                  type="tel"
                  v-model="form.landline"
                  placeholder="e.g. 02-8123-4567"
                  @input="formatLandline"
                  @blur="touch('landline')"
                  maxlength="13"
                  class="prefixed-input"
                />
              </div>
              <span class="field-hint">Format: 02-XXXX-XXXX or (area)-XXXX-XXXX</span>
              <span class="field-error" v-if="touched.landline && form.landline && !isValidLandline(form.landline)">
                Enter a valid PH landline (e.g. 02-8123-4567).
              </span>
            </div>

            <!-- Mobile -->
            <div class="field-group" :class="{ 'has-error': touched.mobile && form.mobile && !isValidMobile(form.mobile), 'has-success': form.mobile && isValidMobile(form.mobile) }">
              <label>Mobile Number <span class="req">*</span></label>
              <div class="input-with-prefix" :class="{ 'prefix-error': touched.mobile && form.mobile && !isValidMobile(form.mobile), 'prefix-success': form.mobile && isValidMobile(form.mobile) }">
                <span class="input-prefix">
                  <img src="https://flagcdn.com/w20/ph.png" alt="PH" class="flag-icon" />
                  +63
                </span>
                <input
                  type="tel"
                  v-model="form.mobile"
                  placeholder="09XX-XXX-XXXX"
                  @input="formatMobile"
                  @blur="touch('mobile')"
                  maxlength="13"
                  class="prefixed-input"
                />
                <!-- Inline status icon -->
                <span class="input-status-icon" v-if="form.mobile">
                  <svg v-if="isValidMobile(form.mobile)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#16a34a"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#ef4444"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </span>
              </div>
              <span class="field-hint">Philippine mobile: 09XX-XXX-XXXX (Globe, Smart, Sun, DITO)</span>
              <span class="field-error" v-if="touched.mobile && form.mobile && !isValidMobile(form.mobile)">
                Enter a valid PH mobile number (e.g. 0917-123-4567).
              </span>
              <span class="field-success" v-if="form.mobile && isValidMobile(form.mobile)">
                Valid Philippine mobile number ✓
              </span>
            </div>

            <!-- Email -->
            <div class="field-group" :class="{ 'has-error': touched.email && form.email && !isValidEmail(form.email), 'has-success': form.email && isValidEmail(form.email) }">
              <label>Email Address <span class="req">*</span></label>
              <div class="input-with-icon" :class="{ 'icon-error': touched.email && form.email && !isValidEmail(form.email), 'icon-success': form.email && isValidEmail(form.email) }">
                <span class="input-left-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </span>
                <input
                  type="email"
                  v-model="form.email"
                  placeholder="example@email.com"
                  @blur="touch('email')"
                  @input="clearEmailError"
                  class="icon-input"
                />
                <span class="input-status-icon" v-if="form.email">
                  <svg v-if="isValidEmail(form.email)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#16a34a"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#ef4444"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </span>
              </div>
              <span class="field-hint">e.g. juan.delacruz@gmail.com</span>
              <span class="field-error" v-if="touched.email && form.email && !isValidEmail(form.email)">
                Enter a valid email address (e.g. name@domain.com).
              </span>
              <span class="field-success" v-if="form.email && isValidEmail(form.email)">
                Valid email address ✓
              </span>
            </div>
          </div>

          <hr class="section-divider" />

          <!-- ── APPOINTMENT DETAILS ── -->
          <h2 class="section-title" style="margin-bottom: 16px;">APPOINTMENT DETAILS</h2>

          <div class="form-grid-3">
            <div class="field-group" :class="{ 'has-error': touched.doctor && !form.doctor }">
              <label>Consulting Doctor <span class="req">*</span></label>
              <select v-model="form.doctor" @blur="touch('doctor')">
                <option value="" disabled>Select Doctor</option>
                <option v-for="doc in doctors" :key="doc.id" :value="`Dr. ${doc.first_name} ${doc.last_name}`">
                  Dr. {{ doc.first_name }} {{ doc.last_name }} — {{ doc.specialization }}
                </option>
              </select>
              <span class="field-error" v-if="touched.doctor && !form.doctor">Please select a doctor.</span>
            </div>
            <div class="field-group" :class="{ 'has-error': touched.appointmentDate && !form.appointmentDate }">
              <label>Date of Appointment <span class="req">*</span></label>
              <input type="date" v-model="form.appointmentDate" @blur="touch('appointmentDate')" :min="todayStr" />
              <span class="field-error" v-if="touched.appointmentDate && !form.appointmentDate">Please select a date.</span>
            </div>
            <div class="field-group" :class="{ 'has-error': touched.appointmentTime && !form.appointmentTime }">
              <label>Time of Appointment <span class="req">*</span></label>
              <input type="time" v-model="form.appointmentTime" @blur="touch('appointmentTime')" />
              <span class="field-error" v-if="touched.appointmentTime && !form.appointmentTime">Please select a time.</span>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="field-group">
              <label>Injury / Condition</label>
              <textarea v-model="form.condition" rows="3" placeholder="Describe the condition or injury..."></textarea>
            </div>
            <div class="field-group">
              <label>Note</label>
              <textarea v-model="form.note" rows="3" placeholder="Any additional notes..."></textarea>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- ── SUCCESS MODAL ── -->
    <div class="modal-overlay" v-if="showSuccess" @click.self="showSuccess = false">
      <div class="modal">
        <div class="modal-icon success">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3>Appointment Booked!</h3>
        <p>The appointment has been successfully submitted and is now <strong>waiting for approval</strong>.</p>
        <div class="modal-details">
          <div class="modal-detail-row"><span>Patient</span><strong>{{ submittedData.name }}</strong></div>
          <div class="modal-detail-row"><span>Doctor</span><strong>{{ submittedData.doctor }}</strong></div>
          <div class="modal-detail-row"><span>Date</span><strong>{{ submittedData.date }}</strong></div>
          <div class="modal-detail-row"><span>Time</span><strong>{{ submittedData.time }}</strong></div>
          <div class="modal-detail-row">
            <span>Type</span>
            <strong class="badge" :class="submittedData.type">{{ submittedData.type === 'new' ? 'New Patient' : 'Existing Patient' }}</strong>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-modal-secondary" @click="bookAnother">Book Another</button>
          <button class="btn-modal-primary" @click="$router.push('/appointments/all')">View All Appointments</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const API = 'https://carequeue-admin.com/api'

export default {
  name: 'BookAppointment',
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
      notifLoading: false,
      notifications: [],
      unreadCount: 0,
      notifCompose: false,
      notifForm: { target: '', title: '', body: '' },
      accountOpen: false,
      appointmentsOpen: true,
      actionsOpen: false,

      currentUser: JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' },
      livePerms: JSON.parse(localStorage.getItem('doctorPermissions') || '{}'),

      lookupOpen: false,
      lookupQuery: '',
      lookupResults: [],
      lookupSearched: false,
      selectedPatient: null,

      doctors: [],

      form: {
        lastName: '', firstName: '', middleName: '', nameExtension: '',
        gender: '', dateOfBirth: '', age: '', religion: '',
        landline: '', mobile: '', email: '',
        doctor: '', appointmentDate: '', appointmentTime: '',
        condition: '', note: ''
      },

      // Tracks which fields have been blurred/touched
      touched: {
        lastName: false, firstName: false, mobile: false,
        email: false, landline: false, doctor: false,
        appointmentDate: false, appointmentTime: false
      },

      submitting: false,
      showSuccess: false,
      submittedData: {}
    }
  },
  computed: {
    isAdmin() { return localStorage.getItem('role') === 'admin' },
    canAccess() { return this.isAdmin || this.doctorCan('book_appointment') },
    todayStr() {
      return new Date().toISOString().split('T')[0]
    }
  },
  beforeUnmount() {
    clearInterval(this._notifPoll)
  },

  mounted() {
    this.fetchDoctors()
    this.fetchNotifications()
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

    // ── Touch a field (mark as visited) ───────────────
    touch(field) { this.touched[field] = true },

    // ── Validation helpers ─────────────────────────────

    /**
     * Valid PH mobile: 09XX-XXX-XXXX or 09XXXXXXXXX (11 digits starting with 09)
     * Accepts formatted (with dashes) or raw digits.
     * Prefixes: 0906–0909 (Sun), 0910–0918 (Smart/TNT), 0919–0928 (Smart),
     *           0929–0939 (Smart), 0946–0949 (DITO), 0951–0959 (Sun),
     *           0961–0969 (Smart), 0970–0979 (Globe), 0990–0999 (Globe/TM),
     *           0895–0898 (DITO), etc.
     * We keep it simple: must start with 09, exactly 11 digits total.
     */
    isValidMobile(val) {
      if (!val) return false
      const digits = val.replace(/\D/g, '')
      return /^09\d{9}$/.test(digits)
    },

    /**
     * Valid PH landline: area code + 7-digit local number
     * Examples: 02-8XXX-XXXX (Metro Manila), 032-XXXX-XXXX (Cebu)
     * We accept 7–8 digit local numbers with optional area code.
     */
    isValidLandline(val) {
      if (!val) return true // landline is optional
      const digits = val.replace(/\D/g, '')
      // Metro Manila: 02 + 8 digits = 10, or province: 2-3 digit area + 7 digits = 9-10
      return digits.length >= 7 && digits.length <= 11
    },

    isValidEmail(val) {
      if (!val) return false
      // RFC-compliant basic check
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim())
    },

    // ── Auto-format mobile as 09XX-XXX-XXXX ───────────
    formatMobile(e) {
      let val = e.target.value.replace(/\D/g, '').slice(0, 11)
      if (val.length > 7) {
        val = val.slice(0, 4) + '-' + val.slice(4, 7) + '-' + val.slice(7)
      } else if (val.length > 4) {
        val = val.slice(0, 4) + '-' + val.slice(4)
      }
      this.form.mobile = val
    },

    // ── Auto-format landline as XX-XXXX-XXXX ──────────
    formatLandline(e) {
      let val = e.target.value.replace(/\D/g, '').slice(0, 11)
      // Simple grouping: area-local4-local4 or area-local3-local4
      if (val.length > 6) {
        val = val.slice(0, 2) + '-' + val.slice(2, 6) + '-' + val.slice(6)
      } else if (val.length > 2) {
        val = val.slice(0, 2) + '-' + val.slice(2)
      }
      this.form.landline = val
    },

    clearEmailError() { /* reactive — nothing needed, computed keeps up */ },

    // ── Touch all required fields before submit ────────
    touchAll() {
      Object.keys(this.touched).forEach(k => { this.touched[k] = true })
    },

    goTo(page) {
      this.accountOpen = false
      if (page === 'edit-account') this.$router.push('/edit-profile')
    },
    handleLogout() {
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorPermissions')
      this.$router.push('/')
    },

    async fetchDoctors() {
      try {
        const res = await fetch(`${API}/doctors`)
        this.doctors = await res.json()
      } catch (e) { console.error('Failed to fetch doctors', e) }
    },

    onLookupInput() {
      if (!this.lookupQuery) { this.lookupSearched = false; this.lookupResults = [] }
    },

    async searchPatient() {
      if (!this.lookupQuery.trim()) return
      try {
        const res = await fetch(`${API}/patients/search?q=${encodeURIComponent(this.lookupQuery)}`)
        this.lookupResults = await res.json()
        this.lookupSearched = true
      } catch (e) { alert('Search failed. Make sure the server is running.') }
    },

    applyExistingPatient(pt) {
      this.selectedPatient  = pt
      this.form.lastName      = pt.last_name      || ''
      this.form.firstName     = pt.first_name     || ''
      this.form.middleName    = pt.middle_name     || ''
      this.form.nameExtension = pt.name_extension  || ''
      this.form.gender        = pt.gender          || ''
      this.form.dateOfBirth   = pt.date_of_birth   || ''
      this.form.age           = pt.age             || ''
      this.form.religion      = pt.religion        || ''
      this.form.landline      = pt.landline        || ''
      this.form.mobile        = pt.mobile          || ''
      this.form.email         = pt.email           || ''
      this.lookupOpen = false
    },

    clearExistingPatient() { this.selectedPatient = null },

    clearForm() {
      Object.keys(this.form).forEach(k => this.form[k] = '')
      Object.keys(this.touched).forEach(k => this.touched[k] = false)
      this.selectedPatient = null
      this.lookupQuery = ''
      this.lookupResults = []
      this.lookupSearched = false
    },

    async handleSubmit() {
      this.touchAll()

      // Required field checks
      if (!this.form.firstName.trim() || !this.form.lastName.trim()) {
        return this.scrollToFirstError('First name and last name are required.')
      }
      if (!this.form.doctor)          return this.scrollToFirstError('Please select a consulting doctor.')
      if (!this.form.appointmentDate) return this.scrollToFirstError('Please select an appointment date.')
      if (!this.form.appointmentTime) return this.scrollToFirstError('Please select an appointment time.')

      // Format validations (only if field has a value)
      if (this.form.mobile && !this.isValidMobile(this.form.mobile)) {
        return this.scrollToFirstError('Mobile number must be a valid Philippine number (e.g. 0917-123-4567).')
      }
      if (this.form.email && !this.isValidEmail(this.form.email)) {
        return this.scrollToFirstError('Please enter a valid email address (e.g. name@domain.com).')
      }

      this.submitting = true
      try {
        const patientType = this.selectedPatient ? 'existing' : 'new'
        const payload = {
          patient_id:       this.selectedPatient ? this.selectedPatient.id : null,
          patient_type:     patientType,
          last_name:        this.form.lastName,
          first_name:       this.form.firstName,
          middle_name:      this.form.middleName,
          name_extension:   this.form.nameExtension,
          gender:           this.form.gender,
          date_of_birth:    this.form.dateOfBirth,
          age:              this.form.age,
          religion:         this.form.religion,
          landline:         this.form.landline,
          mobile:           this.form.mobile,
          email:            this.form.email,
          doctor:           this.form.doctor,
          appointment_date: this.form.appointmentDate,
          appointment_time: this.form.appointmentTime,
          condition_notes:  this.form.condition,
          note:             this.form.note
        }
        const res = await fetch(`${API}/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        this.submittedData = {
          name:   `${this.form.firstName} ${this.form.lastName}`,
          doctor: this.form.doctor,
          date:   this.form.appointmentDate,
          time:   this.form.appointmentTime,
          type:   patientType
        }
        this.showSuccess = true
      } catch (e) {
        alert('Failed to submit: ' + e.message)
      } finally {
        this.submitting = false
      }
    },

    scrollToFirstError(msg) {
      // Find the first .has-error element and scroll to it
      this.$nextTick(() => {
        const el = document.querySelector('.has-error')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        else alert(msg)
      })
    },

    bookAnother() {
      this.showSuccess = false
      this.clearForm()
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

/* ACCESS DENIED */
.access-denied { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 16px; }
.access-denied-icon { width: 96px; height: 96px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; }
.access-denied-title { font-size: 20px; font-weight: 700; color: #1e293b; }
.access-denied-msg { font-size: 14px; color: #64748b; max-width: 380px; line-height: 1.6; }

/* ── CONTENT ── */
.content { padding: 28px; flex: 1; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
.breadcrumb { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.page-header { margin-bottom: 20px; }

/* ── FORM CARD ── */
.form-card { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.form-card-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 0; }
.form-card-title-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.section-title { font-size: 14px; font-weight: 700; color: #1e293b; letter-spacing: 0.5px; }
.existing-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; background: #dcfce7; color: #166534; border-radius: 20px; font-size: 12px; font-weight: 600; }
.clear-existing { background: none; border: none; cursor: pointer; color: #166534; font-size: 12px; margin-left: 2px; padding: 0; opacity: 0.7; line-height: 1; }
.clear-existing:hover { opacity: 1; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.btn-lookup-toggle { display: flex; align-items: center; gap: 6px; padding: 9px 16px; background: white; color: #3aa6a6; border: 1.5px solid #3aa6a6; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap; }
.btn-lookup-toggle:hover, .btn-lookup-toggle.active { background: #f0fafa; }
.teal-btn { display: flex; align-items: center; gap: 6px; padding: 9px 20px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; white-space: nowrap; }
.teal-btn:hover:not(:disabled) { background: #2e8b8b; }
.teal-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.dropdown-wrapper { position: relative; }
.toolbar-dropdown { position: absolute; top: calc(100% + 6px); right: 0; background: white; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); z-index: 150; overflow: hidden; min-width: 150px; }
.toolbar-dropdown-item { display: block; width: 100%; padding: 10px 16px; background: none; border: none; text-align: left; font-size: 13px; color: #475569; cursor: pointer; font-family: inherit; }
.toolbar-dropdown-item:hover { background: #f8fafc; }

/* ── LOOKUP PANEL ── */
.lookup-panel { margin-top: 16px; }
.lookup-inner { background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; }
.lookup-desc { font-size: 12px; color: #64748b; margin-bottom: 12px; line-height: 1.5; }
.lookup-search-row { display: flex; gap: 10px; }
.lookup-input { flex: 1; padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; font-family: inherit; outline: none; transition: border-color 0.2s; background: white; }
.lookup-input:focus { border-color: #3aa6a6; }
.lookup-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; white-space: nowrap; }
.lookup-btn:hover { background: #2e8b8b; }
.lookup-result { margin-top: 14px; }
.result-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 10px; }
.result-badge.found { background: #dcfce7; color: #166534; }
.result-badge.not-found { background: #fef9c3; color: #854d0e; }
.result-list { display: flex; flex-direction: column; gap: 8px; }
.result-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; cursor: pointer; transition: all 0.2s; background: white; }
.result-item:hover { border-color: #3aa6a6; background: #f0fafa; }
.result-item.selected { border-color: #3aa6a6; background: #f0fafa; }
.result-avatar { width: 36px; height: 36px; border-radius: 50%; background: #e0f2f1; display: flex; align-items: center; justify-content: center; color: #3aa6a6; flex-shrink: 0; }
.result-info { flex: 1; }
.result-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.result-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.result-check { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: #3aa6a6; white-space: nowrap; }
.result-use { font-size: 12px; font-weight: 600; color: #94a3b8; white-space: nowrap; }
.result-item:hover .result-use { color: #3aa6a6; }

/* ── FORM FIELDS ── */
.section-divider { border: none; border-top: 1px solid #f1f5f9; margin: 22px 0; }
.req { color: #ef4444; }
.form-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
.form-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
.form-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
.form-row-inline { display: flex; align-items: flex-end; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
.gender-group  { flex: 0 0 auto; }
.dob-group     { flex: 0 0 180px; }
.age-group     { flex: 0 0 80px; }
.religion-group { flex: 0 0 180px; }
.field-group { display: flex; flex-direction: column; gap: 5px; }
.field-group label { font-size: 12px; font-weight: 600; color: #64748b; }
.radio-group { display: flex; gap: 16px; padding: 8px 0; }
.radio-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #475569; cursor: pointer; }
.radio-label input { accent-color: #3aa6a6; cursor: pointer; }

/* Standard inputs */
input[type="text"],
input[type="email"],
input[type="number"],
input[type="date"],
input[type="time"],
select,
textarea {
  padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #475569; font-family: inherit; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s; background: white; width: 100%;
}
input:focus, select:focus, textarea:focus { border-color: #3aa6a6; box-shadow: 0 0 0 3px rgba(58,166,166,0.1); }
textarea { resize: vertical; }
select { appearance: auto; }

/* ── ERROR / SUCCESS STATES ── */
.has-error input,
.has-error select,
.has-error textarea,
.has-error .prefixed-input,
.has-error .icon-input {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
}
.has-success input,
.has-success .prefixed-input,
.has-success .icon-input {
  border-color: #16a34a !important;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.08) !important;
}
.field-error {
  font-size: 11.5px; color: #ef4444; font-weight: 500;
  display: flex; align-items: center; gap: 4px; margin-top: 2px;
  animation: slideDown 0.15s ease;
}
.field-success {
  font-size: 11.5px; color: #16a34a; font-weight: 500;
  display: flex; align-items: center; gap: 4px; margin-top: 2px;
}
.field-hint {
  font-size: 11px; color: #94a3b8; margin-top: 1px;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── INPUT WITH PHONE PREFIX (+63 flag) ── */
.input-with-prefix {
  display: flex; align-items: stretch;
  border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden;
  background: white; transition: border-color 0.2s, box-shadow 0.2s;
}
.input-with-prefix:focus-within {
  border-color: #3aa6a6; box-shadow: 0 0 0 3px rgba(58,166,166,0.1);
}
.prefix-error  { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }
.prefix-success { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.08) !important; }
.input-prefix {
  display: flex; align-items: center; gap: 5px;
  padding: 0 10px; background: #f8fafc; border-right: 1.5px solid #e2e8f0;
  font-size: 12.5px; font-weight: 600; color: #475569; white-space: nowrap;
  flex-shrink: 0;
}
.flag-icon { width: 18px; height: 13px; border-radius: 2px; object-fit: cover; }
.prefixed-input {
  flex: 1; border: none !important; border-radius: 0 !important;
  box-shadow: none !important; outline: none;
  padding: 9px 10px; font-size: 13px; color: #475569;
  font-family: inherit; background: transparent; width: 100%;
}
.prefixed-input:focus { outline: none; }

/* ── INPUT WITH EMAIL ICON ── */
.input-with-icon {
  display: flex; align-items: stretch;
  border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden;
  background: white; transition: border-color 0.2s, box-shadow 0.2s;
}
.input-with-icon:focus-within {
  border-color: #3aa6a6; box-shadow: 0 0 0 3px rgba(58,166,166,0.1);
}
.icon-error   { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }
.icon-success { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.08) !important; }
.input-left-icon {
  display: flex; align-items: center; padding: 0 10px;
  background: #f8fafc; border-right: 1.5px solid #e2e8f0;
  color: #94a3b8; flex-shrink: 0;
}
.icon-input {
  flex: 1; border: none !important; border-radius: 0 !important;
  box-shadow: none !important; outline: none;
  padding: 9px 10px; font-size: 13px; color: #475569;
  font-family: inherit; background: transparent; width: 100%;
}
.icon-input:focus { outline: none; }

/* Status icon (✓ or ✕) inside input row */
.input-status-icon {
  display: flex; align-items: center; padding: 0 10px; flex-shrink: 0;
}

/* ── SUCCESS MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 500; }
.modal { background: white; border-radius: 20px; width: 440px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); text-align: center; }
.modal-icon { width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.modal-icon.success { background: #dcfce7; color: #16a34a; }
.modal h3 { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
.modal p { font-size: 13px; color: #64748b; margin-bottom: 20px; line-height: 1.6; }
.modal-details { background: #f8fafc; border-radius: 10px; padding: 16px; margin-bottom: 20px; text-align: left; display: flex; flex-direction: column; gap: 10px; }
.modal-detail-row { display: flex; justify-content: space-between; font-size: 13px; color: #475569; }
.modal-detail-row strong { color: #1e293b; }
.badge { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge.new      { background: #dbeafe; color: #1e40af; }
.badge.existing { background: #dcfce7; color: #166534; }
.modal-actions { display: flex; gap: 10px; }
.btn-modal-primary { flex: 1; padding: 11px; background: #3aa6a6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.btn-modal-primary:hover { background: #2e8b8b; }
.btn-modal-secondary { flex: 1; padding: 11px; background: white; color: #3aa6a6; border: 1.5px solid #3aa6a6; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-modal-secondary:hover { background: #f0fafa; }

@media (max-width: 900px) {
  .form-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .form-grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .form-grid-4, .form-grid-3, .form-grid-2 { grid-template-columns: 1fr; }
  .form-row-inline { flex-direction: column; align-items: flex-start; }
  .dob-group, .age-group, .religion-group { flex: 0 0 100%; }
}
</style>
