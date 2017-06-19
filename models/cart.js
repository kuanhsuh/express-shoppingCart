module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {}
  this.totalQty = oldCart.totalQty || 0
  this.totalPrice = oldCart.totalPrice || 0

  this.add = function (item,id) {
    // Look if item already exist
    var storedItem = this.items[id]
    // If item does not exist create Item with qty 0 & price 0
    if (!storedItem) {
      storedItem = this.items[id] = {item: item, qty: 0, price: 0}
    }
    // If item exists, update qty, price, totalQty, totalPrice
    storedItem.qty++
    storedItem.price = storedItem.item.price * storedItem.qty
    this.totalQty++
    this.totalPrice += storedItem.item.price
  }

  this.generateArray = function() {
    var arr = []
    for (var id in this.items) {
      arr.push(this.items[id])
    }
    return arr
  }
}