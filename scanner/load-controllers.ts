import { ScannerController } from './scanner.controller';
import { TagController } from './tag.controller';
// import { WishlistController } from './wishlist.controller';

const loadControllers = () => {
  return [ScannerController, TagController];
};
// WishlistController,
export default loadControllers;
