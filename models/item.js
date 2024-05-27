module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('item', {
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        owner: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        availability: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        rating: {
            type: DataTypes.FLOAT
        }
    });

    Item.associate = models => {
        Item.belongsTo(models.User, {
            foreignKey: 'owner',
            onDelete: 'CASCADE'
        });

        Item.hasMany(models.Booking, {
            foreignKey: 'itemId',
            onDelete: 'CASCADE'
        });
    };

    return Item;
};
