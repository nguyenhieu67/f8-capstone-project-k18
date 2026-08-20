import { IsNumber, IsString } from "class-validator";

export class LeadCreateDto {
  @IsNumber()
  sellerId!: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}

export class LeadUpdateDto extends LeadCreateDto {}
