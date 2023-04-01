import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Discipline } from "./Discipline";

@Entity()
export class Department{

    @PrimaryGeneratedColumn("increment" ,{ type: 'int' })
    public deptId: number

    @IsNotEmpty()
    @Column('varchar', { length: 100 })
    public deptName: string

    @OneToMany(() => Discipline, (disciplines) => disciplines.dept)
    public discipline: Discipline[]
}