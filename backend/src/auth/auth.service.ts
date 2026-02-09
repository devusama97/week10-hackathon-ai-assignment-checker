import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto) {
        const { email, password, name } = signupDto;

        // Check if user exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new UnauthorizedException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new this.userModel({
            email,
            password: hashedPassword,
            name,
        });
        await user.save();

        // Generate token
        const payload = { email: user.email, sub: user._id, name: user.name };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate token
        const payload = { email: user.email, sub: user._id, name: user.name };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async validateUser(userId: string) {
        return this.userModel.findById(userId).select('-password');
    }
}
