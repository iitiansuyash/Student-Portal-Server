import { Student } from "../entity/Student";
import { studentRepository } from "../repositories/student.repository";
import * as userService from './student.service';

export const validateStudent = async (
  username: string,
  password: string
): Promise<Student> => {
  const student = await studentRepository.findOne({
    where: {
      admno: username,
    },
  });


  // if (student) {
  //     if (await Student.comparePassword(student, password)) {
  //         return await userService.fetchUser(student.admno);
  //     }
  // }
  if (student && password) {
    return await userService.fetchStudent(student.admno);
  }
  return undefined;
};
