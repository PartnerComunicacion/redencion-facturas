import { EmailTemplate } from '@/components/email-template';
import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		console.log(body);
		const { name, message, email } = body;

		const data = await resend.emails.send({
			from: 'Redención <not-reply@resend.dev>',
			to: ['web4.partner@gmail.com'],
			subject: 'Reporte de error',
			react: EmailTemplate({ name: name, email: email, message: message }) as React.ReactElement,
		});

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
