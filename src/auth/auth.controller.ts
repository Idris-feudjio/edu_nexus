import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestOtpDto, ValidateOtpDto } from './dto';
import { JwtAuthGuard } from './guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for login' })
  @ApiResponse({ status: 200, description: 'OTP sent to email' })
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto.email);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP and get access token' })
  @ApiResponse({ status: 200, description: 'Returns JWT token' })
  async validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
    const user = await this.authService.validateOtp(validateOtpDto );
    return this.authService.login(user);
  }

  @Post('test-token')
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Test JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  async testToken(@Req() req) {
    return { user: req.user };
  }

  @Post('me')
  sayMe(@Body() body: any) {
    console.log(body);
    
    return { message: 'Hello, ' + body };

  }
}