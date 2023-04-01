import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Notification_Form_spoc } from "./Notification_Form_spoc";
import { Scpt_Teams } from "./Scpt_Teams";
import { Student } from "./Student";

@Entity()
export class Scpt{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public scptId: number

    @OneToOne(() => Student)
    @JoinColumn({ name: 'admno' })
    public student: Student

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public name: string

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public phone: string

    @ManyToOne(() => Scpt_Teams, (team) => team.scpts)
    @JoinColumn({ name: 'teamId' })
    public team: Scpt_Teams

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public batch: string

    @OneToMany(() => Notification_Form_spoc, (nf) => nf.scpt)
    public nfs: Notification_Form_spoc[]
}

