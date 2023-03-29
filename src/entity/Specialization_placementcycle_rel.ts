import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Placementcycle } from "./Placementcycle";
import { Specialization } from "./Specialization";

@Entity()
export class Specialization_Placementcycle_rel {
    @PrimaryColumn({ type: 'int' })
    public specId: number

    @PrimaryColumn({ type: 'int' })
    public placementCycleId: number

    @ManyToOne(() => Specialization, (spec) => spec.placementCycles)
    @JoinColumn({ name: 'specId' })
    public specialization: Specialization

    @ManyToOne(() => Placementcycle, (cycle) => cycle.specializations)
    @JoinColumn({ name: 'placementCycleId' })
    public placementCycles: Placementcycle
}