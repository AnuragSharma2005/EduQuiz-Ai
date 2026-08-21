import { Router } from 'express';
import {
  getTeachers,
  createTeacher,
  deleteTeacher,
  updateTeacher,
  getStudents,
} from '../controllers/adminController.js';

const router = Router();

// GET    /api/admin/teachers       - Fetch all teachers
// POST   /api/admin/create-teacher - Create a teacher in MongoDB
// PUT    /api/admin/teachers/:id   - Update a teacher in MongoDB
// DELETE /api/admin/teachers/:id   - Delete a teacher from MongoDB
// GET    /api/admin/students       - Fetch all students

router.get('/teachers', getTeachers);
router.post('/create-teacher', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);
router.get('/students', getStudents);

export default router;
