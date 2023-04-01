import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { HR_contact } from "./Hr_contact";

@Entity()
export class Hr_contact_emails {
    @PrimaryColumn({ type: "varchar", length: 80 })
    public email: string

    @PrimaryColumn({ type: "int" })
    public hrId: number

    @ManyToOne(() => HR_contact, (hr) => hr.emails)
    @JoinColumn({ name: "hrId" })
    public hr: HR_contact
}