import { Module } from '@nestjs/common';
import { ExcelImportService } from 'src/common/storage/import.student.service';

@Module({
    imports: [ExcelImportService],
})
export class UserModule {}
