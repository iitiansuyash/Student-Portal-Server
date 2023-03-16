import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course";
import { Department } from "./Department";
import { Specialization } from "./Specialization";
import { Student_Studies_Spec } from "./StudentStudiesSpec";

@Entity()
export class Discipline{

    @PrimaryGeneratedColumn( 'increment',{ type: 'int' })
    public disciplineId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public disciplineName: string

    @OneToMany(() => Specialization, (spec) => spec.discipline)
    public specs: Specialization[]

    @ManyToOne(() => Department, (department) => department.discipline)
    @JoinColumn({ name: 'departmentId' })
    public dept: Department

    @ManyToOne(() => Course, (course) => course.discipline)
    @JoinColumn({ name: 'courseId' })
    public course: Course
}