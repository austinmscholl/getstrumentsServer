module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        passwordhash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.associate = models => {
        User.hasMany(models.Item, {
            foreignKey: 'owner',
            onDelete: 'CASCADE'
        });

        User.hasMany(models.Booking, {
            foreignKey: 'renterId',
            onDelete: 'CASCADE'
        });
    };

    return User;
};
