import recipe from "./recipe";
import ingredient from "./ingredient";
import brand from "./brand";

// Export the array that Sanity expects
export const schemaTypes = [recipe, ingredient, brand];

// (Optional) also keep a default export
export default schemaTypes;
