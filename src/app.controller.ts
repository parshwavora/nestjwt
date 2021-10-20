import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { identity } from 'rxjs';
import { Response,Request, response } from 'express';
import { PassThrough } from 'stream';
import { request } from 'http';
import { timeStamp } from 'console';
@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtservice:JwtService) {}
  //Register
  @Post('register')
  async register(
    @Body('id') id:number,
    @Body('name') name:string,
    @Body('email') email:string,
    @Body('password') password:string

  )
  {
    const hasedpassword = await bcrypt.hash(password,12);

    const user = await this.appService.create({
      name,email,password:hasedpassword
    })
    delete user.password;
    return user;
  }
  
  //Login
  @Post('login')
  async login( 
    @Body('email') email:string,
    @Body('password') password:string,
    @Res({passthrough:true})response:Response
    )
  {
    const user = await this.appService.findone({email})
    if(!user){
      throw new console.error("invalid credentials");
    }
   
      if(!await bcrypt.compare(password,user.password)){
        throw new console.error("invail credentials");
      }
      const jwt = await this.jwtservice.signAsync({id:user.id})
      response.cookie('jwt',jwt,{httpOnly:true})
    return "success";
  }
 @Get('user')
 async user(@Req() request:Request){
   try{
    const cookie = request.cookies['jwt']
    const data = await this.jwtservice.verifyAsync(cookie);
    if(!data)
    {
      throw new UnauthorizedException();
    }

    const user=await this.appService.findone({id:data['id']})
  
    const{password, ...result} = user;
    
    return result;
 
    }
    catch(e){
      throw new UnauthorizedException();
    }
  } 
  @Post('logout')
  async logout(@Res({passthrough:true})response:Response){
    response.clearCookie('jwt');
  return "logout"
  }
}
