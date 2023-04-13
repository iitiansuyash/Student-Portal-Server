import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Discipline } from "./Discipline";
import { NF_Branch_Eligibility } from "./NF_Branch_Eligibility";
import { Specialization_Placementcycle_rel } from "./Specialization_placementcycle_rel";
import { Spec_Offered_Acadyear } from "./Spec_Offered_Acadyear";
import { Student_Studies_Spec } from "./StudentStudiesSpec";

@Entity()
export class Specialization{

    @PrimaryColumn({ type: 'int' })
    public specId: number

    @IsNotEmpty()
    @Column('varchar', { length: 60 })
    public specName: string

    @OneToMany(() => Student_Studies_Spec, (cv) => cv.specialization)
    specializations: Student_Studies_Spec[]

    @OneToMany(() => Spec_Offered_Acadyear, (specToAcadyear) => specToAcadyear.spec)
    public specToAcadyear: Spec_Offered_Acadyear[];

    @ManyToOne(() => Discipline, (discipline) => discipline.specs)
    @JoinColumn({ name: 'disciplineId' })
    public discipline: Discipline

    @OneToMany(() => NF_Branch_Eligibility, (application) => application.spec)
    public nfEligibility: NF_Branch_Eligibility[]

    @OneToMany(() => Specialization_Placementcycle_rel, (cycle) => cycle.specialization)
    public placementCycles: Specialization_Placementcycle_rel[]
}