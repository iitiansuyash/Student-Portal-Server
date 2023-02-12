import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Course } from "./Course";
import { Discipline } from "./Discipline";

@Entity()
export class Course_Discipline_Rel{

    @PrimaryColumn()
    public disciplineId: number

    @ManyToOne(() => Course, (course) => course.disciplines)
    @JoinColumn({ name: "courseId" })
    public course: Course

    @OneToOne(() => Discipline)
    @JoinColumn({ name: "disciplineId" })
    public discipline: Discipline
}