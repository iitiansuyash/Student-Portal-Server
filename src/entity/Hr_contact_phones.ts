import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { HR_contact } from "./Hr_contact";

@Entity()
export class Hr_contact_phones {
    @PrimaryColumn({ type: "int" })
    public hrId: number

    @IsNotEmpty()
    @Column({ type: "varchar", length: 6 })
    public phonePref: string

    @PrimaryColumn({ type: "varchar", length: 10 })
    public phone: string

    @ManyToOne(() => HR_contact, (hr) => hr.phones)
    @JoinColumn({ name: "hrId" })
    public hr: HR_contact
}