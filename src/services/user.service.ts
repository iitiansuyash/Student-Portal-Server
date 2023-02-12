import { Student } from "../entity/Student";
import { studentRepository } from "../repositories/student.repository"

interface Query {
    admno?: string;
    email?: string
}

export const findAll = async () : Promise<Student[] | undefined> => {
    return await studentRepository.find();
}

export const findByQuery = async (query: Query) : Promise<Student | undefined> => {
    return await studentRepository.findOne({ where: query });
}

export const fetchUser = async (admno: string): Promise<Student | undefined> => {
    return await studentRepository.findOneBy({ admno });
}

export const create = async (user: Student): Promise<Student> => {
    return await studentRepository.save(user);
}

export const update = async (admno: string, user: Student): Promise<Student> => {
    const updatedStudent = { ...user, updatedAt: new Date() };
    await studentRepository.update({ admno }, updatedStudent);
    return await fetchUser(admno);
}

export const remove = async (admno: string): Promise<Student | undefined> => {
    const student = await studentRepository.findOneBy({ admno });

    if(student)
    await studentRepository.softDelete(admno);

    return student;
}
