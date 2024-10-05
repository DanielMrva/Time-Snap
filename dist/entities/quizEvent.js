"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizEvent = void 0;
const typeorm_1 = require("typeorm");
const quiz_1 = require("./quiz");
const event_1 = require("./event");
let QuizEvent = class QuizEvent {
};
exports.QuizEvent = QuizEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QuizEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_1.Quiz, (quiz) => quiz.quizEvents, { onDelete: 'CASCADE' }),
    __metadata("design:type", quiz_1.Quiz)
], QuizEvent.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_1.Event, { onDelete: 'CASCADE' }),
    __metadata("design:type", event_1.Event)
], QuizEvent.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], QuizEvent.prototype, "order", void 0);
exports.QuizEvent = QuizEvent = __decorate([
    (0, typeorm_1.Entity)()
], QuizEvent);
