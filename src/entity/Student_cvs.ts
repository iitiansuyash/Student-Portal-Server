import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./Student";

@Entity()
export class Student_cvs{

    @PrimaryColumn({ type: 'int' })
    public cvId: Number

    @ManyToOne(() => Student, (student) => student.cvs)
    @JoinColumn({ name: "admno" })
    public student: Student

    @IsNotEmpty()
    @Column('varchar', { length: 300 })
    public cvLink: string
}