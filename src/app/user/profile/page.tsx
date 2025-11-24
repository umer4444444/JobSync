"use client";

import { useState, useEffect, useRef } from "react"
import DashboardCard from "@/components/admin/DashboardCard";
import { User } from "lucide-react"
import React from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Briefcase, FileText, Download } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  Save,
  Camera,
  MapPin,
  Phone,
  Mail,
  LogOut
} from "lucide-react"

interface ResumeData {
  filename?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;
}

interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  profileImage?: string | null;
  profileImageType?: string | null;
  resume?: ResumeData;
  profileCompletion?: number;
  emailVerified?: boolean;
}

interface TokenValidation {
  isValid: boolean;
  isExpired: boolean;
  payload?: unknown;
}

// Helper function to safely update user state
const useUserState = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const safeSetUser = (updater: (prev: UserProfile | null) => UserProfile | null) => {
    setUser(prev => {
      const updated = updater(prev);
      // Ensure required fields are always present
      if (updated && (!updated.name || !updated.email || !updated.role)) {
        console.warn('User profile missing required fields, using defaults');
        return {
          ...updated
        };
      }
      return updated;
    });
  };

  const updateUserFields = (fields: Partial<UserProfile>) => {
    safeSetUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...fields
      };
    });
  };

  return { user, setUser: safeSetUser, updateUserFields };
};

// Token validation utility
const validateToken = (token: string | null): TokenValidation => {
  if (!token) {
    return { isValid: false, isExpired: true };
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = Date.now() >= payload.exp * 1000;

    return {
      isValid: !isExpired,
      isExpired,
      payload
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { isValid: false, isExpired: true };
  }
};

// Enhanced fetch with token refresh
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  // Validate token before making request
  const tokenValidation = validateToken(token);
  if (!tokenValidation.isValid) {
    console.log('❌ Token invalid, redirecting to signin');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = '/signin';
    throw new Error('Authentication required');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // If unauthorized, clear tokens and redirect
  if (response.status === 401) {
    console.log('❌ API returned 401, clearing tokens');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = '/signin';
    throw new Error('Session expired');
  }

  return response;
};

export default function ProfilePage() {
  const { user, setUser, updateUserFields } = useUserState();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const loadUserProfile = async () => {
    try {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // Check token validity before making any requests
      const tokenValidation = validateToken(token);
      if (!tokenValidation.isValid) {
        console.log('❌ Token invalid on profile load, redirecting to signin');
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return;
      }

      if (!userData) {
        console.log('❌ No user data found, redirecting to signin');
        window.location.href = "/signin";
        return;
      }

      const parsedUser = JSON.parse(userData);
      console.log('📝 Loaded user from localStorage:', {
        name: parsedUser.name,
        hasProfileImage: !!parsedUser.profileImage,
        profileImageType: parsedUser.profileImageType,
        hasResume: !!parsedUser.resume
      });

      setUser(() => parsedUser);
      setSkills(parsedUser.skills || []);
      setProfileCompletion(parsedUser.profileCompletion || 0);

      // Load additional profile data from API
      const response = await fetchWithAuth('/api/auth/profile');

      console.log('🔄 Profile API response status:', response.status);

      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Profile API data:', {
          name: profileData.name,
          hasProfileImage: !!profileData.profileImage,
          profileImageType: profileData.profileImageType,
          hasResume: !!profileData.resume
        });

        // Ensure profile image is properly formatted
        let formattedProfileImage = profileData.profileImage;
        if (formattedProfileImage && !formattedProfileImage.startsWith('data:')) {
          formattedProfileImage = `data:${profileData.profileImageType || 'image/jpeg'};base64,${formattedProfileImage}`;
          console.log('🖼️ Formatted profile image to data URI');
        }

        // Clean resume data - remove fileData if present
        const cleanResume = profileData.resume ? {
          filename: profileData.resume.filename,
          fileUrl: profileData.resume.fileUrl,
          fileType: profileData.resume.fileType,
          fileSize: profileData.resume.fileSize,
          uploadedAt: profileData.resume.uploadedAt
        } : undefined;

        const updatedProfile = {
          ...profileData,
          profileImage: formattedProfileImage,
          resume: cleanResume
        };

        setUser(() => updatedProfile);
        setSkills(updatedProfile.skills || []);
        setProfileCompletion(updatedProfile.profileCompletion || 0);

        // Update localStorage with clean data (no fileData)
        localStorage.setItem("user", JSON.stringify(updatedProfile));
      } else {
        console.error('❌ Profile API failed:', response.status);
      }
    } catch (error) {
      console.error('💥 Error loading profile:', error);
      // Error is already handled by fetchWithAuth for auth issues
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debug function to check JWT content
  const checkJWT = () => {
    const token = localStorage.getItem('token');
    const validation = validateToken(token);

    console.log('🔍 JWT Validation:', {
      hasToken: !!token,
      isValid: validation.isValid,
      isExpired: validation.isExpired,
      payload: validation.payload
    });

    return validation;
  };

  // Auth debug function
  // Auth debug function
  const debugAuth = async () => {
    console.log('=== 🔐 AUTH DEBUG START ===');

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const validation = validateToken(token);

    console.log('📋 Local Storage Check:');
    console.log('- Token exists:', !!token);
    console.log('- Token valid:', validation.isValid);
    console.log('- Token expired:', validation.isExpired);
    console.log('- User data exists:', !!userData);

    if (validation.payload) {
      // Type assertion to fix the error
      const payload = validation.payload as { id?: string; email?: string; exp?: number };
      console.log('🔍 JWT Payload:', {
        id: payload.id,
        email: payload.email,
        exp: payload.exp ? new Date(payload.exp * 1000) : 'No exp',
        now: new Date(),
        isExpired: validation.isExpired
      });
    }

    try {
      const response = await fetchWithAuth('/api/auth/profile');
      console.log('🔐 Profile API Auth Test:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Profile API Success:', profileData);
      }
    } catch (error) {
      console.log('❌ Profile API Failed:', error);
    }

    console.log('=== 🔐 AUTH DEBUG END ===');
  };
  // Complete debug test suite
  const runCompleteDebugTest = async () => {
    console.log('=== 🐛 COMPLETE DEBUG TEST STARTED ===');

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const currentUser = userData ? JSON.parse(userData) : null;
    const tokenValidation = validateToken(token);

    // Test 1: Check JWT
    console.log('🔐 TEST 1 - JWT CHECK:');
    console.log('JWT Validation:', tokenValidation);

    // Test 2: Check Current User State
    console.log('👤 TEST 2 - CURRENT USER STATE:');
    console.log('LocalStorage User:', currentUser);
    console.log('React State User:', user);

    // Test 3: Test Basic API Connection
    console.log('🌐 TEST 3 - BASIC API CONNECTION:');
    try {
      const response = await fetchWithAuth('/api/auth/profile');
      console.log('Profile API Response:', {
        status: response.status,
        ok: response.ok
      });
      if (response.ok) {
        const profileData = await response.json();
        console.log('Profile Data from API:', {
          hasProfileImage: !!profileData.profileImage,
          profileImageType: profileData.profileImageType,
          hasResume: !!profileData.resume,
          allFields: Object.keys(profileData)
        });
      }
    } catch (error) {
      console.log('❌ Profile API Failed:', error);
    }

    console.log('=== 🏁 DEBUG TEST COMPLETED ===');
    alert('Debug test completed! Check console for results.');
  };

  // Test upload API directly
  const testUploadAPI = async () => {
    console.log('=== 📡 TESTING UPLOAD API DIRECTLY ===');

    const token = localStorage.getItem("token");
    const validation = validateToken(token);

    if (!validation.isValid) {
      alert('Token is invalid or expired. Please sign in again.');
      return;
    }

    const testBlob = new Blob(['test image content'], { type: 'image/jpeg' });
    const testFile = new File([testBlob], 'test.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('profileImage', testFile);

    try {
      const response = await fetchWithAuth('/api/auth/upload/profile-image', {
        method: 'POST',
        body: formData
      });

      console.log('Direct Upload Test Response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Upload API Success:', result);
        alert('Upload API test: SUCCESS! Check console.');
      } else {
        const errorText = await response.text();
        console.log('❌ Upload API Error:', errorText);
        alert('Upload API test: FAILED! Check console.');
      }
    } catch (error) {
      console.log('💥 Upload API Exception:', error);
      alert('Upload API test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Test resume upload API
  const testResumeUploadAPI = async () => {
    console.log('=== 📄 TESTING RESUME UPLOAD API DIRECTLY ===');

    const tokenValidation = validateToken(localStorage.getItem("token"));
    if (!tokenValidation.isValid) {
      alert('Token is invalid or expired. Please sign in again.');
      return;
    }

    const testContent = '%PDF-1.4\n1 0 obj\n<<>>\nendobj\n';
    const testBlob = new Blob([testContent], { type: 'application/pdf' });
    const testFile = new File([testBlob], 'test-resume.pdf', { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('resume', testFile);

    try {
      const response = await fetchWithAuth('/api/auth/upload/resume', {
        method: 'POST',
        body: formData
      });

      console.log('Direct Resume Upload Test Response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Resume Upload API Success:', result);
        alert('Resume Upload API test: SUCCESS! Check console.');
      } else {
        const errorText = await response.text();
        console.log('❌ Resume Upload API Error:', errorText);
        alert('Resume Upload API test: FAILED! Check console.');
      }
    } catch (error) {
      console.log('💥 Resume Upload API Exception:', error);
      alert('Resume Upload API test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setIsSaving(true);
      console.log('💾 Updating profile:', updates);

      const response = await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUser(() => updatedProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('=== 🚀 STARTING PROFILE IMAGE UPLOAD ===');

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    // Check token before upload
    const tokenValidation = validateToken(localStorage.getItem("token"));
    if (!tokenValidation.isValid) {
      alert('Your session has expired. Please sign in again.');
      window.location.href = '/signin';
      return;
    }

    try {
      setUploadingImage(true);

      console.log('📤 Upload details:', {
        file: { name: file.name, type: file.type, size: file.size }
      });

      const formData = new FormData();
      formData.append('profileImage', file);

      console.log('📡 Sending upload request...');

      const response = await fetchWithAuth('/api/auth/upload/profile-image', {
        method: 'POST',
        body: formData
      });

      console.log('📨 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ UPLOAD SUCCESS:', {
          message: result.message,
          hasProfileImage: !!result.profileImage,
          profileImageType: result.profileImageType
        });

        if (result.profileImage) {
          updateUserFields({
            profileImage: result.profileImage,
            profileImageType: result.profileImageType || file.type
          });
          console.log('🔄 Local state updated with new image');
        }

        alert('Profile image uploaded successfully!');
      } else {
        const errorText = await response.text();
        console.error('❌ UPLOAD FAILED:', {
          status: response.status,
          error: errorText
        });
        alert('Upload failed. Check console for details.');
      }
    } catch (error) {
      console.error('💥 UPLOAD ERROR:', error);
      // Auth errors are handled by fetchWithAuth
    } finally {
      setUploadingImage(false);
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = '';
      }
      console.log('=== 🏁 UPLOAD PROCESS COMPLETED ===');
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('=== 📄 STARTING RESUME UPLOAD ===');

    // Validate file type and size
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid resume file (PDF, DOC, DOCX)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Resume size must be less than 5MB');
      return;
    }

    // Get token - don't validate expiration
    const token = localStorage.getItem("token");
    console.log('🔐 Token check:', {
      hasToken: !!token,
      tokenLength: token?.length
    });

    if (!token) {
      alert('No authentication token found. Please sign in again.');
      window.location.href = '/signin';
      return;
    }

    try {
      setUploadingResume(true);

      console.log('📤 Resume upload details:', {
        file: { name: file.name, type: file.type, size: file.size },
        tokenExists: !!token
      });

      const formData = new FormData();
      formData.append('resume', file);

      console.log('📡 Sending upload request to /api/auth/upload/resume...');

      const response = await fetch('/api/auth/upload/resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📨 Resume upload response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ RESUME UPLOAD SUCCESS:', result);

        // Only store resume metadata, not the file data
        const resumeMetadata = {
          filename: result.resume.filename,
          fileUrl: result.resume.fileUrl,
          fileType: result.resume.fileType,
          fileSize: result.resume.fileSize,
          uploadedAt: result.resume.uploadedAt
        };

        const updatedCompletion = Math.min(100, (user?.profileCompletion || 0) + 20);

        updateUserFields({
          resume: resumeMetadata,
          profileCompletion: updatedCompletion
        });

        // Update localStorage with only metadata
        const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
        const updatedUser = {
          ...currentUser,
          resume: resumeMetadata,
          profileCompletion: updatedCompletion
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setProfileCompletion(updatedCompletion);

        alert('Resume uploaded successfully!');
      } else {
        // Handle errors without automatic redirect
        let errorMessage = 'Failed to upload resume';

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('❌ RESUME UPLOAD FAILED (JSON):', errorData);
        } catch {
          try {
            const errorText = await response.text();
            console.error('❌ RESUME UPLOAD FAILED (Text):', errorText);
            errorMessage = errorText || errorMessage;
          } catch {
            console.error('❌ RESUME UPLOAD FAILED (No body):', response.status, response.statusText);
            errorMessage = `${response.status}: ${response.statusText}`;
          }
        }

        alert(errorMessage);

        // Only redirect if it's specifically a 401 error
        if (response.status === 401) {
          console.log('🔄 401 received, redirecting to signin');
          window.location.href = '/signin';
        }
      }
    } catch (error) {
      console.error('💥 RESUME UPLOAD NETWORK ERROR:', error);
      alert('Network error occurred while uploading resume. Please check your connection and try again.');
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
      console.log('=== 🏁 RESUME UPLOAD COMPLETED ===');
    }
  };

  const handleDownloadResume = async () => {
    if (!user?.resume?.fileUrl) {
      alert('No resume file available for download');
      return;
    }

    try {
      const downloadUrl = user.resume.fileUrl.startsWith('/api/')
        ? `${window.location.origin}${user.resume.fileUrl}`
        : user.resume.fileUrl;

      console.log('📥 Downloading resume from:', downloadUrl);

      const response = await fetchWithAuth(downloadUrl);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = user.resume.filename || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log('✅ Resume downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading resume:', error);

      // Fallback: try direct URL if API download fails
      if (user?.resume?.fileUrl) {
        const directUrl = user.resume.fileUrl.startsWith('/')
          ? `${window.location.origin}${user.resume.fileUrl}`
          : user.resume.fileUrl;

        window.open(directUrl, '_blank');
      } else {
        alert('Failed to download resume. Please try again.');
      }
    }
  };

  const handleRemoveResume = async () => {
    if (!confirm('Are you sure you want to remove your resume?')) return;

    try {
      const response = await fetchWithAuth('/api/auth/profile/resume', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ RESUME REMOVAL SUCCESS:', result);

        const updatedCompletion = Math.max(0, (user?.profileCompletion || 0) - 20);

        updateUserFields({
          resume: undefined,
          profileCompletion: updatedCompletion
        });

        const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
        const updatedUser = {
          ...currentUser,
          resume: undefined,
          profileCompletion: updatedCompletion
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setProfileCompletion(updatedCompletion);

        alert('Resume removed successfully!');
      } else {
        const error = await response.json();
        console.error('❌ RESUME REMOVAL FAILED:', error);
        alert(error.error || 'Failed to remove resume');
      }
    } catch (error) {
      console.error('💥 RESUME REMOVAL ERROR:', error);
      alert('Failed to remove resume');
    }
  };

  const handleSavePersonalInfo = async () => {
    if (!user) return;

    const success = await updateProfile({
      name: user.name,
      phone: user.phone,
      location: user.location
    });

    if (success) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile');
    }
  };

  const handleSaveBio = async () => {
    if (!user) return;

    const success = await updateProfile({
      bio: user.bio
    });

    if (success) {
      alert('Bio updated successfully!');
    } else {
      alert('Failed to update bio');
    }
  };

  const handleSaveSkills = async () => {
    const success = await updateProfile({
      skills: skills
    });

    if (success) {
      alert('Skills updated successfully!');
    } else {
      alert('Failed to update skills');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill("");
      updateProfile({ skills: updatedSkills });
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
    updateProfile({ skills: updatedSkills });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  const testBasicUpdate = async () => {
    try {
      const response = await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: 'Test Location ' + Date.now() })
      });

      const result = await response.json();
      console.log('🧪 Test update response:', result);
      alert('Test update: ' + (response.ok ? 'SUCCESS' : 'FAILED'));
    } catch (error) {
      console.log('❌ Test update failed:', error);
      alert('Test update failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Panel - Moved to top */}
      <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-yellow-800">🚨 Debug Panel</h3>
            <p className="text-yellow-700 text-sm">
              Current State: Image: {user?.profileImage ? '✅ Yes' : '❌ No'},
              Resume: {user?.resume ? '✅ Yes' : '❌ No'},
              Completion: {profileCompletion}%
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">

            <Button
              onClick={runCompleteDebugTest}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Full Debug Test
            </Button>

            <Button
              onClick={testUploadAPI}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Test Upload API
            </Button>

            <Button
              onClick={testResumeUploadAPI}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Test Resume Upload API
            </Button>


            <Button
              onClick={debugAuth}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Debug Auth
            </Button>

            <Button
              onClick={testBasicUpdate}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Test Basic Update
            </Button>

            <Button
              onClick={checkJWT}
              size="sm"
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Check JWT
            </Button>
          </div>
        </div>
      </div>

      {/* Rest of your JSX remains exactly the same */}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#B260E6]/10 to-[#ED84A5]/10">
              <User className="h-6 w-6 text-[#B260E6]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground mt-1">
                Manage your personal information and professional profile.
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </motion.div>

      {/* Profile Completion */}
      <DashboardCard title="Profile Completion" description="Complete your profile to increase your visibility">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Add your resume, complete your bio, and add skills to improve your profile.
          </p>
        </div>
      </DashboardCard>

      {/* Profile Picture */}
      <DashboardCard title="Profile Picture" description="Upload a professional profile photo">
        <div className="flex items-center gap-6">
          <div className="relative">
            {user.profileImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover shadow-lg"
                onError={(e) => {
                  console.error('❌ Image failed to load');
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
                onLoad={() => console.log('✅ Image loaded successfully')}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#B260E6] to-[#ED84A5] text-white text-2xl font-bold shadow-lg">
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
            )}
            <Button
              size="icon"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-background bg-background shadow-md hover:scale-105 transition-transform"
              onClick={() => profileImageInputRef.current?.click()}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
            <input
              type="file"
              ref={profileImageInputRef}
              onChange={handleProfileImageUpload}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => profileImageInputRef.current?.click()}
              disabled={uploadingImage}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadingImage ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size of 2MB.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                if (confirm('Are you sure you want to remove your profile picture?')) {
                  const success = await updateProfile({
                    profileImage: null,
                    profileImageType: null
                  });
                  if (success) {
                    updateUserFields({
                      profileImage: null,
                      profileImageType: null
                    });
                    alert('Profile picture removed successfully!');
                  } else {
                    alert('Failed to remove profile picture');
                  }
                }
              }}
              className="text-red-600 hover:text-red-700"
            >
              Remove Photo
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Personal Information */}
      <DashboardCard title="Personal Information" description="Update your personal details">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={user.name || ''}
              onChange={(e) => updateUserFields({ name: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mr-2 inline h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={user.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="mr-2 inline h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+61 400 000 000"
                value={user.phone || ''}
                onChange={(e) => updateUserFields({ phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPin className="mr-2 inline h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Sydney, Australia"
              value={user.location || ''}
              onChange={(e) => updateUserFields({ location: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-gradient-to-r from-[#B260E6] to-[#ED84A5] hover:from-[#A050D6] hover:to-[#DD74A5]"
              onClick={handleSavePersonalInfo}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Bio/Summary */}
      <DashboardCard title="Professional Summary" description="Tell employers about yourself">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Write a brief summary about your professional experience and career goals..."
              className="min-h-32"
              value={user.bio || ''}
              onChange={(e) => updateUserFields({ bio: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              {500 - (user.bio?.length || 0)} characters remaining
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleSaveBio}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Bio'}
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Skills */}
      <DashboardCard title="Skills" description="Add your technical and professional skills">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className="flex-1"
            />
            <Button onClick={addSkill} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleSaveSkills}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Skills'}
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Resume/CV */}
      <DashboardCard title="Resume/CV" description="Upload your resume or CV">
        <div className="space-y-4">
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center p-8">
              {user.resume ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium mb-1">{user.resume.filename}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {user.resume.fileSize ? `Size: ${(user.resume.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Uploaded on {new Date(user.resume.uploadedAt || '').toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      onClick={handleDownloadResume}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => resumeInputRef.current?.click()}
                      disabled={uploadingResume}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadingResume ? 'Uploading...' : 'Replace'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRemoveResume}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">No resume uploaded</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    PDF, DOC, DOCX. Max size of 5MB.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={uploadingResume}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                  </Button>
                </>
              )}
              <input
                type="file"
                ref={resumeInputRef}
                onChange={handleResumeUpload}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>
      </DashboardCard>
    </div>
  );
}