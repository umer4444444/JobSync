import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// -------- TYPES ----------------------------------------------------------

interface JwtPayload {
  id?: string;
  _id?: string;
  userId?: string;
  userID?: string;
  sub?: string;
  email?: string;
  exp: number;
  [key: string]: unknown;
}

interface ResumeData {
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

// -------- UTILS ----------------------------------------------------------

/** Safely decode JWT WITHOUT verifying signature (Next.js edge limitation) */
function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

/** Try finding user using all likely ID fields */
async function findUser(decoded: JwtPayload) {
  const fields = ['id', '_id', 'userId', 'userID', 'sub'];

  // Try by ID fields
  for (const field of fields) {
    if (decoded[field]) {
      const user = await User.findById(decoded[field]);
      if (user) return user;
    }
  }

  // Try email
  if (decoded.email) {
    return await User.findOne({ email: decoded.email });
  }

  return null;
}

// ------------ UPLOAD RESUME (POST) ---------------------------------------

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 1. Validate token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = decodeToken(token);

    if (!decoded || !decoded.exp) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    const user = await findUser(decoded);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Get file
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File;

    if (!resumeFile) {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }

    // Validate type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, DOCX allowed.' },
        { status: 400 }
      );
    }

    // Validate size
    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max size is 5MB.' },
        { status: 400 }
      );
    }

    // 3. Create upload directory if not exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
    await mkdir(uploadsDir, { recursive: true });

    // 4. Generate file name + save
    const extension = path.extname(resumeFile.name);
    const fileName = `${uuidv4()}${extension}`;
    const filePath = path.join(uploadsDir, fileName);
    const fileUrl = `/uploads/resumes/${fileName}`;

    const bytes = await resumeFile.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // 5. Delete old resume if exists
    if (user.resume?.fileUrl) {
      try {
        const oldPath = path.join(process.cwd(), 'public', user.resume.fileUrl);
        await unlink(oldPath);
      } catch {
        // Ignore errors if file doesn't exist
      }
    }

    // 6. Save new resume
    const hadResumeBefore = Boolean(user.resume?.fileUrl);

    const resumeData: ResumeData = {
      filename: resumeFile.name,
      fileUrl,
      fileType: resumeFile.type,
      fileSize: resumeFile.size,
      uploadedAt: new Date(),
    };

    user.resume = resumeData;

    // Update profileCompletion only if user is uploading resume for FIRST TIME
    if (!hadResumeBefore) {
      user.profileCompletion = Math.min(100, (user.profileCompletion || 0) + 20);
    }

    await user.save();

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      resume: user.resume,
      profileCompletion: user.profileCompletion,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}

// ------------ DELETE RESUME -----------------------------------------------

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Validate token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = decodeToken(authHeader.substring(7));

    if (!decoded || !decoded.exp) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    const user = await findUser(decoded);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete file from filesystem
    if (user.resume?.fileUrl) {
      try {
        const filePath = path.join(process.cwd(), 'public', user.resume.fileUrl);
        await unlink(filePath);
      } catch {
        // Ignore errors if file doesn't exist
      }
    }

    // Remove resume
    user.resume = undefined;

    // Reduce profileCompletion
    user.profileCompletion = Math.max(0, (user.profileCompletion || 0) - 20);

    await user.save();

    return NextResponse.json({
      message: 'Resume removed successfully',
      profileCompletion: user.profileCompletion,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}