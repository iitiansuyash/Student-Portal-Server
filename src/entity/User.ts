import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, BeforeInsert, JoinColumn, OneToOne, ManyToOne } from "typeorm"
import * as bcrypt from 'bcryptjs';
import { Role } from "./Role";
import { IsNotEmpty } from "class-validator";
import { Student } from "./Student";

@Entity()
export class User {

    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(
        user: User,
        password: string,
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    @PrimaryGeneratedColumn('uuid')
    public id: string

    @IsNotEmpty()
    @Column({ unique: true })
    public email: string

    @IsNotEmpty()
    @Column()
    public password: string

    @IsNotEmpty()
    @ManyToOne((type) => Role, { eager: true })
    @JoinColumn({ name: 'roleId' })
    public role: Role;

    @OneToOne(() => Student, (student) => student.user)
    @JoinColumn()
    public student: Student

    @IsNotEmpty()
    @Column()
    public isRegistered: number

    @IsNotEmpty()
    @Column()
    public isBlocked: number

    @IsNotEmpty()
    @Column()
    public isConfirmed: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.password = await User.hashPassword(this.password);
    }
}
