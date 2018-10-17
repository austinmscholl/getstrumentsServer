
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("booking", {
      from: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      to: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      renterId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });

    // Booking.associate = models => {
    //     Booking.belongsTo(models.Item, {
    //         foreignKey: "id",
    //         onDelete: "Cascade"
    //     });
    // },
    Booking.associate = models => {
      Booking.belongsTo(models.User, {
        foreignKey: "id",
        onDelete: "Cascade"
    });

  };

    return Booking
}