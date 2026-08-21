import User from '../models/User.js';

/**
 * GET /api/admin/teachers
 * Fetch all teachers from MongoDB users collection
 */
export async function getTeachers(req, res, next) {
  try {
    const teachers = await User.find({ role: 'teacher' }).sort({ createdAt: -1 });
    const formatted = teachers.map((t) => ({
      id: t._id.toString(),
      name: t.fullName || t.username,
      email: t.email,
      password: '••••••••',
      department: t.department || 'Computer Science',
      status: t.isActive ? 'Active' : 'Inactive',
      joinedDate: new Date(t.createdAt).toLocaleDateString('en-GB'),
    }));

    return res.json({ teachers: formatted });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/create-teacher
 * Create a new teacher in MongoDB users collection
 */
export async function createTeacher(req, res, next) {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Teacher with this email already exists' });
    }

    // Generate username from email or name
    const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

    const newTeacher = new User({
      username,
      email: email.toLowerCase(),
      password, // Password pre-save middleware handles hashing automatically
      fullName: name,
      role: 'teacher',
      department: department || 'Computer Science',
      isActive: true,
    });

    await newTeacher.save();

    return res.status(201).json({
      message: 'Teacher created successfully',
      teacher: {
        id: newTeacher._id.toString(),
        name: newTeacher.fullName,
        email: newTeacher.email,
        password: password, // Send back clear password for admin receipt modal
        department: newTeacher.department,
        status: 'Active',
        joinedDate: new Date(newTeacher.createdAt).toLocaleDateString('en-GB'),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/teachers/:id
 * Delete a teacher from MongoDB users collection
 */
export async function deleteTeacher(req, res, next) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/teachers/:id
 * Update a teacher in MongoDB users collection
 */
export async function updateTeacher(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, department, status, password } = req.body;

    const teacher = await User.findById(id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (name) teacher.fullName = name;
    if (email) teacher.email = email.toLowerCase();
    if (department) teacher.department = department;
    if (status) teacher.isActive = status === 'Active' || status === 'ACTIVE';
    if (password) teacher.password = password;

    await teacher.save();

    return res.json({
      message: 'Teacher updated successfully',
      teacher: {
        id: teacher._id.toString(),
        name: teacher.fullName,
        email: teacher.email,
        department: teacher.department,
        status: teacher.isActive ? 'ACTIVE' : 'INACTIVE',
        joinedDate: new Date(teacher.createdAt).toLocaleDateString('en-GB'),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/students
 * Fetch all students/players from MongoDB users collection
 */
export async function getStudents(req, res, next) {
  try {
    const students = await User.find({ role: 'player' }).sort({ createdAt: -1 });
    const formatted = students.map((s) => ({
      id: s._id.toString(),
      name: s.fullName || s.username,
      email: s.email,
      quizzesTaken: s.totalGamesPlayed || 0,
      totalPoints: s.totalScore || 0,
      accuracy: s.accuracy || 85,
      progress: Math.min(100, (s.totalScore || 0) + 70),
      lastActive: s.lastLogin ? new Date(s.lastLogin).toLocaleDateString('en-GB') : 'Today',
    }));

    return res.json({ students: formatted });
  } catch (error) {
    next(error);
  }
}
