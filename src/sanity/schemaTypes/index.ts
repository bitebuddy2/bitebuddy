import recipe from "./recipe";
import ingredient from "./ingredient";
import collection from "./collection";

// Export the array that Sanity expects
export const schemaTypes = [recipe, ingredient, collection];

// (Optional) also keep a default export
export default schemaTypes;
