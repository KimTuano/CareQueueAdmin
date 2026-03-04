// server/routes/auth.js
// ─────────────────────────────────────────────────────────────────────────────
//  Mobile app auth routes: register · login · google sign-in
//  Mounted in server.js: app.use('/baymax/auth', (req,res,next)=>{req.db=db;next()}, require('./routes/auth'))
//  Uses the shared mysql2 pool (req.db) and bcrypt — same as admin server.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcryptjs')

// ── Helpers ────────────────────────────────────────────────────────────────

async function generatePatientId(db) {
  const [rows] = await db.query('SELECT COUNT(*) AS cnt FROM patients')
  const num = (rows[0].cnt ?? 0) + 1
  return `PT-${String(num).padStart(5, '0')}`
}

function safePatient(row) {
  if (!row) return null
  // Never send password_hash to the client
  const { password_hash, ...safe } = row
  return safe
}

// ── POST /baymax/auth/register ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const db = req.db
  try {
    const {
      first_name, last_name, middle_name,
      email, password,
      mobile, gender, date_of_birth,
    } = req.body

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'first_name, last_name, email and password are required.' })
    }

    const [existing] = await db.query(
      'SELECT id FROM patients WHERE email = ? LIMIT 1',
      [email.trim().toLowerCase()]
    )
    if (existing.length) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const patient_id    = await generatePatientId(db)
    const password_hash = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      `INSERT INTO patients
         (patient_id, first_name, last_name, middle_name, gender, date_of_birth, mobile, email, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        first_name.trim(),
        last_name.trim(),
        middle_name?.trim() || null,
        gender || null,
        date_of_birth || null,
        mobile?.trim() || null,
        email.trim().toLowerCase(),
        password_hash,
      ]
    )

    const [rows] = await db.query('SELECT * FROM patients WHERE id = ? LIMIT 1', [result.insertId])
    res.status(201).json({ message: 'Account created successfully.', patient: safePatient(rows[0]) })
  } catch (e) {
    console.error('Register error:', e)
    res.status(500).json({ message: e.message })
  }
})

// ── POST /baymax/auth/login ────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const db = req.db
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const [rows] = await db.query(
      'SELECT * FROM patients WHERE email = ? LIMIT 1',
      [email.trim().toLowerCase()]
    )

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const patient = rows[0]

    if (!patient.password_hash) {
      return res.status(401).json({ message: 'This account uses Google Sign-In. Please continue with Google.' })
    }

    const match = await bcrypt.compare(password, patient.password_hash)
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    res.json({ message: 'Login successful.', patient: safePatient(patient) })
  } catch (e) {
    console.error('Login error:', e)
    res.status(500).json({ message: e.message })
  }
})

// ── POST /baymax/auth/google ───────────────────────────────────────────────
router.post('/google', async (req, res) => {
  const db = req.db
  try {
    const { google_id, email, first_name, last_name, avatar_url } = req.body

    if (!google_id || !email) {
      return res.status(400).json({ message: 'google_id and email are required.' })
    }

    // 1. Look up by google_id first, then by email
    let [rows] = await db.query(
      'SELECT * FROM patients WHERE google_id = ? LIMIT 1',
      [google_id]
    )

    if (!rows.length) {
      ;[rows] = await db.query(
        'SELECT * FROM patients WHERE email = ? LIMIT 1',
        [email.trim().toLowerCase()]
      )
    }

    // 2. Found existing patient — link google_id if needed and return
    if (rows.length) {
      const patient = rows[0]
      if (!patient.google_id) {
        await db.query(
          'UPDATE patients SET google_id = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?',
          [google_id, avatar_url || null, patient.id]
        )
        patient.google_id  = google_id
        patient.avatar_url = patient.avatar_url || avatar_url || null
      }
      return res.json({ message: 'Login successful.', patient: safePatient(patient) })
    }

    // 3. New patient — create from Google profile
    const patient_id = await generatePatientId(db)

    const [result] = await db.query(
      `INSERT INTO patients (patient_id, google_id, first_name, last_name, email, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        google_id,
        first_name?.trim() || 'Google',
        last_name?.trim()  || 'User',
        email.trim().toLowerCase(),
        avatar_url || null,
      ]
    )

    const [newRows] = await db.query('SELECT * FROM patients WHERE id = ? LIMIT 1', [result.insertId])
    res.status(201).json({ message: 'Account created via Google.', patient: safePatient(newRows[0]) })
  } catch (e) {
    console.error('Google auth error:', e)
    res.status(500).json({ message: e.message })
  }
})

module.exports = router
