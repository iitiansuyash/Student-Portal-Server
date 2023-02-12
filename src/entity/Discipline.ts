import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Specialization_Discipline_Rel } from "./Specialization_Discipline_Rel";
import { Student_Studies_Spec } from "./StudentStudiesSpec";

@Entity()
export class Discipline{

    @PrimaryGeneratedColumn( 'increment',{ type: 'int' })
    public disciplineId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public disciplineName: string

    @OneToMany(() => Specialization_Discipline_Rel, (specialization) => specialization.discipline)
    specializations: Specialization_Discipline_Rel[]
}