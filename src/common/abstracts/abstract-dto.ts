export abstract class AbstractDto {
  constructor(partial: Partial<AbstractDto>) {
    Object.assign(this, partial);
  }

    toDto<T>(this: T): T {
        return new (this as { new (partial: Partial<T>): T })(this);
    }
    toJSON(): Record<string, any> {
        const json: Record<string, any> = {};
        for (const key of Object.keys(this)) {
            if (this[key] instanceof Date) {
                json[key] = this[key].toISOString();
            } else {
                json[key] = this[key];
            }
        }
        return json;
    }

    toString(): string {
        return JSON.stringify(this.toJSON());
    }
    toObject(): Record<string, any> {
        return this.toJSON();
    }
    toPlainObject(): Record<string, any> {
        return this.toJSON();
    }

} 
