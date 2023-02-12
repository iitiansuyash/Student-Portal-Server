import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Department } from "./Department";
import { Discipline } from "./Discipline";

@Entity()
export class Discipline_Department_Rel{

    @PrimaryColumn()
    public disciplineId: number

    @ManyToOne(() => Department, (department) => department.disciplines)
    @JoinColumn({ name: "departmentId" })
    public dept: Department

    @OneToOne(() => Discipline)
    @JoinColumn({ name: "disciplineId" })
    public discipline: Discipline
}