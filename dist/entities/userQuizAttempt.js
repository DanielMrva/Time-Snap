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
exports.UserQuizAttempt = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const quiz_1 = require("./quiz");
let UserQuizAttempt = class UserQuizAttempt {
};
exports.UserQuizAttempt = UserQuizAttempt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserQuizAttempt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_1.User)
], UserQuizAttempt.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_1.Quiz, { onDelete: 'CASCADE' }),
    __metadata("design:type", quiz_1.Quiz)
], UserQuizAttempt.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserQuizAttempt.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserQuizAttempt.prototype, "time_taken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserQuizAttempt.prototype, "completed_at", void 0);
exports.UserQuizAttempt = UserQuizAttempt = __decorate([
    (0, typeorm_1.Entity)()
], UserQuizAttempt);
