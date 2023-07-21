import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from "./Student";

@Entity({ name: 'studies_semwise_cgpa' })
export class StudiesSemwiseCgpa {
  @PrimaryColumn({ name: 'studyId', type: 'int' })
  studyId: number;

  @PrimaryColumn({ name: 'semId', type: 'varchar', length: 45 })
  semId: string;

  @Column({ name: 'gpaScale', type: 'float' })
  gpaScale: number;

  @Column({ name: 'sgpaValue', type: 'float' })
  sgpaValue: number;

  @Column({ name: 'cgpaValue', type: 'float' })
  cgpaValue: number;

  @ManyToOne(() => Student, (student) => student.specializations)
  @JoinColumn({ name: "admno" })
  public student: Student
}