import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Helper to safely verify JWT
function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  return decoded;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId as string;

    const formData = await request.formData();
    const profileImage = formData.get('profileImage');

    if (!(profileImage instanceof File)) {
      return NextResponse.json({ error: 'No valid image provided' }, { status: 400 });
    }

    // Convert file to base64 and create data URI
    const bytes = await profileImage.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const dataUri = `data:${profileImage.type};base64,${base64Image}`;

    // Update user with profile image as data URI
    const user = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: dataUri,
        profileImageType: profileImage.type,
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile image uploaded successfully',
      profileImage: dataUri,
    });
  } catch (error: unknown) {
    console.error('Profile image upload error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
