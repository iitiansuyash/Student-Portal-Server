import { Student } from "../entity/Student";
import { studentRepository } from "../repositories/student.repository";
import * as userService from './user.service';

export const validateStudent = async (
  username: string,
  password: string
): Promise<Student> => {
  const student = await studentRepository.findOne({
    where: {
      admno: username,
    },
  });

  console.log(student);

  // if (student) {
  //     if (await Student.comparePassword(student, password)) {
  //         return await userService.fetchUser(student.admno);
  //     }
  // }
  if (student && password) {
    return await userService.fetchUser(student.admno);
  }
  return undefined;
};
