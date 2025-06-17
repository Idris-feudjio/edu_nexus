import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
import main from 'prisma/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
 //main();

  const config = new DocumentBuilder()
  .setTitle('EduNexus IUT API')
  .setDescription('API for EduNexus IUT application')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  // Enable CORS with error handling
  try {
    app.enableCors();
  } catch (error) {
    console.error('Failed to enable CORS:', error);
  }
   

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
