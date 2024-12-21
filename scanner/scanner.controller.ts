import { Request, Response } from 'express';
import { singleton } from 'tsyringe';
import { Controller, Delete, Get, Post, Put } from '../core/decorators';
import { HttpStatus } from '../core/lib/http-status';
import { WishlistService } from './wishlist.service';

@singleton()
@Controller('/scanner')
export class ScannerController {
  constructor(private scannerService: WishlistService) {}

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
    try {
      const created = await this.scannerService.createScanner(req.body);

      resp.status(HttpStatus.CREATED).json(created);
    } catch (error) {
      resp.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Put(':id')
  async updateScanner(req: Request, resp: Response) {
    const { id } = req.params;
    try {
      const updated = await this.scannerService.updateScanner(id, req.body);

      resp.status(HttpStatus.CREATED).json(updated);
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
