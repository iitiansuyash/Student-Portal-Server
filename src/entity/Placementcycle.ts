import { IsNotEmpty } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Academic_Year } from "./Academic_Year";
import { Notification_Form } from "./Notification_Form";
import { Placement_Cycle_Enrolment } from "./Placement_Cycle_Enrolment";
import { Specialization_Placementcycle_rel } from "./Specialization_placementcycle_rel";
import { Graduation_Year } from "./Graduation_Year";

export enum PlacementCycleType {
  INTERNSHIP = "internship",
  PLACEMENT = "placement",
}

@Entity()
export class Placementcycle {
  @PrimaryGeneratedColumn("increment", { type: "int" })
  public placementCycleId: number;

  @IsNotEmpty()
  @Column({ type: "varchar", length: 60 })
  public placementCycleName: string;

  @IsNotEmpty()
  @Column({
    type: "enum",
    enum: PlacementCycleType,
    default: PlacementCycleType.PLACEMENT,
  })
  public type: PlacementCycleType;

  @IsNotEmpty()
  @Column({ type: "varchar", length: "15", default: "15/06/2022" })
  public startDate: string;

  @IsNotEmpty()
  @Column({ type: "varchar", length: "15", default: "15/06/2023" })
  public endDate: string;

  @OneToMany(
    () => Placement_Cycle_Enrolment,
    (students) => students.placementCycle
  )
  public students: Placement_Cycle_Enrolment[];

  @ManyToOne(() => Academic_Year, (acadYear) => acadYear.placementCycles, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: "acadYear" })
  public acadYear: Academic_Year;

  @OneToMany(() => Notification_Form, (nf) => nf.placementCycle)
  public nfs: Notification_Form[];

  @ManyToOne(() => Graduation_Year, (year) => year.placementCycle, { eager: true })
  @JoinColumn({ name: "graduatingYear" })
  public graduatingYear: Graduation_Year;

  @OneToMany(
    () => Specialization_Placementcycle_rel,
    (spec) => spec.placementCycles,
    { cascade: true }
  )
  public specializations: Specialization_Placementcycle_rel[];
}
