import { NextResponse } from 'next/server';

export async function GET() {
    
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Clear the JWT cookie by setting its expiration date in the past
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    maxAge: -1, // Set to a negative value to expire the cookie
    path: '/' // Ensure the path matches the cookie path
  });

  return response;
}
