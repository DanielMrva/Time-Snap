import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Quiz } from "./quiz";
import { Event } from "./event";

@Entity()
export class QuizEvent {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.quizEvents, {onDelete: 'CASCADE'})
    quiz!: Quiz;

    @ManyToOne(() => Event, {onDelete: 'CASCADE'})
    event!: Event;

    @Column()
    order!: number

    @Column()
    randomizedOrder!: number
}