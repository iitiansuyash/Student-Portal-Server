import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn ,OneToMany } from "typeorm";
import { NF_Applications } from "./NF_Applications";
import { Student } from "./Student";

@Entity()
export class Student_cvs {

    @PrimaryGeneratedColumn({ type: 'int' })
    public cvId: number

    @ManyToOne(() => Student, (student) => student.cvs)
    @JoinColumn({ name: "admno" })
    public student: Student

    @IsNotEmpty()
    @Column('varchar', { length: 300 })
    public cvLink: string

    @OneToMany(() => NF_Applications, (application) => application.student_cvs)
    public applications: NF_Applications[]
}