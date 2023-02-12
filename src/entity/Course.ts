import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Course_Discipline_Rel } from "./Course_Discipline_Rel";

@Entity()
export class Course{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public courseId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public courseName: string

    @OneToMany(() => Course_Discipline_Rel, (discipline) => discipline.course)
    disciplines: Course_Discipline_Rel[]
}