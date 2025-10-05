import recipe from "./recipe";
import ingredient from "./ingredient";
import brand from "./brand";
import category from "./category";

// Export the array that Sanity expects
export const schemaTypes = [recipe, ingredient, brand, category];

// (Optional) also keep a default export
export default schemaTypes;
