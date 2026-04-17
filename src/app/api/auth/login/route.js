// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    // 1. Database connect karein (yeh har route mein sabse pehle karna hai)
    await dbConnect();

    // 2. Request body get karein (Express ke req.body ki jagah)
    const body = await req.json();
    const { email, password } = body;

    // 3. Find User
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // 4. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // 5. Generate Token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 6. Send Response (Express ke res.json ki jagah)
    return NextResponse.json({
      success: true,
      data: {
        token,
        role: user.role,
        email: user.email,
        userId: user._id
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Server error during login' }, { status: 500 });
  }
}