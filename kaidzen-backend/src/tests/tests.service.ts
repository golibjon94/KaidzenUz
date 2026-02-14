import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTestDto) {
    return this.prisma.$transaction(async (prisma) => {
      // Step 1: Create test with questions and options (nextQuestionId = null temporarily)
      const test = await prisma.test.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          isActive: dto.isActive ?? true,
          questions: {
            create: dto.questions.map((q) => ({
              text: q.text,
              order: q.order,
              isStartQuestion: q.isStartQuestion ?? false,
              options: {
                create: q.options.map((o) => ({
                  text: o.text,
                  order: o.order,
                  nextQuestionId: null, // Will be updated in step 2
                  feedbackText: o.feedbackText,
                  isTerminal: o.isTerminal ?? false,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: {
              options: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      // Step 2: Build mapping from temp indices to real question IDs
      const questionIdMap = new Map<number, string>();
      test.questions.forEach((q, idx) => {
        questionIdMap.set(idx, q.id);
      });

      // Step 3: Update options with correct nextQuestionId
      for (let qIdx = 0; qIdx < dto.questions.length; qIdx++) {
        const questionDto = dto.questions[qIdx];
        const createdQuestion = test.questions[qIdx];

        for (let oIdx = 0; oIdx < questionDto.options.length; oIdx++) {
          const optionDto = questionDto.options[oIdx];
          const createdOption = createdQuestion.options[oIdx];

          // Parse temp_X format to get question index
          if (optionDto.nextQuestionId && optionDto.nextQuestionId.startsWith('temp_')) {
            const targetIdx = parseInt(optionDto.nextQuestionId.replace('temp_', ''), 10);
            const realNextQuestionId = questionIdMap.get(targetIdx);

            if (realNextQuestionId) {
              await prisma.option.update({
                where: { id: createdOption.id },
                data: { nextQuestionId: realNextQuestionId },
              });
            }
          }
        }
      }

      // Step 4: Return complete test with updated relations
      return prisma.test.findUnique({
        where: { id: test.id },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: {
              options: {
                orderBy: { order: 'asc' },
                include: {
                  nextQuestion: {
                    select: { id: true, text: true },
                  },
                },
              },
            },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.test.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
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

      // Delete existing questions
      await prisma.option.deleteMany({ where: { question: { testId: id } } });
      await prisma.question.deleteMany({ where: { testId: id } });

      // Step 1: Update test and create questions with options (nextQuestionId = null temporarily)
      const test = await prisma.test.update({
        where: { id },
        data: {
          title: dto.title,
          slug: dto.slug,
          isActive: dto.isActive,
          questions: {
            create: dto.questions?.map((q) => ({
              text: q.text,
              order: q.order,
              isStartQuestion: q.isStartQuestion ?? false,
              options: {
                create: q.options.map((o) => ({
                  text: o.text,
                  order: o.order,
                  nextQuestionId: null, // Will be updated in step 2
                  feedbackText: o.feedbackText,
                  isTerminal: o.isTerminal ?? false,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: {
              options: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      // Step 2: Build mapping from temp indices to real question IDs
      const questionIdMap = new Map<number, string>();
      test.questions.forEach((q, idx) => {
        questionIdMap.set(idx, q.id);
      });

      // Step 3: Update options with correct nextQuestionId
      if (dto.questions) {
        for (let qIdx = 0; qIdx < dto.questions.length; qIdx++) {
          const questionDto = dto.questions[qIdx];
          const createdQuestion = test.questions[qIdx];

          for (let oIdx = 0; oIdx < questionDto.options.length; oIdx++) {
            const optionDto = questionDto.options[oIdx];
            const createdOption = createdQuestion.options[oIdx];

            // Parse temp_X format to get question index
            if (optionDto.nextQuestionId && optionDto.nextQuestionId.startsWith('temp_')) {
              const targetIdx = parseInt(optionDto.nextQuestionId.replace('temp_', ''), 10);
              const realNextQuestionId = questionIdMap.get(targetIdx);

              if (realNextQuestionId) {
                await prisma.option.update({
                  where: { id: createdOption.id },
                  data: { nextQuestionId: realNextQuestionId },
                });
              }
            }
          }
        }
      }

      // Step 4: Return complete test with updated relations
      return prisma.test.findUnique({
        where: { id },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: {
              options: {
                orderBy: { order: 'asc' },
                include: {
                  nextQuestion: {
                    select: { id: true, text: true },
                  },
                },
              },
            },
          },
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
          include: {
            options: {
              include: {
                nextQuestion: true,
              },
            },
          },
        },
      },
    });

    if (!test) throw new NotFoundException('Test not found');

    const feedbackList: string[] = [];

    dto.answers.forEach((ans) => {
      const question = test.questions.find((q) => q.id === ans.questionId);
      if (question) {
        const option = question.options.find((o) => o.id === ans.optionId);
        if (option && option.feedbackText) {
          feedbackList.push(option.feedbackText);
        }
      }
    });

    const finalResult = feedbackList.filter(Boolean).join('\n\n') || 'Natija topilmadi';

    return this.prisma.testResult.create({
      data: {
        userId,
        testId: test.id,
        result: finalResult,
        answers: dto.answers as any,
      },
    });
  }

  async validateTestFlow(testId: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const test = await this.findOneById(testId);
    const errors: string[] = [];

    const startQuestions = test.questions.filter((q) => q.isStartQuestion);
    if (startQuestions.length === 0) {
      errors.push('No start question defined');
    } else if (startQuestions.length > 1) {
      errors.push('Multiple start questions defined');
    }

    const reachableQuestions = new Set<string>();
    const startQ = startQuestions[0];
    if (startQ) {
      const queue = [startQ.id];
      while (queue.length > 0) {
        const qId = queue.shift()!;
        reachableQuestions.add(qId);
        const question = test.questions.find((q) => q.id === qId);
        question?.options.forEach((opt) => {
          if (opt.nextQuestionId && !reachableQuestions.has(opt.nextQuestionId)) {
            queue.push(opt.nextQuestionId);
          }
        });
      }
    }

    test.questions.forEach((q) => {
      if (!reachableQuestions.has(q.id)) {
        errors.push(`Question "${q.text}" is not reachable`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async getUserResults(userId: string) {
    return this.prisma.testResult.findMany({
      where: { userId },
      include: { test: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
