import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { isPasswordStrong, PASSWORD_RULE_MESSAGE } from "@/lib/password";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
    try {
        const body = await req.json().catch(() => null);
        const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
        const password = typeof body?.password === "string" ? body.password : "";
        const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : undefined;

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
        }

        if (!isPasswordStrong(password)) {
            return NextResponse.json({ error: PASSWORD_RULE_MESSAGE }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            email,
            password: hashedPassword,
            ...(name ? { name } : {}),
        });

        return NextResponse.json({ user: { id: user._id, email: user.email } }, { status: 201 });
    } catch (error) {
        console.error("register error", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
