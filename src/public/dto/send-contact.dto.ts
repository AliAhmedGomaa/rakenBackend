import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SendContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  text!: string;

  /**
   * Opaque token returned to the visitor on their first message so we can
   * keep appending to the same chat thread on subsequent submits.
   * Optional — the server will mint one if absent.
   */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  visitorToken?: string;

  /** Optional friendly label the visitor wants to use. */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  displayName?: string;
}
