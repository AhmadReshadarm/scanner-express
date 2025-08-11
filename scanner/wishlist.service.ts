import { singleton } from 'tsyringe';
import { DataSource, Equal, Repository } from 'typeorm';
import { Scanner } from '../core/entities';
import { CodeDTO, MailOptionsDTO, ScannerDTO, ScannerQueryDTO } from './wishlist.dtos';
import { PaginationDTO } from '../core/lib/dto';
import { CustomExternalError } from '../core/domain/error/custom.external.error';
import { ErrorCode } from '../core/domain/error/error.code';
import { HttpStatus } from '../core/lib/http-status';
import { createTransport, Transporter } from 'nodemailer';
import { MAIL_FROM, transportConfig } from './config';

@singleton()
export class WishlistService {
  private scannerRepository: Repository<Scanner>;
  private smptTransporter: Transporter;
  constructor(dataSource: DataSource) {
    this.scannerRepository = dataSource.getRepository(Scanner);
    this.smptTransporter = createTransport(transportConfig);
  }

  async getScans(queryParams: ScannerQueryDTO): Promise<PaginationDTO<Scanner>> {
    const { tags, tag, sortBy = 'id', orderBy = 'DESC', limit = 10, offset = 0 } = queryParams;

    const queryBuilder = this.scannerRepository.createQueryBuilder('scanner').leftJoinAndSelect('scanner.tags', 'tag');
    if (tags) {
      queryBuilder.andWhere('tag.url IN (:...tags)', { tags: tags });
    }
    if (tag) {
      queryBuilder.andWhere('tag.url = :tag', { tag: tag });
    }

    queryBuilder.orderBy(`scanner.${sortBy}`, orderBy).skip(offset).take(limit);

    return {
      rows: await queryBuilder.getMany(),
      length: await queryBuilder.getCount(),
    };
  }

  async createScanner(scannerDTO: ScannerDTO): Promise<Scanner> {
    const scanner = new Scanner(scannerDTO);

    return this.scannerRepository.save(scanner);
  }

  async updateScanner(id: string, scannerDTO: Scanner) {
    const scanner = await this.scannerRepository.findOneOrFail({
      where: {
        id: Equal(id),
      },
    });
    return this.scannerRepository.save({
      ...scanner,
      ...scannerDTO,
    });
  }

  async getScannbyQrCode(queryParams: CodeDTO) {
    const { valmod } = queryParams;
    return await this.scannerRepository.findOne({ where: { qrCode: valmod } });
  }

  async getScannbyBardCode(barCode: string) {
    return await this.scannerRepository.findOne({ where: { barCode: Equal(barCode) } });
  }

  async sendMail(options: MailOptionsDTO) {
    this.validateMailOptions(options);

    let result: any;
    await this.smptTransporter.sendMail(
      {
        ...options,
        from: MAIL_FROM,
      },
      (err, info) => {
        if (err) {
          result = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: {
              message: `Mail was unsuccessfull to be sent to ${options.to}, ${err}`,
            },
          };
        }
        result = {
          status: HttpStatus.OK,
          response: {
            message: `Mail was successfull to be sent to ${options.to}`,
          },
        };
      },
    );
    return result;
  }

  validateMailOptions(options: MailOptionsDTO) {
    if (!options.to || !options.html || !options.subject) {
      throw new CustomExternalError([ErrorCode.MAIL_OPTIONS], HttpStatus.BAD_REQUEST);
    }
  }

  async removeScanner(id: string) {
    const scanner = await this.scannerRepository.findOneOrFail({
      where: {
        id: Equal(id),
      },
    });

    return this.scannerRepository.remove(scanner);
  }
}
