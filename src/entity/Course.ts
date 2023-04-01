import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Discipline } from "./Discipline";

@Entity()
export class Course{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public courseId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public courseName: string

    @OneToMany(() => Discipline, (disciplines) => disciplines.course)
    public discipline: Discipline[]
}