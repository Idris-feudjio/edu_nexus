

export class PaginationDto {
  page: number;
  limit: number;

  constructor(page: number = 1, limit: number = 10) {
    this.page = page;
    this.limit = limit;
  }

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  get take(): number {
    return this.limit;
  }
    toQuery(): { skip: number; take: number } {
        return {
        skip: this.skip,
        take: this.take,
        };
    }
}