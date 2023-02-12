import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Student } from "./Student";

@Entity()
export class Student_cvs{

    @PrimaryColumn({ type: 'int' })
    public cvId: number

    @ManyToOne(() => Student, (student) => student.cvs)
    @JoinColumn({ name: "admno" })
    public student: Student

    @IsNotEmpty()
    @Column('varchar', { length: 300 })
    public cvLink: string
}