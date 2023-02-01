import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Specialization } from "./Specialization";
import { Student } from "./Student";

@Entity()
export class Student_Studies_Spec{

    @PrimaryColumn({ type: 'int' })
    public study_id: Number

    @ManyToOne(() => Student, (student) => student.specializations)
    @JoinColumn({ name: "admno" })
    public student: Student

    @ManyToOne(() => Specialization, (specialization) => specialization.specId)
    @JoinColumn({ name: "specId" })
    public specialization: Specialization
}