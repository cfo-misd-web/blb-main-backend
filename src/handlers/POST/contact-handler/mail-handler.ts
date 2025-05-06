import nodemailer from 'nodemailer';
import type { Context, Handler } from 'hono';
import { z } from 'zod';
import { emailSchema } from '../../../zod-schema/schema.js';



export const sendEmailHandler: Handler = async (c: Context) => {
    const body = await c.req.json();
    const parseResult = emailSchema.safeParse(body);
    if (!parseResult.success) {
        return c.json({ message: 'Invalid input', errors: parseResult.error.format() }, 400);
    }

    const { to, subject, text, name } = parseResult.data;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ADD,
                pass: process.env.GOOGLE_EMAIL_APP_PWORD, // Your Gmail app password
            },
        });

        const message = `FROM ${name}\n\n${text}`;

        const mailOptions = {
            from: process.env.GMAIL_ADD,
            to,
            subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);

        return c.json({ message: 'Email sent successfully' }, 200);
    } catch (error) {
        console.error('Error sending email:', error);
        return c.json({ message: 'Failed to send email', error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    }
};