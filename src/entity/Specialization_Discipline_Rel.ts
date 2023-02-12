import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Discipline } from "./Discipline";
import { Specialization } from "./Specialization";

@Entity()
export class Specialization_Discipline_Rel{

    @PrimaryColumn()
    public specId: number

    @ManyToOne(() => Discipline, (discipline) => discipline.specializations)
    @JoinColumn({ name: "disciplineId" })
    public discipline: Discipline

    @OneToOne(() => Specialization)
    @JoinColumn({ name: "specId" })
    public spec: Specialization
}