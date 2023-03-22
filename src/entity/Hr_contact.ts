import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Hr_contact_emails } from "./Hr_contact_emails";
import { Hr_contact_phones } from "./Hr_contact_phones";
import { HR_POC_NF } from "./HR_POC_NF";

export enum ValidityState {
    VALID = "Valid",
    INVALID = "Invalid",
    UNKNOWN = "Unknown"
}

@Entity()
export class HR_contact{
    @PrimaryGeneratedColumn("increment", { type: "int" })
    public hrContactId: number

    @IsNotEmpty()
    @Column({ type: "varchar", length: 60 })
    public hrContactName: string

    @IsNotEmpty()
    @Column({ type: "enum", enum: ValidityState, default: ValidityState.VALID })
    public validityState: ValidityState

    @Column({ type: "varchar", length: 100 })
    public linkedin: string

    @OneToMany(() => Hr_contact_emails, (email) => email.hr)
    public emails: Hr_contact_emails

    @OneToMany(() => Hr_contact_phones, (phone) => phone.hr)
    public phones: Hr_contact_phones

    @OneToMany(() => HR_POC_NF, (poc) => poc.hr)
    public pocs: HR_POC_NF
}