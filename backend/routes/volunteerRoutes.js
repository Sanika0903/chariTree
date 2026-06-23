const express = require('express');
const path = require('path');
const fs = require('fs');
const VolunteerApplication = require('../models/VolunteerApplication');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/volunteers/apply - Submit volunteer application
router.post('/apply', async (req, res) => {
  try {
    const { name, email, orgId, orgName, message, availability, opportunityTitle, date, location } = req.body;

    if (!name || !email || !orgId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const application = await VolunteerApplication.create({
      orgId,
      orgName: orgName || 'Unknown Organization',
      name,
      email,
      message,
      availability,
      opportunityTitle: opportunityTitle || 'Volunteer Opportunity',
      date: date || new Date().toISOString().split('T')[0],
      location: location || 'Remote',
      status: 'pending',
      loggedHours: 0,
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (err) {
    console.error('Volunteer application error:', err);
    res.status(500).json({ message: 'Failed to submit application', error: err.message });
  }
});

// GET /api/volunteers/me/applications
// Returns a list of volunteer applications for the current user (from database)
router.get('/me/applications', authMiddleware, async (req, res) => {
  try {
    const apps = await VolunteerApplication.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
    res.status(500).json({ message: 'Failed to load volunteer applications' });
  }
});

// GET /api/volunteers/me/certificates - Get volunteer certificates for the logged-in user
router.get('/me/certificates', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.certificates || []);
  } catch (err) {
    console.error('Error fetching volunteer certificates:', err);
    res.status(500).json({ message: 'Failed to load certificates' });
  }
});

// GET /api/volunteers/:volunteerId/events - Get volunteer events
router.get('/:volunteerId/events', (req, res) => {
  try {
    const events = [
      {
        _id: 'event_1',
        title: 'Park Cleanup Drive',
        organization: 'Green Earth Foundation',
        date: '2025-12-15',
        time: '09:00 AM - 01:00 PM',
        location: 'Central Park',
        description: 'Help us clean and maintain our local park',
        volunteersNeeded: 15,
        volunteersSignedUp: 8,
        skills: ['Physical Work', 'Teamwork'],
        status: 'upcoming',
      },
      {
        _id: 'event_2',
        title: 'Teaching English to Kids',
        organization: 'Education for All',
        date: '2025-12-20',
        time: '02:00 PM - 04:00 PM',
        location: 'Community Center',
        description: 'Teach basic English to underprivileged children',
        volunteersNeeded: 5,
        volunteersSignedUp: 3,
        skills: ['Teaching', 'Communication'],
        status: 'upcoming',
      },
      {
        _id: 'event_3',
        title: 'Food Distribution',
        organization: 'Hunger Relief',
        date: '2025-12-22',
        time: '10:00 AM - 12:00 PM',
        location: 'Community Kitchen',
        description: 'Help distribute food to underprivileged families',
        volunteersNeeded: 20,
        volunteersSignedUp: 12,
        skills: ['Organization', 'Physical Work'],
        status: 'upcoming',
      },
    ];
    res.json(events);
  } catch (err) {
    console.error('Error fetching volunteer events:', err);
    res.status(500).json({ message: 'Failed to load events' });
  }
});

// GET /api/volunteers/:volunteerId/certificates - Get volunteer certificates
router.get('/:volunteerId/certificates', async (req, res) => {
  try {
    const user = await User.findById(req.params.volunteerId);
    if (!user) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(user.certificates || []);
  } catch (err) {
    console.error('Error fetching volunteer certificates:', err);
    res.status(500).json({ message: 'Failed to load certificates' });
  }
});

// POST /api/volunteers/:volunteerId/certificates - Issue certificate (org only)
router.post('/:volunteerId/certificates', authMiddleware, async (req, res) => {
  try {
    const { title, description, hoursLogged } = req.body;
    const volunteerId = req.params.volunteerId;

    if (!title || !hoursLogged) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(volunteerId);
    if (!user) return res.status(404).json({ message: 'Volunteer not found' });

    const certificate = {
      title,
      organization: req.user?.role === 'organization' ? 'Organization' : 'ChariTree',
      date: new Date(),
      hoursLogged: Number(hoursLogged) || 0,
      description,
    };

    user.certificates.push(certificate);
    user.hoursLogged = (user.hoursLogged || 0) + certificate.hoursLogged;
    await user.save();

    res.status(201).json({
      message: 'Certificate issued successfully',
      certificate,
    });
  } catch (err) {
    console.error('Error issuing certificate:', err);
    res.status(500).json({ message: 'Failed to issue certificate', error: err.message });
  }
});

// GET /api/volunteers/:volunteerId/profile - Get volunteer profile
router.get('/:volunteerId/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.volunteerId).select('-password');
    if (!user) return res.status(404).json({ message: 'Volunteer not found' });

    // Calculate active opportunities (e.g. registered and approved/pending)
    const activeOpportunities = await VolunteerApplication.countDocuments({
      email: user.email,
      status: { $in: ['pending', 'approved'] }
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      city: user.city || '',
      skills: user.skills || [],
      totalHoursLogged: user.hoursLogged || 0,
      activeOpportunities,
      certificates: user.certificates ? user.certificates.length : 0,
      bio: user.bio || '',
      joinedDate: user.joinedAt,
    });
  } catch (err) {
    console.error('Error fetching volunteer profile:', err);
    res.status(500).json({ message: 'Failed to load profile' });
  }
});

// PUT /api/volunteers/:volunteerId/profile - Update volunteer profile
router.put('/:volunteerId/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, city, skills, bio } = req.body;
    const volunteerId = req.params.volunteerId;

    if (req.user.id !== volunteerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(volunteerId);
    if (!user) return res.status(404).json({ message: 'Volunteer not found' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      profile: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        skills: user.skills || [],
        totalHoursLogged: user.hoursLogged || 0,
        bio: user.bio || '',
      }
    });
  } catch (err) {
    console.error('Error updating volunteer profile:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// POST /api/volunteers/:volunteerId/log-hours - Log volunteer service hours
router.post('/:volunteerId/log-hours', authMiddleware, async (req, res) => {
  try {
    const { hours, opportunityTitle } = req.body;
    const volunteerId = req.params.volunteerId;

    if (!hours || Number(hours) <= 0) {
      return res.status(400).json({ message: 'Hours is required and must be greater than zero' });
    }

    const user = await User.findById(volunteerId);
    if (!user) return res.status(404).json({ message: 'Volunteer not found' });

    user.hoursLogged = (user.hoursLogged || 0) + Number(hours);
    await user.save();

    // Log the hours on the application under the organization's name
    if (opportunityTitle) {
      const app = await VolunteerApplication.findOne({
        email: user.email,
        orgId: req.user.id,
        opportunityTitle
      });
      if (app) {
        app.loggedHours = (app.loggedHours || 0) + Number(hours);
        await app.save();
      }
    }

    res.json({
      message: 'Hours logged successfully',
      totalHoursLogged: user.hoursLogged
    });
  } catch (err) {
    console.error('Error logging volunteer hours:', err);
    res.status(500).json({ message: 'Failed to log service hours', error: err.message });
  }
});

module.exports = router;
