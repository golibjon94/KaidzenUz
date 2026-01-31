import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTestDto) {
    return this.prisma.test.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        isActive: dto.isActive ?? true,
        questions: {
          create: dto.questions.map((q) => ({
            text: q.text,
            order: q.order,
            options: {
              create: q.options.map((o) => ({
                text: o.text,
                score: o.score,
                order: o.order,
              })),
            },
          })),
        },
        resultLogic: {
          create: dto.resultLogic.map((l) => ({
            minScore: l.minScore,
            maxScore: l.maxScore,
            resultText: l.resultText,
            recommendation: l.recommendation,
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        resultLogic: true,
      },
    });
  }

  async findAll() {
    return this.prisma.test.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        createdAt: true,
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllAdmin() {
    return this.prisma.test.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(slug: string) {
    const test = await this.prisma.test.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async findOneById(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: { orderBy: { order: 'asc' } },
          },
        },
        resultLogic: {
          orderBy: { minScore: 'asc' }
        }
      },
    });

    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async update(id: string, dto: UpdateTestDto) {
    // First delete existing relations to replace them
    // This is a simple approach; for production with existing results, 
    // you might want to be more careful or version tests
    
    return this.prisma.$transaction(async (prisma) => {
      // Check if test exists
      const existingTest = await prisma.test.findUnique({ where: { id } });
      if (!existingTest) throw new NotFoundException('Test not found');

      // Delete existing questions and logic
      await prisma.option.deleteMany({ where: { question: { testId: id } } });
      await prisma.question.deleteMany({ where: { testId: id } });
      await prisma.resultLogic.deleteMany({ where: { testId: id } });

      // Update test and recreate relations
      return prisma.test.update({
        where: { id },
        data: {
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          isActive: dto.isActive,
          questions: {
            create: dto.questions?.map((q) => ({
              text: q.text,
              order: q.order,
              options: {
                create: q.options.map((o) => ({
                  text: o.text,
                  score: o.score,
                  order: o.order,
                })),
              },
            })),
          },
          resultLogic: {
            create: dto.resultLogic?.map((l) => ({
              minScore: l.minScore,
              maxScore: l.maxScore,
              resultText: l.resultText,
              recommendation: l.recommendation,
            })),
          },
        },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
          resultLogic: true,
        },
      });
    });
  }

  async remove(id: string) {
    const test = await this.prisma.test.findUnique({ where: { id } });
    if (!test) throw new NotFoundException('Test not found');
    
    return this.prisma.test.delete({ where: { id } });
  }

  async toggleActive(id: string) {
    const test = await this.prisma.test.findUnique({ where: { id } });
    if (!test) throw new NotFoundException('Test not found');
    
    return this.prisma.test.update({
      where: { id },
      data: { isActive: !test.isActive }
    });
  }

  async submit(userId: string, dto: SubmitTestDto) {
    const test = await this.prisma.test.findUnique({
      where: { id: dto.testId },
      include: {
        questions: {
          include: { options: true },
        },
        resultLogic: true,
      },
    });

    if (!test) throw new NotFoundException('Test not found');

    let totalScore = 0;
    dto.answers.forEach((ans) => {
      const question = test.questions.find((q) => q.id === ans.questionId);
      if (question) {
        const option = question.options.find((o) => o.id === ans.optionId);
        if (option) {
          totalScore += option.score;
        }
      }
    });

    const result = test.resultLogic.find(
      (logic) => totalScore >= logic.minScore && totalScore <= logic.maxScore,
    );

    return this.prisma.testResult.create({
      data: {
        userId,
        testId: test.id,
        score: totalScore,
        resultText: result?.resultText || 'Natija topilmadi',
        recommendation: result?.recommendation || 'Tavsiya yo\'q',
        answers: dto.answers as any,
      },
    });
  }

  async getUserResults(userId: string) {
    return this.prisma.testResult.findMany({
      where: { userId },
      include: { test: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
