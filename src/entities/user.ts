import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    google_id?: string;

    @Column({ default: 0 })
    score!: number;

    @Column({ nullable: true })
    last_login_ip?: string;

    @Column({ type: 'timestamp', nullable: true })
    last_login_at?: Date;

    @Column({ default: 0 })
    failed_attempts!: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}