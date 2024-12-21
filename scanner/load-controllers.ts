import { ScannerController } from './scanner.controller';
import { WishlistController } from './wishlist.controller';

const loadControllers = () => {
  return [WishlistController, ScannerController];
};

export default loadControllers;
