
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
            type: DataTypes.STRING,
            allowNull: false
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
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 10
            }
        }
        // dailyCost: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     validate: {
        //         isInt: true
        //     }
        // }
    });

    // Item.belongsToMany() ???

    return Item;
}