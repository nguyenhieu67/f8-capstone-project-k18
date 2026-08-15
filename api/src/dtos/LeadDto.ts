import { IsNumber, IsString } from "class-validator";

export class LeadCreateDto {
  @IsNumber()
  seller_id!: number;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;
}

export class LeadUpdateDto extends LeadCreateDto {}
