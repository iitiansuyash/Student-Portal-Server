import { IsNotEmpty } from "class-validator";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Companycategories } from "./Companycategories";
import { Companysectors } from "./Companysectors";
import { Notification_Form } from "./Notification_Form";

@Entity()
export class Company{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public companyId: number

    @IsNotEmpty()
    @Column('varchar', { length: 70 })
    public companyName: string

    @ManyToOne(() => Companycategories, (category) => category.companies, { eager: true, cascade: true })
    @JoinColumn({ name: 'companyCategoryId' })
    public category: Companycategories

    @ManyToOne(() => Companysectors, (sector) => sector.companies, { eager: true, cascade: true })
    @JoinColumn({ name: 'companySectorId' })
    public sector: Companysectors

    @Column({ type: 'varchar', length: 60 })
    public companyWebsite: string

    @OneToMany(() => Notification_Form, nf => nf.company)
    public nfs: Notification_Form[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => null })
    public deletedAt: Date
}