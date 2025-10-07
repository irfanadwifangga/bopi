import prisma from '@/config/prisma';
import { CreateUserDto, UpdateUserDto } from '@/modules/dtos/user.dto';

export class UserRepository {
	constructor(private PrismaClient = prisma) {}

	async findAll(skip: number = 0, take: number = 10) {
		return this.PrismaClient.user.findMany({
			take,
			skip,
			orderBy: { id: 'desc' },
		});
	}

	async findById(id: string) {
		return this.PrismaClient.user.findUnique({
			where: { id },
		});
	}

	async findByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email },
		});
	}

	async createUser(data: CreateUserDto) {
		return prisma.user.create({
			data,
		});
	}

	async updateUser(id: string, data: UpdateUserDto) {
		return prisma.user.update({
			where: { id },
			data,
		});
	}

	async deleteUser(id: string) {
		return prisma.user.delete({
			where: { id },
		});
	}
}
