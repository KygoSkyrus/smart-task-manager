import { NextResponse, NextRequest } from "next/server";
import { signToken } from "@/lib/jwt";
import { cookies } from 'next/headers'


export async function POST(req: NextRequest, res: NextResponse) {  
  const data = await req.json();
  const { username, password } = data;

  // Validate username and password (simplified for demo)
  if (username == 'admin' && password == '1234') {
    const token = await signToken({ username });

    cookies().set('token', token, {
      httpOnly: true, // Optional for security
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 , // 1 hour
      sameSite: 'strict',
      path: '/',
    });
    
    return NextResponse.json({token, message:"Login Successfull"}, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
