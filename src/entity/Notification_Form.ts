import { IsNotEmpty } from "class-validator";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";
import { HR_POC_NF } from "./HR_POC_NF";
import { NF_Branch_Eligibility } from "./NF_Branch_Eligibility";
import { NF_History_Criteria } from "./NF_History_Criteria";
import { NF_Job_Stages } from "./NF_Job_Stages";
import { NF_Supporting_Docs } from "./NF_Supporting_Docs";
import { Notification_Form_spoc } from "./Notification_Form_spoc";
import { Placementcycle } from "./Placementcycle";
import { NF_Applications } from "./NF_Applications";

export enum NF_Type {
    INF = 'INF',
    JNF = 'JNF'
}

export enum Status {
    DRAFT = 'Draft',
    FINALIZED = 'Finalized'
}

@Entity()
export class Notification_Form {

    @PrimaryGeneratedColumn("increment", { type: 'int' })
    public nfId: number

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: NF_Type,
        default: NF_Type.JNF,
    })
    public type: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public profile: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public placeOfPosting: string


    @IsNotEmpty()
    @Column({ type: 'varchar', length: 500 })
    public jobDescription: string


    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public modeOfInternship: string


    @IsNotEmpty()
    @Column({ type: 'varchar', length: 100 })
    public ctc: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 300 })
    public ctcBreakup: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public bondDetails: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public hasPPO: string

    @IsNotEmpty()
    @Column({ type: 'int' })
    public ismOffersMin: number

    @IsNotEmpty()
    @Column({ type: 'int' })
    public ismOffersMax: number

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 45 })
    public cdcInformation: string

    @IsNotEmpty()
    @Column({ type: 'varchar', length: 1000 })
    public additionalDetails: string

    @IsNotEmpty()
    @Column({ type: 'enum', enum: Status, default: 'Draft' })
    public status: Status

    @IsNotEmpty()
    @Column({ type: 'datetime' })
    public deadline: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => null })
    public deletedAt: Date

    @ManyToOne(() => Placementcycle, (placementCycle) => placementCycle.nfs, { cascade: true, eager: true })
    @JoinColumn({ name: 'placementCycleId' })
    public placementCycle: Placementcycle

    @ManyToOne(() => Company, (company) => company.nfs, { cascade: true, eager: true })
    @JoinColumn({ name: 'companyId' })
    public company: Company

    @OneToMany(() => NF_Applications, (nf) => nf.notificationForm)
    public applicants: NF_Applications[]

    @OneToMany(() => NF_Branch_Eligibility, (application) => application.notificationForm, { cascade: true, eager: true })
    public nfEligibility: NF_Branch_Eligibility[]

    @OneToMany(() => NF_History_Criteria, (application) => application.notificationForm, { cascade: true, eager: true })
    public nfHistoryCriteria: NF_History_Criteria[]

    @OneToMany(() => NF_Job_Stages, (application) => application.notificationForm, { cascade: true, eager: true })
    public nf_stages: NF_Job_Stages[]

    @OneToMany(() => NF_Supporting_Docs, (application) => application.notificationForm, { cascade: true, eager: true })
    public nf_docs: NF_Supporting_Docs[]

    @OneToMany(() => HR_POC_NF, (hr) => hr.notificationForm, { cascade: true, eager: true })
    public HRs: HR_POC_NF[]

    @OneToMany(() => Notification_Form_spoc, (spoc) => spoc.notificationForm, { cascade: true, eager: true })
    public spocs: Notification_Form_spoc[]
}