import { Body, Controller, Get, Post, Render, Req, Res, UseFilters } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import express from 'express';
import { RecipeUserId } from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import { User } from './entities/user.entity';
import { MvcExceptionFilter } from '../filters/mvc-exception.filter';

@Controller('auth')
@UseFilters(MvcExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('login')
  @Render('auth/login')
  getLoginPage() {
    return {
      title: 'Войти в аккаунт',
    };
  }

  @Post('signin')
  async signIn(
    @Body() body: { formFields: Array<{ id: string; value: string }> },
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const email = body.formFields.find((f) => f.id === 'email')?.value;
      const password = body.formFields.find((f) => f.id === 'password')?.value;

      if (!email || !password) {
        return {
          status: 'WRONG_CREDENTIALS_ERROR',
        };
      }

      const user = await this.authService.signIn(email, password);

      const recipeUserId = new RecipeUserId(user.id.toString());

      await Session.createNewSession(
        request,
        response,
        'public',
        recipeUserId,
        new User(user.id, user.name, user.email, user.role),
        {},
      );

      return {
        status: 'OK',
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      return {
        status: 'WRONG_CREDENTIALS_ERROR',
      };
    }
  }

  @Post('logout')
  async logout(@Req() req: express.Request, @Res() res: express.Response) {
    await this.authService.signOut(req.session);
    return res.redirect('/');
  }
}
