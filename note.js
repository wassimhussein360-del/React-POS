//* 1. add cart special instruction
//* 2. add item special instruction
//* 3. handle quantity of modifier option
//* 5. Optional display selected modifiers in cart items

// make you first order

// TODO show original vs price style

//TODO 3/1/25
//* combine items that have same modifiers on addition
// get observable products

/**
 *
 * 1. when products updated check if an item disappear then delete the items that does not found in products
 * 2. check stock if stock decreased then get  products with same id iterate through them reduce quantity then delete it if need then go to next matching if the ordered quantity still > stock
 * 3. iterate through all items to set them to updated products, make sure to keep productSpecialIns, selected modifies and quantities are the same
 * 4. advanced: handle selection type changes and withQuantity fields
 *
 *
 *
 *
 */
