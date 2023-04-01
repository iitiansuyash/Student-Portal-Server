import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Specialization } from "./Specialization";
import { Student } from "./Student";

@Entity()
export class Student_Studies_Spec{

    @PrimaryColumn({ type: 'int' })
    public study_id: number

    @ManyToOne(() => Student, (student) => student.specializations)
    @JoinColumn({ name: "admno" })
    public student: Student

    @ManyToOne(() => Specialization, (specialization) => specialization.specId)
    @JoinColumn({ name: "specId" })
    public specialization: Specialization

    @IsNotEmpty()
    @Column({ type: 'tinyint' })
    public isParent: number

    @IsNotEmpty()
    @Column('varchar', { length: 200 })
    public marksheetLink: string

    @IsNotEmpty()
    @Column({ type: 'float' })
    public cgpaValue: number

    @IsNotEmpty()
    @Column({ type: 'float', default: 10 })
    public cgpaScale: number

    @IsNotEmpty()
    @Column({ type: 'int' })
    public totalBacklogs: number

    @IsNotEmpty()
    @Column({ type: 'int' })
    public activeBacklogs: number
}