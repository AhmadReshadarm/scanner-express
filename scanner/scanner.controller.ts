import { Request, Response } from 'express';
import { singleton } from 'tsyringe';
import { Controller, Delete, Get, Post, Put } from '../core/decorators';
import { HttpStatus } from '../core/lib/http-status';
import { WishlistService } from './wishlist.service';
import { validation } from '../core/lib/validator';
import { Scanner, Tag } from '../core/entities';
import { TagService } from './tag.service';
import { EmptyEmail, genuineEmail, notGenuinEmail } from './generateEmail';

@singleton()
@Controller('/scanner')
export class ScannerController {
  constructor(private scannerService: WishlistService, private tagService: TagService) {}

  @Get()
  // @Middleware([verifyToken, isAdmin])
  async getScanners(req: Request, resp: Response) {
    try {
      const wishlists = await this.scannerService.getScans(req.query);

      resp.json(wishlists);
    } catch (error) {
      resp.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Post()
  async createScanners(req: Request, resp: Response) {
    const { tags } = req.body;
    try {
      const newScanner = await validation(new Scanner(req.body));
      tags ? (newScanner.tags = await this.tagService.getTagsByIds(tags.map((tag: Tag) => String(tag)))) : null;
      const created = await this.scannerService.createScanner(newScanner);

      resp.status(HttpStatus.CREATED).json(created);
    } catch (error) {
      resp.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Put(':id')
  async updateScanner(req: Request, resp: Response) {
    const { id } = req.params;
    const { tags } = req.body;
    try {
      const newScanner = new Scanner(req.body);

      tags ? (newScanner.tags = await this.tagService.getTagsByIds(tags.map((tag: Tag) => String(tag)))) : null;
      const updated = await this.scannerService.updateScanner(id, newScanner);

      resp.status(HttpStatus.CREATED).json(updated);
    } catch (error) {
      resp.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get('byType')
  async getScannerByQrCode(req: Request, resp: Response) {
    const basic: string = EmptyEmail();
    const notValid: string = notGenuinEmail();
    const valid: string = genuineEmail();
    try {
      const isValid = await this.scannerService.getScannbyQrCode(req.query);
      if (!isValid) {
        // ---------------------------
        const emailNotValidPayload = {
          to: `${req.query.valst}`, // valst is the user email
          subject: `ПРОВЕРКА НА ОРИГИНАЛЬНОСТЬ`,
          html: notValid,
        };
        await this.scannerService.sendMail(emailNotValidPayload);
        // -------------------------
        resp.status(HttpStatus.FORBIDDEN).json({ message: 'not a valid code' });
        return;
      }
      // -------------------------
      const emailValidPayload = {
        to: `${req.query.valst}`,
        subject: `ПРОВЕРКА НА ОРИГИНАЛЬНОСТЬ`,
        html: valid,
      };
      await this.scannerService.sendMail(emailValidPayload);
      // -------------------------
      const generalEmailPayload = {
        to: `${req.query.valst}`,
        subject: `Привет, это DUALL`,
        html: basic,
      };
      await this.scannerService.sendMail(generalEmailPayload);

      resp.status(HttpStatus.OK).json({ message: 'code is genuine' });
    } catch (error) {
      resp.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Post('byScan')
  async getScannerByBarCode(req: Request, resp: Response) {
    const { code } = req.body;

    try {
      const isValid = await this.scannerService.getScannbyBardCode(code);
      if (!isValid) {
        resp.status(HttpStatus.FORBIDDEN).json({ message: 'not a valid code' });
        return;
      }
      resp.status(HttpStatus.OK).json({ message: 'code is genuine' });
    } catch (error) {
      resp.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async removeScanner(req: Request, resp: Response) {
    const { id } = req.params;
    try {
      const removed = await this.scannerService.removeScanner(id);

      resp.status(HttpStatus.OK).json(removed);
    } catch (error) {
      resp.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
