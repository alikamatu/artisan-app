import { Controller, Post, Body, UseGuards, Get, Param, UnauthorizedException, Res, Request, Put, Patch, BadRequestException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============ PUBLIC ROUTES ============
  
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.is_verified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    return this.authService.login(user, loginDto.password);
  }

  @Post('request-reset')
  async requestReset(@Body('email') email: string) {
    await this.authService.requestPasswordReset(email);
    return { message: 'Reset instructions sent if email exists' };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { 
      success: true, 
      message: 'Password has been reset successfully' 
    };
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    const result = await this.authService.verifyEmail(token);
    return result;
  }

  @Get('verify')
async verifyEmailQuery(@Query('token') token: string) {
  if (!token) {
    throw new BadRequestException('Verification token is required');
  }
  const result = await this.authService.verifyEmail(token);
  return result;
}

  @Post('resend-verification')
  async resendVerificationEmail(@Body() { email }: { email: string }) {
    return this.authService.resendVerificationEmail(email);
  }

  // ============ PROTECTED ROUTES ============

  /**
   * Get current user's complete profile data
   * This replaces the separate profile endpoint approach
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: User) {
    return this.authService.getCurrentUserProfile(user.id);
  }

  /**
   * Update current user's basic information
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() updateData: UpdateProfileDto
  ) {
    return this.authService.updateUserProfile(user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
@Get('user/:userId')
async getUserProfile(@Param('userId') userId: string) {
  return this.authService.getPublicUserProfile(userId);
}

  /**
   * Update user's notification preferences
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me/notifications')
  async updateNotifications(
    @CurrentUser() user: User,
    @Body() notifications: Record<string, boolean>
  ) {
    return this.authService.updateUserNotifications(user.id, notifications);
  }

  /**
   * Change password for current user
   */
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: User,
    @Body() { currentPassword, newPassword }: { currentPassword: string; newPassword: string }
  ) {
    return this.authService.changePassword(user.id, currentPassword, newPassword);
  }

  /**
   * Refresh JWT token
   */
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@CurrentUser() user: User) {
    return this.authService.refreshUserToken(user);
  }

  /**
   * Logout - invalidate tokens (if you implement token blacklisting)
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: User) {
    // If you implement token blacklisting, handle it here
    return { message: 'Logged out successfully' };
  }

  // ============ ADMIN ROUTES ============
  
  @Roles('hostel_admin', 'super_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  adminRoute() {
    return { message: 'Admin access granted' };
  }

  @Roles('super_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Roles('super_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('admin/user/:userId/verify')
  async adminVerifyUser(@Param('userId') userId: string) {
    return this.authService.adminVerifyUser(userId);
  }
}