import recipe from "./recipe";
import communityRecipe from "./communityRecipe";
import ingredient from "./ingredient";
import brand from "./brand";
import category from "./category";
import { product } from "./product";
import article from "./article";

// Export the array that Sanity expects
export const schemaTypes = [recipe, communityRecipe, ingredient, brand, category, product, article];

// (Optional) also keep a default export
export default schemaTypes;
