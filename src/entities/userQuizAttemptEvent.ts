import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserQuizAttempt } from './userQuizAttempt';
import { Event } from './event';

@Entity()
export class UserQuizAttemptEvent {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => UserQuizAttempt, {onDelete: 'CASCADE'})
    attempt!: UserQuizAttempt;

    @ManyToOne(() => Event, { onDelete: 'CASCADE'})
    event!: Event;

    @Column()
    selected_order!: number;
    // User's placement

    @Column()
    correct_order!: number;
    // What it says on the tin
}