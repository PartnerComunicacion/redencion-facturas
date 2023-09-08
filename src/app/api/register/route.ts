import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { error } from 'console';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const body = await req.json();
	const { email, password } = body.data;

	const exist = await prisma.user.findUnique({
		where: { email: email },
	});

	if (exist) {
		return NextResponse.json({ error: 'Ya existe un usuario con ese email' }, { status: 400 });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			email: email,
			password: hashedPassword,
		},
	});

	return NextResponse.json(user);
}
