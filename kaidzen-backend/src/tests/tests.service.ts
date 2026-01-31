import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.test.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
      },
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
      include: { test: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
