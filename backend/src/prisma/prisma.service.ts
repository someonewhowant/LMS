import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.seedIfNeeded();
  }

  private async seedIfNeeded() {
    // 1. Seed Achievements
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

    // 2. Seed Demo Courses
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
}
