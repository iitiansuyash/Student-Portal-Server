import { Student } from "../entity/Student";
import { studentRepository } from "../repositories/student.repository"

interface Query {
    admno?: string;
    email?: string
}

export const findAll = async () : Promise<Student[] | null> => {
    return await studentRepository.find();
}

export const findByQuery = async (query: Query) : Promise<Student | null> => {
    return await studentRepository.findOne({ where: query });
}

export const fetchStudent = async (admno: string): Promise<Student | null> => {
    return await studentRepository.findOneBy({ admno });
}

export const create = async (student: Student): Promise<Student> => {
    return await studentRepository.save(student);
}

export const update = async (admno: string, student: Student): Promise<Student | null> => {
    const updatedStudent = { ...student, updatedAt: new Date() };
    await studentRepository.update({ admno }, updatedStudent);
    return await fetchStudent(admno);
}

export const remove = async (admno: string): Promise<Student | null> => {
    const student = await studentRepository.findOneBy({ admno });

    if(student)
    await studentRepository.softDelete(admno);

    return student;
}
