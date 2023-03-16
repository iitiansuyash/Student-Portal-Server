import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Scpt } from "./Scpt";

@Entity()
export class Scpt_Teams{

    @PrimaryGeneratedColumn("increment",{ type: 'int' })
    public teamId: number

    @IsNotEmpty()
    @Column('varchar', { length: 45 })
    public teamName: string

    @OneToMany(() => Scpt, (scpt) => scpt.team)
    public scpts: Scpt[]
}