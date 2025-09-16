import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminVerificationService } from './admin-verification.service';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from 'src/entities/user.entity';
import { FileUploadService } from 'src/file/file-upload.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';
import { CurrentUser } from './decorators/current-user.decorator';
import type { Request } from 'express';


// Extend Express Request interface to include 'user'
declare module 'express' {
  interface Request {
    user?: User;
  }
}

@Controller('admin')
export class AdminController {
  constructor(
    private readonly verificationService: AdminVerificationService,
    private readonly supabase: SupabaseService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // @Post('verification')
  // @UseGuards(JwtAuthGuard)
  // async submitVerification(@Req() req: Request, @Body() body: any) {
  //   const user = req.user as User;
  //   const { formData, idDocuments, hostelProofDocuments } = body;
    
  //   return this.verificationService.createVerificationRequest(
  //     user,
  //     formData,
  //     idDocuments,
  //     hostelProofDocuments
  //   );
  // }

  @Get('verification/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.SUPER_ADMIN)
  async getPendingVerifications() {
    return this.verificationService.getPendingVerifications();
  }

  @Post('verification/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.SUPER_ADMIN)
  async approveVerification(@Param('id') id: string, @Req() req: Request) {
    const superAdmin = req.user as User;
    return this.verificationService.updateVerificationStatus(id, 'approved', superAdmin);
  }

  @Post('verification/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.SUPER_ADMIN)
  async rejectVerification(@Param('id') id: string, @Body() body: { reason: string }, @Req() req: Request) {
    const superAdmin = req.user as User;
    return this.verificationService.updateVerificationStatus(id, 'rejected', superAdmin, body.reason);
  }

@Post('verification')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AnyFilesInterceptor())
async submitVerification(
  @Req() req: Request,
  @UploadedFiles() files: MulterFile[],
  @Body() body: any
) {
  const user = req.user as User;
  
  const idFiles = files.filter(f => f.fieldname === 'idDocuments');
  const hostelProofFiles = files.filter(f => f.fieldname === 'hostelProofDocuments');

  const idDocumentPaths = await Promise.all(
    idFiles.map(file => this.fileUploadService.uploadFile('id-documents', file))
  );
  
  const hostelProofPaths = await Promise.all(
    hostelProofFiles.map(file => this.fileUploadService.uploadFile('hostel-proofs', file))
  );

  return this.verificationService.createVerificationRequest(
    user,
    body,
    idDocumentPaths,
    hostelProofPaths
  );
}
  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getVerificationStatus(@CurrentUser() user: User) {
    const verification = await this.verificationService.getUserVerificationStatus(user.id);
    
    return {
      status: verification?.status || 'unverified',
      lastUpdated: verification?.reviewed_at
    };
  }
}