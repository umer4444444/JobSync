import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User'; // Make sure IUser is your Mongoose User type

// Utility to verify JWT safely
function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  return decoded;
}

// GET user profile
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId as string;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = user.toObject();
    if (userData.profileImage && !userData.profileImage.startsWith('data:')) {
      userData.profileImage = `data:${userData.profileImageType || 'image/jpeg'};base64,${userData.profileImage}`;
    }

    return NextResponse.json(userData);
  } catch (error: unknown) {
    console.error('Profile fetch error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Type for profile update request
interface ProfileUpdate {
  name?: string;
  profileImage?: string;
  profileImageType?: string;
  [key: string]: unknown; // allow other fields
}

// UPDATE user profile
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId as string;

    const updates: ProfileUpdate = await request.json();

    if (updates.profileImage === undefined || updates.profileImage === null) {
      updates.profileImage = undefined;
      updates.profileImageType = undefined;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = user.toObject();
    if (userData.profileImage && !userData.profileImage.startsWith('data:')) {
      userData.profileImage = `data:${userData.profileImageType || 'image/jpeg'};base64,${userData.profileImage}`;
    }

    return NextResponse.json(userData);
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
