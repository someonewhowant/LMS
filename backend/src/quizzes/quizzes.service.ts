import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(teacherId: number, userRole: string, data: CreateQuizDto) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: data.moduleId },
      include: { course: true }
    });
    
    if (!module) throw new NotFoundException('Module not found');
    if (module.course.teacherId !== teacherId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You can only add quizzes to your own courses');
    }

    return this.prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.create({
        data: {
          title: data.title,
          description: data.description,
          moduleId: data.moduleId,
        }
      });

      for (const question of data.questions) {
        await tx.question.create({
          data: {
            text: question.text,
            quizId: quiz.id,
            options: {
              create: question.options.map(opt => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
              }))
            }
          }
        });
      }

      return tx.quiz.findUnique({
        where: { id: quiz.id },
        include: { questions: { include: { options: true } } }
      });
    });
  }

  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { 
        questions: { 
          include: { 
            options: { select: { id: true, text: true, isCorrect: true } } 
          } 
        } 
      }
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async getQuizForStudent(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { 
        questions: { 
          include: { 
            options: { select: { id: true, text: true } } 
          } 
        } 
      }
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async submitQuiz(id: number, userId: number, dto: SubmitQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } }
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    let score = 0;
    const total = quiz.questions.length;

    for (const question of quiz.questions) {
      const selectedOptionId = dto.answers[question.id];
      if (selectedOptionId) {
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        if (selectedOption && selectedOption.isCorrect) {
          score++;
        }
      }
    }

    return this.prisma.userQuizResult.create({
      data: {
        userId,
        quizId: id,
        score,
        total,
      }
    });
  }

  async getMyResults(userId: number) {
    return this.prisma.userQuizResult.findMany({
      where: { userId },
      include: { quiz: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
