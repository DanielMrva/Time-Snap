import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';
import { Quiz } from './quiz';

@Entity()
export class UserQuizAttempt {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE'})
    user!: User;

    @ManyToOne(() => Quiz, { onDelete: 'CASCADE'})
    quiz!: Quiz;

    @Column()
    score!: number;

    @Column()
    time_taken!: number
    // Time taken in seconds

    @CreateDateColumn()
    completed_at!: Date;
}
