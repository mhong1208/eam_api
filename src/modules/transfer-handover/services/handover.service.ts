import { Injectable, NotFoundException } from '@nestjs/common';
import { HandoverRepository } from '../repositories/handover.repository';
import { CreateHandoverDto } from '../dto/create-handover.dto';
import { Handover } from '../entities/handover.entity';

@Injectable()
export class HandoverService {
  constructor(private readonly handoverRepository: HandoverRepository) {}

  async create(createHandoverDto: CreateHandoverDto): Promise<Handover> {
    const newHandover = this.handoverRepository.create(createHandoverDto);
    return await this.handoverRepository.save(newHandover);
  }

  async findAll(): Promise<Handover[]> {
    return await this.handoverRepository.find({
      relations: ['asset', 'receiver', 'sender', 'location'],
    });
  }

  async findOne(id: string): Promise<Handover> {
    const handover = await this.handoverRepository.findOne({
      where: { id },
      relations: ['asset', 'receiver', 'sender', 'location'],
    });
    if (!handover) {
      throw new NotFoundException(`Handover with ID ${id} not found`);
    }
    return handover;
  }
}
