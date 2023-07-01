import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'edu_history' })
export class Edu_History {
  @PrimaryGeneratedColumn({ name: 'eduHistoryId', type: 'int' })
  eduHistoryId: number;

  @Column({ name: 'marksheetLink', type: 'varchar', length: 300 })
  marksheetLink: string;

  @Column({ name: 'cgpaValue', type: 'float' })
  cgpaValue: number;

  @Column({ name: 'cgpaScale', type: 'float' })
  cgpaScale: number;

  @Column({ name: 'gradeEquivalent', type: 'varchar', length: 45 })
  gradeEquivalent: string;

  @Column({ name: 'percentEquivalent', type: 'float' })
  percentEquivalent: number;

  @Column({ name: 'conversionProof', type: 'varchar', length: 300 })
  conversionProof: string;

  @Column({ name: 'startYearMonth', type: 'date' })
  startYearMonth: Date;

  @Column({ name: 'endYearMonth', type: 'date' })
  endYearMonth: Date;

  @Column({ name: 'institution', type: 'varchar', length: 45 })
  institution: string;

  @Column({ name: 'university', type: 'varchar', length: 45 })
  university: string;
 
  @Column({ name: 'lastEditDate', type: 'datetime' })
  lastEditDate: Date;

  @Column({ name: 'lastVerifiedDate', type: 'datetime' })
  lastVerifiedDate: Date;

  @Column({ name: 'isFrozen', type: 'tinyint' })
  isFrozen: number;

  @Column({ name: 'degreeId', type: 'int' })
  degreeId: number;

  @Column({ name: 'degreeName', type: 'varchar', length: 45 })
  degreeName: string;

  @Column({ name: 'admno', type: 'varchar', length: 15 })
  admno: string;
}
