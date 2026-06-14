"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        await this.seedIfNeeded();
    }
    async seedIfNeeded() {
        const achievementCount = await this.achievement.count();
        if (achievementCount === 0) {
            console.log('Seeding achievements...');
            await this.achievement.createMany({
                data: [
                    {
                        name: 'First Steps',
                        description: 'Log in and explore your dashboard.',
                        points: 50,
                        criteria: 'FIRST_STEPS',
                        iconUrl: 'explore'
                    },
                    {
                        name: 'Knowledge Seeker',
                        description: 'View your first course lesson.',
                        points: 30,
                        criteria: 'VIEW_LESSON',
                        iconUrl: 'menu_book'
                    },
                    {
                        name: 'Perfect Scholar',
                        description: 'Get a perfect score on any quiz.',
                        points: 100,
                        criteria: 'PERFECT_QUIZ',
                        iconUrl: 'emoji_events'
                    }
                ]
            });
        }
        const courseCount = await this.course.count();
        if (courseCount === 0) {
            console.log('Seeding demo courses...');
            let teacher = await this.user.findFirst({ where: { role: 'TEACHER' } });
            if (!teacher) {
                const hashedPassword = await bcrypt.hash('teacher123', 10);
                teacher = await this.user.create({
                    data: {
                        email: 'teacher@codeblog.academy',
                        password: hashedPassword,
                        role: 'TEACHER',
                        points: 500
                    }
                });
            }
            await this.course.create({
                data: {
                    title: 'Java Fundamentals',
                    description: 'Master core Java concepts, object-oriented programming, and essential language structures.',
                    isPublished: true,
                    teacherId: teacher.id,
                    modules: {
                        create: [
                            {
                                title: 'Introduction & Setup',
                                content: 'Learn how to install JDK and write your first Java program.',
                                order: 1,
                                assignments: {
                                    create: [
                                        {
                                            title: 'Welcome to Java',
                                            description: 'Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. In this lesson, we cover Java history and applications.',
                                            maxScore: 100
                                        },
                                        {
                                            title: 'JDK Installation and Hello World',
                                            description: 'Install JDK 21 on your operating system and write your first HelloWorld.java. Compile using `javac HelloWorld.java` and run using `java HelloWorld`.',
                                            maxScore: 100
                                        }
                                    ]
                                },
                                quizzes: {
                                    create: [
                                        {
                                            title: 'Java Basics Quiz',
                                            description: 'Test your understanding of Java compilation and JDK.',
                                            questions: {
                                                create: [
                                                    {
                                                        text: 'Which command compiles a Java file?',
                                                        options: {
                                                            create: [
                                                                { text: 'java', isCorrect: false },
                                                                { text: 'javac', isCorrect: true },
                                                                { text: 'javadoc', isCorrect: false },
                                                                { text: 'run-java', isCorrect: false }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        text: 'What does JDK stand for?',
                                                        options: {
                                                            create: [
                                                                { text: 'Java Developer Kit', isCorrect: false },
                                                                { text: 'Java Development Kit', isCorrect: true },
                                                                { text: 'Java Deployment Kernel', isCorrect: false },
                                                                { text: 'Java Design Key', isCorrect: false }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                title: 'Object Oriented Programming',
                                content: 'Understand classes, objects, inheritance, encapsulation, polymorphism, and abstraction.',
                                order: 2,
                                assignments: {
                                    create: [
                                        {
                                            title: 'Classes and Objects',
                                            description: 'Learn how to define a Class, instantiate objects using the `new` keyword, and write constructors.',
                                            maxScore: 100
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            });
            console.log('Seeding finished.');
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map