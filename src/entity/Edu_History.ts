import { Column, Entity, JoinColumn, ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./Student";


@Entity({ name: 'edu_history' })
export class Edu_History {
  @PrimaryGeneratedColumn({ name: 'eduHistoryId', type: 'int' })
  public eduHistoryId: number;

  @Column({ name: 'marksheetLink', type: 'varchar', length: 300 })
  public marksheetLink: string;

  @Column({ name: 'cgpaValue', type: 'float' })
  public cgpaValue: number;

  @Column({ name: 'cgpaScale', type: 'float' })
  public cgpaScale: number;

  @Column({ name: 'gradeEquivalent', type: 'varchar', length: 45 })
  gradeEquivalent: string;

  @Column({ name: 'percentEquivalent', type: 'float' })
  public percentEquivalent: number;

  @Column({ name: 'conversionProof', type: 'varchar', length: 300 })
  public conversionProof: string;

  @Column({ name: 'startYearMonth', type: 'date' })
  startYearMonth: Date;

  @Column({ name: 'endYearMonth', type: 'date' })
  public endYearMonth: Date;

  @Column({ name: 'institution', type: 'varchar', length: 45 })
  public institution: string;

  @Column({ name: 'university', type: 'varchar', length: 200 })
  public university: string;
 
  @Column({ name: 'lastEditDate', type: 'datetime' })
  public lastEditDate: Date;

  @Column({ name: 'lastVerifiedDate', type: 'datetime' })
  public lastVerifiedDate: Date;

  @Column({ name: 'isFrozen', type: 'tinyint' })
  public isFrozen: number;

  @Column({ name: 'degreeId', type: 'int' })
  public degreeId: number;

  @Column({ name: 'degreeName', type: 'varchar', length: 45 })
  public degreeName: string;

  @ManyToOne(() => Student, (student) => student.edu_historys)
  @JoinColumn({ name: "admno" })
  public student: Student
}
