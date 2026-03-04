const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')   // ← FIXED: use promise version
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const ExcelJS = require('exceljs')
const bcrypt = require('bcryptjs')
const axios = require('axios')

// ── SEMAPHORE CONFIG ────────────────────────────────────────
const SEMAPHORE_API_KEY = ''
const SEMAPHORE_URL     = 'https://api.semaphore.co/api/v4/messages'

// ── PHONE NUMBER NORMALIZER (PH format → 09XXXXXXXXX) ──────
function normalizePHNumber(raw) {
  if (!raw) return null
  let n = String(raw).replace(/\D/g, '')
  if (n.startsWith('63'))  n = '0' + n.slice(2)
  if (n.startsWith('+63')) n = '0' + n.slice(3)
  if (!n.startsWith('0'))  n = '0' + n
  return n
}

const app = express()
app.use(cors())
app.use(express.json())

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
app.use('/uploads', express.static(uploadsDir))

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `doctor_${Date.now()}${ext}`)
  }
})
const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only PNG and JPG images are allowed.'))
  }
})

const uploadImport = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

// ── DB POOL (promise-based) ────────────────────────────────
let db
async function initDB() {
  db = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'carequeue',
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
  })
  console.log('✅ Connected to MySQL')
  await createTables()
}

function formatDateString(val) {
  if (!val) return null
  if (typeof val === 'string') return val.slice(0, 10)
  if (val instanceof Date) {
    const y = val.getFullYear()
    const m = String(val.getMonth() + 1).padStart(2, '0')
    const d = String(val.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return String(val).slice(0, 10)
}

function sanitizeAppointment(row) {
  if (!row) return row
  return {
    ...row,
    appointment_date: formatDateString(row.appointment_date),
    date_of_birth:    formatDateString(row.date_of_birth),
  }
}
function sanitizeDoctor(row) {
  if (!row) return row
  return { ...row, date_of_birth: formatDateString(row.date_of_birth) }
}
function sanitizePatient(row) {
  if (!row) return row
  return { ...row, date_of_birth: formatDateString(row.date_of_birth) }
}

async function createTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS doctors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id VARCHAR(20) UNIQUE,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      middle_name VARCHAR(80),
      name_extension VARCHAR(20),
      gender ENUM('Male','Female','Other') NOT NULL,
      date_of_birth DATE,
      religion VARCHAR(80),
      civil_status ENUM('Single','Married','Widowed','Separated'),
      landline VARCHAR(30),
      mobile VARCHAR(30) NOT NULL,
      email VARCHAR(150),
      address TEXT,
      specialization VARCHAR(120) NOT NULL,
      sub_specialization VARCHAR(120),
      hospital VARCHAR(150) NOT NULL,
      office VARCHAR(60) NOT NULL,
      license_number VARCHAR(60),
      years_experience INT,
      medical_school VARCHAR(150),
      status ENUM('IN','OUT') DEFAULT 'IN',
      photo_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS patients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id VARCHAR(20) UNIQUE,
      last_name VARCHAR(80) NOT NULL,
      first_name VARCHAR(80) NOT NULL,
      middle_name VARCHAR(80),
      name_extension VARCHAR(20),
      gender ENUM('Male','Female','Other'),
      date_of_birth DATE,
      age INT,
      religion VARCHAR(80),
      landline VARCHAR(30),
      mobile VARCHAR(30),
      email VARCHAR(150),
      password_hash VARCHAR(255),
      google_id VARCHAR(100),
      avatar_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      appointment_id VARCHAR(20) UNIQUE,
      patient_id INT,
      patient_type ENUM('new','existing') DEFAULT 'new',
      last_name VARCHAR(80) NOT NULL,
      first_name VARCHAR(80) NOT NULL,
      middle_name VARCHAR(80),
      name_extension VARCHAR(20),
      gender ENUM('Male','Female','Other'),
      date_of_birth DATE,
      age INT,
      religion VARCHAR(80),
      landline VARCHAR(30),
      mobile VARCHAR(30),
      email VARCHAR(150),
      doctor VARCHAR(150),
      appointment_date DATE,
      appointment_time TIME,
      condition_notes TEXT,
      note TEXT,
      status ENUM('waiting','approved','cancelled','arrived','completed') DEFAULT 'waiting',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS doctor_accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL UNIQUE,
      username VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS hospitals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS specializations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS doctor_permissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL UNIQUE,
      view_dashboard TINYINT(1) DEFAULT 0,
      view_schedule TINYINT(1) DEFAULT 0,
      book_appointment TINYINT(1) DEFAULT 0,
      view_appointments TINYINT(1) DEFAULT 0,
      update_appt_status TINYINT(1) DEFAULT 0,
      view_queue TINYINT(1) DEFAULT 0,
      view_medical_records TINYINT(1) DEFAULT 0,
      view_patient_profile TINYINT(1) DEFAULT 0,
      print_records TINYINT(1) DEFAULT 0,
      view_patients TINYINT(1) DEFAULT 0,
      search_patients TINYINT(1) DEFAULT 0,
      view_doctors TINYINT(1) DEFAULT 0,
      edit_profile TINYINT(1) DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS offices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS prescriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      appointment_id INT,
      medication VARCHAR(255) NOT NULL,
      dosage VARCHAR(150),
      instructions TEXT,
      prescribed_by VARCHAR(150),
      prescribed_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS sms_blast_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender VARCHAR(150) NOT NULL,
      message TEXT NOT NULL,
      recipient_count INT DEFAULT 0,
      sent_count INT DEFAULT 0,
      failed_count INT DEFAULT 0,
      status ENUM('sent','scheduled','failed') DEFAULT 'sent',
      scheduled_at DATETIME,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    // ── DOCTOR SCHEDULES: admin-defined available slots per doctor per weekday ──
    `CREATE TABLE IF NOT EXISTS doctor_schedules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL,
      day_of_week TINYINT NOT NULL COMMENT '0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat',
      time_slot TIME NOT NULL,
      UNIQUE KEY uq_doc_day_slot (doctor_id, day_of_week, time_slot),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    )`,
    // ── NOTIFICATIONS: matches your actual DB schema ──
    `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      type ENUM('admin','doctor','both') DEFAULT 'both',
      appointment_id INT DEFAULT NULL,
      \`read\` TINYINT(1) DEFAULT 0,
      target_doctor VARCHAR(150) DEFAULT NULL,
      target_admin VARCHAR(150) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ]

  const names = ['Users','Doctors','Patients','Appointments','Doctor accounts',
    'Hospitals','Specializations','Doctor permissions','Offices','Prescriptions','SMS history','Doctor schedules','Notifications']

  for (let i = 0; i < tables.length; i++) {
    try {
      await db.query(tables[i])
      console.log(`✅ ${names[i]} table ready`)
    } catch (err) {
      console.error(`❌ ${names[i]} table:`, err.message)
    }
  }

  await seedHospitals()
  await seedSpecializations()
  await seedOffices()
}

// ── SEEDS ──────────────────────────────────────────────────
async function seedHospitals() {
  const defaults = [
    'ANGELES UNIVERSITY FOUNDATION','SACRED HEART MEDICAL CENTER',
    'ANGELES MEDICAL CENTER','AMANDO L. GARCIA MEDICAL CENTER',
    'ST. CATHERINE OF ALEXANDRIA FOUNDATION AND MEDICAL CENTER'
  ]
  for (const name of defaults) {
    await db.query('INSERT IGNORE INTO hospitals (name) VALUES (?)', [name]).catch(() => {})
  }
}

async function seedSpecializations() {
  const defaults = [
    'Adult & Pediatric Urology','Adult Pediatric - Allergology & Immunology',
    'Anesthesiology','Cardiology','Cardiovascular Surgery','Dermatology',
    'Diabetology','Emergency Medicine','Endocrinology','Family Medicine',
    'Gastroenterology','General Surgery','Geriatrics','Hematology',
    'Infectious Disease Specialist','Internal Medicine','Nephrology',
    'Neurology','Neurosurgery','Obstetrics & Gynecology','Oncology',
    'Ophthalmology','Orthopedic Surgery','Otolaryngology (ENT)','Pathology',
    'Pediatric - Infectious Disease','Pediatrics',
    'Physical Medicine & Rehabilitation','Plastic Surgery','Psychiatry',
    'Pulmonology','Radiology','Rheumatology','Urology','Vascular Surgery'
  ]
  for (const name of defaults) {
    await db.query('INSERT IGNORE INTO specializations (name) VALUES (?)', [name]).catch(() => {})
  }
}

async function seedOffices() {
  const defaults = [
    'OPD Room 101','OPD Room 102','OPD Room 103',
    'RVJ 101','RVJ 102','RVJ 201','RVJ 202',
    'Cardiology Suite','Neurology Suite','Pediatrics Wing',
    'Surgery Room A','Surgery Room B','ICU','ER Bay 1','ER Bay 2'
  ]
  for (const name of defaults) {
    await db.query('INSERT IGNORE INTO offices (name) VALUES (?)', [name]).catch(() => {})
  }
}

// ── ID GENERATORS ──────────────────────────────────────────
async function generateDoctorId() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM doctors')
  return `DR-${(rows[0].total + 1).toString().padStart(5, '0')}`
}
async function generatePatientId() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM patients')
  return `PT-${(rows[0].total + 1).toString().padStart(5, '0')}`
}
async function generateAppointmentId() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM appointments')
  return `AP-${(rows[0].total + 1).toString().padStart(5, '0')}`
}

// ══════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required.' })
  try {
    const password_hash = await bcrypt.hash(password, 10)
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password_hash])
    res.status(201).json({ message: 'Registration successful!' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Email already registered!' })
    res.status(500).json({ message: 'Registration failed.' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    // ── Check admin users first ──
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email])

    if (users.length > 0) {
      const user = users[0]
      let match = false
      if (user.password.startsWith('$2')) {
        match = await bcrypt.compare(password, user.password)
      } else {
        match = password === user.password
        if (match) {
          const hashed = await bcrypt.hash(password, 10)
          await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id])
        }
      }
      if (!match) return res.status(401).json({ message: 'Invalid email or password!' })
      return res.status(200).json({
        message: 'Login successful!',
        role: 'admin',
        user: { name: user.name, email: user.email, role: 'admin' }
      })
    }

    // ── Check doctor accounts ──
    const [docs] = await db.query(
      `SELECT da.*, d.id AS doctor_db_id,
              d.first_name, d.last_name, d.specialization, d.hospital
       FROM doctor_accounts da
       JOIN doctors d ON d.id = da.doctor_id
       WHERE da.username = ? AND da.is_active = 1`,
      [email]
    )
    if (docs.length === 0)
      return res.status(401).json({ message: 'Invalid email or password!' })

    const doc = docs[0]
    let match = false
    if (doc.password.startsWith('$2')) {
      match = await bcrypt.compare(password, doc.password)
    } else {
      match = password === doc.password
      if (match) {
        const hashed = await bcrypt.hash(password, 10)
        await db.query('UPDATE doctor_accounts SET password = ? WHERE id = ?', [hashed, doc.id])
      }
    }
    if (!match) return res.status(401).json({ message: 'Invalid email or password!' })

    const [permRows] = await db.query('SELECT * FROM doctor_permissions WHERE doctor_id = ?', [doc.doctor_db_id])
    const permissions = permRows.length > 0 ? permRows[0] : {}
    return res.status(200).json({
      message: 'Login successful!',
      role: 'doctor',
      user: {
        name: `Dr. ${doc.first_name} ${doc.last_name}`,
        email: doc.username,
        role: 'doctor',
        doctor_id: doc.doctor_db_id,
        specialization: doc.specialization,
        hospital: doc.hospital,
        permissions
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed.' })
  }
})

app.put('/update-profile', async (req, res) => {
  const { currentEmail, name, email, password } = req.body
  try {
    let sql = 'UPDATE users SET name = ?, email = ?'
    const params = [name, email]
    if (password) {
      const hashed = await bcrypt.hash(password, 10)
      sql += ', password = ?'
      params.push(hashed)
    }
    sql += ' WHERE email = ?'
    params.push(currentEmail)
    const [result] = await db.query(sql, params)
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found!' })
    res.status(200).json({ message: 'Profile updated!', user: { name, email } })
  } catch (err) {
    res.status(500).json({ message: 'Update failed.' })
  }
})

app.get('/users', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, name, email, created_at FROM users')
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' })
  }
})

// ══════════════════════════════════════════════════════
//  SMS BLAST ROUTES
// ══════════════════════════════════════════════════════

app.get('/sms-blast/history', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM sms_blast_history ORDER BY sent_at DESC LIMIT 100')
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch SMS history.' })
  }
})

app.post('/sms-blast', async (req, res) => {
  const { sender, message, recipients, scheduled, scheduleTime } = req.body
  if (!message || !message.trim()) return res.status(400).json({ message: 'Message body is required.' })
  if (!recipients || recipients.length === 0) return res.status(400).json({ message: 'No recipients selected.' })
  if (!sender || !sender.trim()) return res.status(400).json({ message: 'Sender name is required.' })

  const senderName = sender.trim().slice(0, 11)
  let sentCount = 0, failedCount = 0
  const errors = []

  if (scheduled && scheduleTime) {
    try {
      const [result] = await db.query(
        `INSERT INTO sms_blast_history (sender, message, recipient_count, sent_count, failed_count, status, scheduled_at)
         VALUES (?, ?, ?, 0, 0, 'scheduled', ?)`,
        [senderName, message, recipients.length, scheduleTime]
      )
      return res.json({ message: `SMS Blast scheduled for ${scheduleTime}.`, scheduled: true, historyId: result.insertId })
    } catch (err) {
      return res.status(500).json({ message: 'Failed to save scheduled blast.' })
    }
  }

  for (const recipient of recipients) {
    const mobile = normalizePHNumber(recipient.mobile)
    if (!mobile) { failedCount++; errors.push({ name: recipient.name, error: 'Invalid or missing mobile number.' }); continue }

    const personalizedMsg = (recipient.personalizedMessage || message)
      .replace(/{name}/g, recipient.name || '')
      .replace(/{hospital}/g, senderName)

    try {
      const params = new URLSearchParams()
      params.append('apikey', SEMAPHORE_API_KEY)
      params.append('number', mobile)
      params.append('message', personalizedMsg)
      params.append('sendername', senderName)
      const response = await axios.post(SEMAPHORE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000
      })
      if (response.status === 200) sentCount++
      else { failedCount++; errors.push({ name: recipient.name, error: JSON.stringify(response.data) }) }
    } catch (err) {
      failedCount++
      errors.push({ name: recipient.name, mobile, error: err.response?.data?.message || err.message })
    }
  }

  const finalStatus = failedCount === recipients.length ? 'failed' : 'sent'
  await db.query(
    `INSERT INTO sms_blast_history (sender, message, recipient_count, sent_count, failed_count, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [senderName, message, recipients.length, sentCount, failedCount, finalStatus]
  ).catch(err => console.error('❌ Failed to log SMS blast:', err.message))

  if (failedCount === recipients.length)
    return res.status(500).json({ message: 'All SMS messages failed.', sent: sentCount, failed: failedCount, errors })

  return res.json({ message: `SMS Blast complete. Sent: ${sentCount}, Failed: ${failedCount}.`, sent: sentCount, failed: failedCount, errors: errors.length > 0 ? errors : undefined })
})

// ══════════════════════════════════════════════════════
//  HOSPITALS ROUTES
// ══════════════════════════════════════════════════════

app.get('/hospitals', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM hospitals ORDER BY name ASC')
    res.json(results)
  } catch (err) { res.status(500).json({ message: 'Failed to fetch hospitals.' }) }
})

app.post('/hospitals', async (req, res) => {
  const { name } = req.body
  if (!name || !name.trim()) return res.status(400).json({ message: 'Hospital name is required.' })
  try {
    const [result] = await db.query('INSERT INTO hospitals (name) VALUES (?)', [name.trim().toUpperCase()])
    const [rows] = await db.query('SELECT * FROM hospitals WHERE id = ?', [result.insertId])
    res.status(201).json({ message: 'Hospital added!', hospital: rows[0] })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Hospital already exists.' })
    res.status(500).json({ message: 'Failed to add hospital.' })
  }
})

// ══════════════════════════════════════════════════════
//  SPECIALIZATIONS ROUTES
// ══════════════════════════════════════════════════════

app.get('/specializations', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM specializations ORDER BY name ASC')
    res.json(results)
  } catch (err) { res.status(500).json({ message: 'Failed to fetch specializations.' }) }
})

app.post('/specializations', async (req, res) => {
  const { name } = req.body
  if (!name || !name.trim()) return res.status(400).json({ message: 'Specialization name is required.' })
  try {
    const [result] = await db.query('INSERT INTO specializations (name) VALUES (?)', [name.trim()])
    const [rows] = await db.query('SELECT * FROM specializations WHERE id = ?', [result.insertId])
    res.status(201).json({ message: 'Specialization added!', specialization: rows[0] })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Specialization already exists.' })
    res.status(500).json({ message: 'Failed to add specialization.' })
  }
})

// ══════════════════════════════════════════════════════
//  OFFICES ROUTES
// ══════════════════════════════════════════════════════

app.get('/offices', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM offices ORDER BY name ASC')
    res.json(results)
  } catch (err) { res.status(500).json({ message: 'Failed to fetch offices.' }) }
})

app.post('/offices', async (req, res) => {
  const { name } = req.body
  if (!name || !name.trim()) return res.status(400).json({ message: 'Office/Room name is required.' })
  try {
    const [result] = await db.query('INSERT INTO offices (name) VALUES (?)', [name.trim()])
    const [rows] = await db.query('SELECT * FROM offices WHERE id = ?', [result.insertId])
    res.status(201).json({ message: 'Office added!', office: rows[0] })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Office/Room already exists.' })
    res.status(500).json({ message: 'Failed to add office.' })
  }
})

app.delete('/offices/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM offices WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Office not found.' })
    res.json({ message: 'Office deleted.' })
  } catch (err) { res.status(500).json({ message: 'Failed to delete office.' }) }
})

// ══════════════════════════════════════════════════════
//  PRESCRIPTIONS ROUTES
// ══════════════════════════════════════════════════════

app.get('/prescriptions', async (req, res) => {
  const { patient_id, doctor } = req.query
  try {
    if (doctor && !patient_id) {
      const [results] = await db.query(
        `SELECT DISTINCT pr.* FROM prescriptions pr
         INNER JOIN patients p ON p.id = pr.patient_id
         INNER JOIN appointments a ON (a.patient_id = p.id OR (a.first_name = p.first_name AND a.last_name = p.last_name))
         WHERE a.doctor = ? ORDER BY pr.prescribed_date DESC, pr.id DESC`,
        [doctor]
      )
      return res.json(results)
    }
    if (!patient_id) return res.status(400).json({ message: 'patient_id or doctor is required.' })
    if (doctor) {
      const [results] = await db.query(
        `SELECT DISTINCT pr.* FROM prescriptions pr
         INNER JOIN appointments a ON (
           a.patient_id = pr.patient_id
           OR EXISTS (SELECT 1 FROM patients p WHERE p.id = pr.patient_id AND a.first_name = p.first_name AND a.last_name = p.last_name)
         )
         WHERE pr.patient_id = ? AND a.doctor = ? ORDER BY pr.prescribed_date DESC, pr.id DESC`,
        [patient_id, doctor]
      )
      return res.json(results)
    }
    const [results] = await db.query(
      'SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY prescribed_date DESC, id DESC',
      [patient_id]
    )
    res.json(results)
  } catch (err) { res.status(500).json({ message: 'Failed to fetch prescriptions.' }) }
})

app.post('/prescriptions', async (req, res) => {
  const { patient_id, appointment_id, medication, dosage, instructions, prescribed_by, prescribed_date } = req.body
  if (!patient_id || !medication || !prescribed_date)
    return res.status(400).json({ message: 'patient_id, medication, and prescribed_date are required.' })
  try {
    const [result] = await db.query(
      `INSERT INTO prescriptions (patient_id, appointment_id, medication, dosage, instructions, prescribed_by, prescribed_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patient_id, appointment_id || null, medication, dosage || null, instructions || null, prescribed_by || null, prescribed_date]
    )
    const [rows] = await db.query('SELECT * FROM prescriptions WHERE id = ?', [result.insertId])
    res.status(201).json({ message: 'Prescription saved!', prescription: rows[0] })
  } catch (err) { res.status(500).json({ message: 'Failed to save prescription.' }) }
})

app.delete('/prescriptions/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM prescriptions WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Prescription not found.' })
    res.json({ message: 'Prescription deleted.' })
  } catch (err) { res.status(500).json({ message: 'Failed to delete prescription.' }) }
})

// ══════════════════════════════════════════════════════
//  DOCTOR ACCOUNTS ROUTES
// ══════════════════════════════════════════════════════

app.get('/doctor-accounts', async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT da.*, d.first_name, d.last_name, d.doctor_id AS doc_ref_id, d.specialization, d.hospital
       FROM doctor_accounts da JOIN doctors d ON d.id = da.doctor_id ORDER BY da.created_at DESC`
    )
    res.json(results)
  } catch (err) { res.status(500).json({ message: 'Failed to fetch doctor accounts.' }) }
})

app.get('/doctor-accounts/by-doctor/:doctorId', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM doctor_accounts WHERE doctor_id = ?', [req.params.doctorId])
    if (results.length === 0) return res.status(404).json({ message: 'No account found.' })
    res.json(results[0])
  } catch (err) { res.status(500).json({ message: 'Failed.' }) }
})

app.post('/doctor-accounts', async (req, res) => {
  const { doctor_id, username, password } = req.body
  if (!doctor_id || !username || !password)
    return res.status(400).json({ message: 'doctor_id, username, and password are required.' })
  try {
    const [result] = await db.query(
      'INSERT INTO doctor_accounts (doctor_id, username, password) VALUES (?, ?, ?)',
      [doctor_id, username.trim().toLowerCase(), password]
    )
    await db.query('UPDATE doctors SET status = ? WHERE id = ?', ['IN', doctor_id])
    const [rows] = await db.query('SELECT * FROM doctor_accounts WHERE id = ?', [result.insertId])
    res.status(201).json({ message: 'Doctor account created successfully!', account: rows[0] })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'This doctor already has an account, or the username is taken.' })
    res.status(500).json({ message: 'Failed to create doctor account.' })
  }
})

app.put('/doctor-accounts/:id', async (req, res) => {
  const { password, is_active } = req.body
  const parts = [], params = []
  if (password !== undefined)  { parts.push('password = ?');  params.push(password) }
  if (is_active !== undefined) { parts.push('is_active = ?'); params.push(is_active) }
  if (parts.length === 0) return res.status(400).json({ message: 'Nothing to update.' })
  params.push(req.params.id)
  try {
    const [result] = await db.query(`UPDATE doctor_accounts SET ${parts.join(', ')} WHERE id = ?`, params)
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Account not found.' })
    res.json({ message: 'Account updated.' })
  } catch (err) { res.status(500).json({ message: 'Failed to update account.' }) }
})

app.delete('/doctor-accounts/:id', async (req, res) => {
  try {
    const [fetchRows] = await db.query('SELECT doctor_id FROM doctor_accounts WHERE id = ?', [req.params.id])
    const [result] = await db.query('DELETE FROM doctor_accounts WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Account not found.' })
    if (fetchRows.length > 0) {
      await db.query('UPDATE doctors SET status = ? WHERE id = ?', ['OUT', fetchRows[0].doctor_id])
    }
    res.json({ message: 'Doctor account deleted.' })
  } catch (err) { res.status(500).json({ message: 'Failed to delete account.' }) }
})

// ══════════════════════════════════════════════════════
//  DOCTOR PERMISSIONS ROUTES
// ══════════════════════════════════════════════════════

app.get('/doctor-permissions/:doctorId', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM doctor_permissions WHERE doctor_id = ?', [req.params.doctorId])
    if (results.length === 0) {
      return res.json({
        doctor_id: parseInt(req.params.doctorId),
        view_dashboard: 0, view_schedule: 0, book_appointment: 0,
        view_appointments: 0, update_appt_status: 0, view_queue: 0,
        view_medical_records: 0, view_patient_profile: 0, print_records: 0,
        view_patients: 0, search_patients: 0, view_doctors: 0, edit_profile: 0
      })
    }
    res.json(results[0])
  } catch (err) { res.status(500).json({ message: 'Failed to fetch permissions.' }) }
})

app.post('/doctor-permissions/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId
  const {
    view_dashboard, view_schedule, book_appointment, view_appointments,
    update_appt_status, view_queue, view_medical_records, view_patient_profile,
    print_records, view_patients, search_patients, view_doctors, edit_profile
  } = req.body
  try {
    await db.query(
      `INSERT INTO doctor_permissions
        (doctor_id, view_dashboard, view_schedule, book_appointment, view_appointments,
         update_appt_status, view_queue, view_medical_records, view_patient_profile,
         print_records, view_patients, search_patients, view_doctors, edit_profile)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         view_dashboard=VALUES(view_dashboard), view_schedule=VALUES(view_schedule),
         book_appointment=VALUES(book_appointment), view_appointments=VALUES(view_appointments),
         update_appt_status=VALUES(update_appt_status), view_queue=VALUES(view_queue),
         view_medical_records=VALUES(view_medical_records), view_patient_profile=VALUES(view_patient_profile),
         print_records=VALUES(print_records), view_patients=VALUES(view_patients),
         search_patients=VALUES(search_patients), view_doctors=VALUES(view_doctors),
         edit_profile=VALUES(edit_profile)`,
      [doctorId,
       view_dashboard?1:0, view_schedule?1:0, book_appointment?1:0, view_appointments?1:0,
       update_appt_status?1:0, view_queue?1:0, view_medical_records?1:0, view_patient_profile?1:0,
       print_records?1:0, view_patients?1:0, search_patients?1:0, view_doctors?1:0, edit_profile?1:0]
    )
    res.json({ message: 'Permissions saved successfully.' })
  } catch (err) { res.status(500).json({ message: 'Failed to save permissions.' }) }
})

// ══════════════════════════════════════════════════════
//  DOCTORS ROUTES
// ══════════════════════════════════════════════════════

app.get('/doctors', async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT d.*, IF(da.id IS NOT NULL, 1, 0) AS has_account
       FROM doctors d LEFT JOIN doctor_accounts da ON da.doctor_id = d.id
       ORDER BY d.created_at DESC`
    )
    res.json(results.map(sanitizeDoctor))
  } catch (err) { res.status(500).json({ message: 'Failed to fetch doctors.' }) }
})

app.post('/doctors/import', uploadImport.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })
  const filename = req.file.originalname.toLowerCase()
  let rows = []

  try {
    if (filename.endsWith('.csv')) {
      const text = req.file.buffer.toString('utf-8')
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''))
        const obj = {}
        headers.forEach((h, idx) => { obj[h] = cols[idx] || '' })
        rows.push(obj)
      }
    } else {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(req.file.buffer)
      const sheet = workbook.worksheets[0]
      const headers = []
      sheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) {
          row.eachCell(cell => headers.push(cell.value?.toString().toLowerCase().trim() || ''))
        } else {
          const obj = {}
          row.eachCell((cell, colIndex) => {
            const key = headers[colIndex - 1]
            if (key) obj[key] = cell.value?.toString().trim() || ''
          })
          if (obj['first_name'] || obj['last_name']) rows.push(obj)
        }
      })
    }
  } catch (e) {
    return res.status(400).json({ message: 'Failed to parse file.' })
  }

  if (rows.length === 0) return res.status(400).json({ message: 'The file is empty or has no valid data rows.' })

  let imported = 0
  const errors = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    try {
      const doctor_id = await generateDoctorId()
      await db.query(
        `INSERT INTO doctors (doctor_id,first_name,last_name,middle_name,name_extension,gender,
         date_of_birth,religion,civil_status,landline,mobile,email,address,specialization,
         sub_specialization,hospital,office,license_number,years_experience,medical_school,status)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [doctor_id, row['first_name']||'', row['last_name']||'',
         row['middle_name']||null, row['name_extension']||null, row['gender']||'Male',
         row['date_of_birth']||null, row['religion']||null, row['civil_status']||null,
         row['landline']||null, row['mobile']||'', row['email']||null, row['address']||null,
         row['specialization']||'', row['sub_specialization']||null,
         row['hospital']||'', row['office']||'', row['license_number']||null,
         parseInt(row['years_experience'])||null, row['medical_school']||null, 'OUT']
      )
      imported++
    } catch (err) {
      errors.push(`Row ${i + 2}: ${err.message}`)
    }
  }
  res.status(201).json({ message: `Import complete. ${imported} doctor(s) imported.`, count: imported, errors })
})

app.post('/doctors', uploadPhoto.single('photo'), async (req, res) => {
  const {
    first_name, last_name, middle_name, name_extension, gender,
    date_of_birth, religion, civil_status, landline, mobile, email,
    address, specialization, sub_specialization, hospital, office,
    license_number, years_experience, medical_school, status
  } = req.body
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null
  try {
    const doctor_id = await generateDoctorId()
    const [result] = await db.query(
      `INSERT INTO doctors (doctor_id,first_name,last_name,middle_name,name_extension,gender,
       date_of_birth,religion,civil_status,landline,mobile,email,address,specialization,
       sub_specialization,hospital,office,license_number,years_experience,medical_school,status,photo_url)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [doctor_id, first_name, last_name, middle_name||null, name_extension||null, gender,
       date_of_birth||null, religion||null, civil_status||null, landline||null, mobile, email||null,
       address||null, specialization, sub_specialization||null, hospital, office,
       license_number||null, years_experience||null, medical_school||null, status||'IN', photo_url]
    )
    const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [result.insertId])
    res.status(201).json({ message: 'Doctor added successfully!', doctor: sanitizeDoctor(rows[0]) })
  } catch (err) { res.status(500).json({ message: 'Failed to add doctor.' }) }
})

app.get('/doctors/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id])
    if (results.length === 0) return res.status(404).json({ message: 'Doctor not found.' })
    res.json(sanitizeDoctor(results[0]))
  } catch (err) { res.status(500).json({ message: 'Failed to fetch doctor.' }) }
})

app.put('/doctors/:id', uploadPhoto.single('photo'), async (req, res) => {
  const {
    first_name, last_name, middle_name, name_extension, gender,
    date_of_birth, religion, civil_status, landline, mobile, email,
    address, specialization, sub_specialization, hospital, office,
    license_number, years_experience, medical_school, status
  } = req.body
  try {
    let sql = `UPDATE doctors SET first_name=?,last_name=?,middle_name=?,name_extension=?,gender=?,
      date_of_birth=?,religion=?,civil_status=?,landline=?,mobile=?,email=?,address=?,
      specialization=?,sub_specialization=?,hospital=?,office=?,license_number=?,
      years_experience=?,medical_school=?,status=?`
    const values = [first_name, last_name, middle_name||null, name_extension||null, gender,
      date_of_birth||null, religion||null, civil_status||null, landline||null, mobile, email||null,
      address||null, specialization, sub_specialization||null, hospital, office,
      license_number||null, years_experience||null, medical_school||null, status||'IN']
    if (req.file) { sql += ', photo_url=?'; values.push(`/uploads/${req.file.filename}`) }
    sql += ' WHERE id=?'
    values.push(req.params.id)
    const [result] = await db.query(sql, values)
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Doctor not found.' })
    const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id])
    res.json({ message: 'Doctor updated!', doctor: sanitizeDoctor(rows[0]) })
  } catch (err) { res.status(500).json({ message: 'Failed to update doctor.' }) }
})

app.delete('/doctors/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM doctors WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Doctor not found.' })
    res.json({ message: 'Doctor deleted.' })
  } catch (err) { res.status(500).json({ message: 'Failed to delete doctor.' }) }
})

// ══════════════════════════════════════════════════════
//  DOCTOR SCHEDULE ROUTES
//  Admin sets which time slots a doctor is available on
//  each day of the week. The mobile app (book.tsx) calls
//  /doctors/:id/available-slots?date=YYYY-MM-DD to get
//  the slots for that specific date, minus booked ones.
// ══════════════════════════════════════════════════════

// GET /doctors/:id/schedules
// Returns all configured (day_of_week, time_slot) pairs — used by the admin UI.
app.get('/doctors/:id/schedules', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT day_of_week, TIME_FORMAT(time_slot, '%H:%i') AS time_slot
       FROM doctor_schedules WHERE doctor_id = ?
       ORDER BY day_of_week, time_slot`,
      [req.params.id]
    )
    res.json({ schedules: rows })
  } catch (err) {
    console.error('GET /doctors/:id/schedules error:', err)
    res.status(500).json({ message: 'Failed to fetch doctor schedules.' })
  }
})

// PUT /doctors/:id/schedules
// Body: { slots: [ { day_of_week: 1, time_slot: "08:00" }, ... ] }
// Replaces the entire schedule for this doctor atomically.
app.put('/doctors/:id/schedules', async (req, res) => {
  const doctorId = req.params.id
  const { slots } = req.body
  if (!Array.isArray(slots)) return res.status(400).json({ message: 'slots must be an array.' })
  try {
    await db.query('DELETE FROM doctor_schedules WHERE doctor_id = ?', [doctorId])
    if (slots.length > 0) {
      const values = slots.map(s => [doctorId, s.day_of_week, s.time_slot])
      await db.query('INSERT INTO doctor_schedules (doctor_id, day_of_week, time_slot) VALUES ?', [values])
    }
    res.json({ message: 'Doctor schedule saved.' })
  } catch (err) {
    console.error('PUT /doctors/:id/schedules error:', err)
    res.status(500).json({ message: 'Failed to save doctor schedule.' })
  }
})

// GET /doctors/:id/available-slots?date=YYYY-MM-DD
// Called by the mobile app (book.tsx).
// Returns time slots the doctor has set for that weekday, minus already-booked ones.
app.get('/doctors/:id/available-slots', async (req, res) => {
  const { date } = req.query
  if (!date) return res.status(400).json({ message: 'date query param required (YYYY-MM-DD).' })
  try {
    // 1. What day of week is the requested date?
    const dayOfWeek = new Date(date + 'T00:00:00').getDay() // 0=Sun … 6=Sat

    // 2. All slots the admin configured for this doctor on that weekday
    const [schedRows] = await db.query(
      `SELECT TIME_FORMAT(time_slot, '%H:%i') AS slot
       FROM doctor_schedules WHERE doctor_id = ? AND day_of_week = ?
       ORDER BY time_slot`,
      [req.params.id, dayOfWeek]
    )
    if (schedRows.length === 0) return res.json({ available: [] })

    const allSlots = schedRows.map(r => r.slot) // ["08:00","08:30",…]

    // 3. Resolve doctor full name (appointments table stores it as a string)
    const [docRows] = await db.query('SELECT first_name, last_name FROM doctors WHERE id = ?', [req.params.id])
    if (docRows.length === 0) return res.status(404).json({ message: 'Doctor not found.' })
    const { first_name, last_name } = docRows[0]
    const nameWith    = `Dr. ${first_name} ${last_name}`
    const nameWithout = `${first_name} ${last_name}`

    // 4. Find already-booked (non-cancelled) slots on this exact date
    const [bookedRows] = await db.query(
      `SELECT TIME_FORMAT(appointment_time, '%H:%i') AS slot
       FROM appointments
       WHERE (doctor = ? OR doctor = ?)
         AND appointment_date = ?
         AND status NOT IN ('cancelled')`,
      [nameWith, nameWithout, date]
    )
    const booked = new Set(bookedRows.map(r => r.slot))

    // 5. Return only the slots that are still free
    res.json({ available: allSlots.filter(s => !booked.has(s)) })
  } catch (err) {
    console.error('GET /doctors/:id/available-slots error:', err)
    res.status(500).json({ message: 'Failed to fetch available slots.' })
  }
})

// ══════════════════════════════════════════════════════
//  PATIENTS ROUTES
// ══════════════════════════════════════════════════════

app.get('/patients', async (req, res) => {
  const { doctor } = req.query
  try {
    if (doctor) {
      const withPrefix    = /^Dr\.\s*/i.test(doctor) ? doctor : `Dr. ${doctor}`
      const withoutPrefix = doctor.replace(/^Dr\.\s*/i, '')
      const [results] = await db.query(
        `SELECT DISTINCT p.* FROM patients p
         INNER JOIN appointments a ON (a.patient_id = p.id OR (a.first_name = p.first_name AND a.last_name = p.last_name))
         WHERE a.doctor = ? OR a.doctor = ?
         ORDER BY p.created_at DESC`,
        [withPrefix, withoutPrefix]
      )
      return res.json(results.map(sanitizePatient))
    }
    const [results] = await db.query('SELECT * FROM patients ORDER BY created_at DESC')
    res.json(results.map(sanitizePatient))
  } catch (err) { res.status(500).json({ message: 'Failed to fetch patients.' }) }
})

app.get('/patients/search', async (req, res) => {
  const { q } = req.query
  if (!q) return res.json([])
  const term = `%${q}%`
  try {
    const [results] = await db.query(
      `SELECT * FROM patients WHERE first_name LIKE ? OR last_name LIKE ? OR mobile LIKE ? OR email LIKE ? LIMIT 10`,
      [term, term, term, term]
    )
    res.json(results.map(sanitizePatient))
  } catch (err) { res.status(500).json({ message: 'Search failed.' }) }
})

app.get('/patients/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM patients WHERE id = ?', [req.params.id])
    if (results.length === 0) return res.status(404).json({ message: 'Patient not found.' })
    res.json(sanitizePatient(results[0]))
  } catch (err) { res.status(500).json({ message: 'Failed to fetch patient.' }) }
})

app.post('/patients', async (req, res) => {
  const { last_name, first_name, middle_name, name_extension, gender, date_of_birth, age, religion, landline, mobile, email } = req.body
  try {
    const patient_id = await generatePatientId()
    const [result] = await db.query(
      `INSERT INTO patients (patient_id,last_name,first_name,middle_name,name_extension,gender,date_of_birth,age,religion,landline,mobile,email)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [patient_id,last_name,first_name,middle_name||null,name_extension||null,gender||null,
       date_of_birth||null,age||null,religion||null,landline||null,mobile||null,email||null]
    )
    const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [result.insertId])
    res.status(201).json({ message: 'Patient added!', patient: sanitizePatient(rows[0]) })
  } catch (err) { res.status(500).json({ message: 'Failed to add patient.' }) }
})

// ══════════════════════════════════════════════════════
//  APPOINTMENTS ROUTES
// ══════════════════════════════════════════════════════

app.get('/appointments', async (req, res) => {
  const { doctor } = req.query
  try {
    if (doctor) {
      const withPrefix    = /^Dr\.\s*/i.test(doctor) ? doctor : `Dr. ${doctor}`
      const withoutPrefix = doctor.replace(/^Dr\.\s*/i, '')
      const [results] = await db.query(
        'SELECT * FROM appointments WHERE doctor = ? OR doctor = ? ORDER BY created_at DESC',
        [withPrefix, withoutPrefix]
      )
      return res.json(results.map(sanitizeAppointment))
    }
    const [results] = await db.query('SELECT * FROM appointments ORDER BY created_at DESC')
    res.json(results.map(sanitizeAppointment))
  } catch (err) { res.status(500).json({ message: 'Failed to fetch appointments.' }) }
})

app.get('/appointments/monthly', async (req, res) => {
  const now = new Date()
  const year  = parseInt(req.query.year)  || now.getFullYear()
  const month = parseInt(req.query.month) || (now.getMonth() + 1)
  const { doctor } = req.query
  try {
    let sql = `SELECT DAY(appointment_date) AS day, status, COUNT(*) AS cnt
               FROM appointments
               WHERE YEAR(appointment_date) = ? AND MONTH(appointment_date) = ? AND appointment_date IS NOT NULL`
    const params = [year, month]
    if (doctor) { sql += ` AND doctor = ?`; params.push(doctor) }
    sql += ` GROUP BY DAY(appointment_date), status ORDER BY DAY(appointment_date) ASC`

    const [rows] = await db.query(sql, params)
    const daysInMonth = new Date(year, month, 0).getDate()
    const statuses = ['waiting','approved','arrived','completed','cancelled']
    const map = {}
    rows.forEach(r => { if (!map[r.day]) map[r.day] = {}; map[r.day][r.status] = Number(r.cnt) })
    const days = []
    for (let d = 1; d <= daysInMonth; d++) {
      const entry = { day: d, total: 0 }
      statuses.forEach(s => { entry[s] = map[d]?.[s] || 0; entry.total += entry[s] })
      days.push(entry)
    }
    res.json({ year, month, days })
  } catch (err) { res.status(500).json({ message: 'Failed to fetch monthly stats.' }) }
})

app.get('/appointments/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM appointments WHERE id = ?', [req.params.id])
    if (results.length === 0) return res.status(404).json({ message: 'Appointment not found.' })
    res.json(sanitizeAppointment(results[0]))
  } catch (err) { res.status(500).json({ message: 'Failed to fetch appointment.' }) }
})

app.post('/appointments', async (req, res) => {
  const {
    patient_id, patient_type, last_name, first_name, middle_name, name_extension,
    gender, date_of_birth, age, religion, landline, mobile, email,
    doctor, appointment_date, appointment_time, condition_notes, note
  } = req.body
  try {
    const appointment_id = await generateAppointmentId()
    const [result] = await db.query(
      `INSERT INTO appointments
        (appointment_id,patient_id,patient_type,last_name,first_name,middle_name,name_extension,
         gender,date_of_birth,age,religion,landline,mobile,email,doctor,appointment_date,
         appointment_time,condition_notes,note,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [appointment_id, patient_id||null, patient_type||'new',
       last_name, first_name, middle_name||null, name_extension||null,
       gender||null, date_of_birth||null, age||null, religion||null,
       landline||null, mobile||null, email||null,
       doctor||null, appointment_date||null, appointment_time||null,
       condition_notes||null, note||null, 'waiting']
    )

    const newApptId = result.insertId

    // ── Auto-create patient record for new patients ──
    if (patient_type === 'new') {
      try {
        const pid = await generatePatientId()
        await db.query(
          `INSERT INTO patients (patient_id,last_name,first_name,middle_name,name_extension,gender,date_of_birth,age,religion,landline,mobile,email)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
          [pid,last_name,first_name,middle_name||null,name_extension||null,gender||null,
           date_of_birth||null,age||null,religion||null,landline||null,mobile||null,email||null]
        )
      } catch (_) { /* ignore if patient already exists */ }
    }

    // ── AUTO-NOTIFY the assigned doctor about the new appointment ──
    if (doctor && appointment_date) {
      try {
        const patientName = `${first_name} ${last_name}`
        const formattedDate = new Date(appointment_date).toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        })
        const timeStr = appointment_time
          ? ` at ${appointment_time.slice(0, 5)}`
          : ''

        await db.query(
          `INSERT INTO notifications (type, target_doctor, title, body, appointment_id, \`read\`)
           VALUES ('doctor', ?, ?, ?, ?, 0)`,
          [
            doctor,
            `📅 New Appointment Scheduled`,
            `${patientName} has an appointment on ${formattedDate}${timeStr}.`
              + (condition_notes ? ` Condition: ${condition_notes}` : ''),
            newApptId
          ]
        )
      } catch (notifErr) {
        // Don't fail the whole request if notification insert fails
        console.error('Failed to create appointment notification:', notifErr.message)
      }
    }

    const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [newApptId])
    res.status(201).json({ message: 'Appointment created!', appointment: sanitizeAppointment(rows[0]) })
  } catch (err) {
    console.error('Appointment insert error:', err)
    res.status(500).json({ message: 'Failed to create appointment.' })
  }
})

app.put('/appointments/:id/status', async (req, res) => {
  const { status } = req.body
  try {
    const [result] = await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Appointment not found.' })
    res.json({ message: `Appointment marked as ${status}.` })
  } catch (err) { res.status(500).json({ message: 'Failed to update status.' }) }
})

app.delete('/appointments/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Appointment not found.' })
    res.json({ message: 'Appointment deleted.' })
  } catch (err) { res.status(500).json({ message: 'Failed to delete appointment.' }) }
})


// ══════════════════════════════════════════════════════
//  NOTIFICATIONS ROUTES
//  DB columns: id, user_id, title, body, type,
//              appointment_id, `read`, target_doctor,
//              target_admin, created_at
// ══════════════════════════════════════════════════════

// GET /notifications?role=admin|doctor&doctor=Dr.+Name
app.get('/notifications', async (req, res) => {
  try {
    const { role, doctor } = req.query
    let sql, params

    if (role === 'admin') {
      // Admin sees type='admin' or type='both'
      sql = `SELECT * FROM notifications
             WHERE type IN ('admin','both')
             ORDER BY created_at DESC LIMIT 50`
      params = []
    } else if (role === 'doctor' && doctor) {
      // Doctor sees messages sent to them specifically OR broadcast to all doctors
      sql = `SELECT * FROM notifications
             WHERE type IN ('doctor','both')
               AND (target_doctor IS NULL OR target_doctor = ?)
             ORDER BY created_at DESC LIMIT 50`
      params = [doctor]
    } else {
      return res.json({ notifications: [], unreadCount: 0 })
    }

    const [rows] = await db.query(sql, params)

    // Map DB `read` column → frontend `is_read`
    const notifications = rows.map(n => ({
      ...n,
      is_read: n.read   // 'read' is the actual DB column name
    }))

    const unreadCount = notifications.filter(n => !n.is_read).length
    res.json({ notifications, unreadCount })
  } catch (err) {
    console.error('GET /notifications error:', err)
    res.status(500).json({ message: 'Failed to fetch notifications.' })
  }
})

// POST /notifications — admin manually sends a notification to a doctor or all
app.post('/notifications', async (req, res) => {
  try {
    const { type = 'both', target_doctor = null, target_admin = null, title, body } = req.body
    if (!title || !body) return res.status(400).json({ message: 'title and body are required.' })

    await db.query(
      `INSERT INTO notifications (type, target_doctor, target_admin, title, body, \`read\`)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [type, target_doctor || null, target_admin || null, title, body]
    )
    res.status(201).json({ message: 'Notification sent.' })
  } catch (err) {
    console.error('POST /notifications error:', err)
    res.status(500).json({ message: 'Failed to send notification.' })
  }
})

// PUT /notifications/mark-read — mark all as read for a role/doctor
app.put('/notifications/mark-read', async (req, res) => {
  try {
    const { role, doctor } = req.body
    if (role === 'admin') {
      await db.query(
        `UPDATE notifications SET \`read\` = 1
         WHERE type IN ('admin','both')`
      )
    } else if (role === 'doctor' && doctor) {
      await db.query(
        `UPDATE notifications SET \`read\` = 1
         WHERE type IN ('doctor','both')
           AND (target_doctor IS NULL OR target_doctor = ?)`,
        [doctor]
      )
    }
    res.json({ message: 'Marked as read.' })
  } catch (err) {
    console.error('PUT /notifications/mark-read error:', err)
    res.status(500).json({ message: 'Failed to mark as read.' })
  }
})

// PUT /notifications/:id/read — mark a single notification as read
app.put('/notifications/:id/read', async (req, res) => {
  try {
    await db.query(`UPDATE notifications SET \`read\` = 1 WHERE id = ?`, [req.params.id])
    res.json({ message: 'Notification marked as read.' })
  } catch (err) {
    console.error('PUT /notifications/:id/read error:', err)
    res.status(500).json({ message: 'Failed to mark notification as read.' })
  }
})

// ── PUSH NOTIFICATIONS (stub) ──────────────────────────────
app.post('/notifications/push', (req, res) => {
  const { doctor, patient_id, title, body, type, appointment_id } = req.body
  console.log(`📲 Push notification → ${doctor || patient_id}: [${type}] ${title} — ${body}`)
  res.json({ message: 'Push notification queued.' })
})

// ── BAYMAX: Mobile app auth routes ─────────────────────────
const baymaxAuth = require('./routes/auth')
app.use('/baymax/auth', (req, res, next) => { req.db = db; next() }, baymaxAuth)

// ── START SERVER ───────────────────────────────────────────
initDB()
  .then(() => {
    app.listen(8000, '0.0.0.0', () => console.log('🚀 Backend running on http://0.0.0.0:8000'))
  })
  .catch(err => {
    console.error('❌ Failed to initialize DB:', err.message)
    process.exit(1)
  })