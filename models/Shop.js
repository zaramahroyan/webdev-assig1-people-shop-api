const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    prodID: String,
    name: String,
    mfgDate: Date,
    expDate: Date,
    user: {type: mongoose.SchemaTypes.ObjectId, ref: 'Users'},
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;