import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export enum EventType {
  ENTRY = 'ENTRY',
  LOGIN = 'LOGIN',
  ALERT = 'ALERT',
  SYSTEM = 'SYSTEM',
}

export class CreateEventDto {
  @IsEnum(EventType, {
    message: 'type must be one of: ENTRY, LOGIN, ALERT, SYSTEM',
  })
  type: EventType;

  @IsString()
  @IsNotEmpty({ message: 'message is required' })
  @MaxLength(500, { message: 'message must not exceed 500 characters' })
  message: string;
}
