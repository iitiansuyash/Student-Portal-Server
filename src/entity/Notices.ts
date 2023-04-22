import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Placementcycle } from './Placementcycle';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Notices {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    public id: number

    @ManyToOne(() => User, (user) => user.notices)
    @JoinColumn({ name: "userId" })
    public user: User

    @ManyToOne(() => Placementcycle, (cycle) => cycle.notices)
    @JoinColumn({ name: "placementCycleId" })
    public placementCycle: Placementcycle

    @IsNotEmpty()
    @Column({ type: "varchar", length: 100 })
    public title: string

    @IsNotEmpty()
    @Column({ type: "varchar", length: 1000 })
    public description: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => null })
    public deletedAt: Date
}