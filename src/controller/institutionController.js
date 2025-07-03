import dbConnect from "../lib/dbConnect";
import InstitutionModel from "../models/institutionModel";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email/nodemailer'; // Your email service

// GET - Get all institutions (with optional search)
export async function getInstitutions(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";

    let query = {};
    if (searchQuery) {
      query = { 
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } }
        ]
      };
    }

    const institutions = await InstitutionModel.find(query).select('-password');

    return NextResponse.json({ success: true, institutions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching institutions", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new institution
export async function createInstitution(request) {
  try {
    await dbConnect();
    const institutionData = await request.json();

    // 1. Validation - Check required fields
    if (!institutionData.email || !institutionData.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Check existing institution (case-insensitive)
    const existingInstitution = await InstitutionModel.findOne({ 
      email: { $regex: new RegExp(`^${institutionData.email}$`, 'i') }
    });

    if (existingInstitution) {
      return NextResponse.json(
        { 
          message: "Institution with this email already exists",
          suggestion: existingInstitution.isVerified 
            ? "Try logging in" 
            : "Resend verification email"
        },
        { status: 409 } // 409 Conflict more appropriate than 400
      );
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(institutionData.password, 12); // Increased salt rounds

    // 4. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 5. Create institution
    const newInstitution = await InstitutionModel.create({
      ...institutionData,
      password: hashedPassword,
      isVerified: false,
      emailOtp: otp,
      emailOtpExpires: otpExpiry,
      lastOtpSentAt: new Date() // Track OTP send time for rate limiting
    });

    // 6. Send email via Brevo
    try {
      await sendVerificationEmail({
        email: newInstitution.email,
        otp,
        institutionName: newInstitution.name
      });
    } catch (emailError) {
      console.error('Brevo email failed:', emailError);
      // Delete the institution if email fails
      await InstitutionModel.findByIdAndDelete(newInstitution._id);
      throw new Error('Failed to send verification email');
    }

    // 7. Prepare response
    const responseData = {
      id: newInstitution._id,
      name: newInstitution.name,
      email: newInstitution.email,
      message: "Verification email sent"
    };

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || "Registration failed",
        code: error.code // Optional: Add custom error codes
      },
      { status: error.statusCode || 500 }
    );
  }
}

// PUT - Update institution
export async function updateInstitution(request) {
  try {
    await dbConnect();

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Institution ID is required" }, { status: 400 });
    }

    // Prevent password updates via this endpoint
    if (updateData.password) {
      delete updateData.password;
    }

    const updatedInstitution = await InstitutionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedInstitution) {
      return NextResponse.json(
        { message: "Institution not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Institution updated successfully!", institution: updatedInstitution },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating institution", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete institution
export async function deleteInstitution(request) {
  try {
    await dbConnect();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Institution ID is required" }, { status: 400 });
    }

    const deletedInstitution = await InstitutionModel.findByIdAndDelete(id);

    if (!deletedInstitution) {
      return NextResponse.json(
        { message: "Institution not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Institution deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting institution", error: error.message },
      { status: 500 }
    );
  }
}