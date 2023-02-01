import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Student_Studies_Spec } from "./StudentStudiesSpec";

@Entity()
export class Specialization{

    @PrimaryColumn({ type: 'int' })
    public specId: Number

    @IsNotEmpty()
    @Column('varchar', { length: 60 })
    public specName: string

    @OneToMany(() => Student_Studies_Spec, (cv) => cv.specialization)
    specializations: Student_Studies_Spec[]
}   