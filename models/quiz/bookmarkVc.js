module.exports = (sequelize, DataTypes) => {
    const BookmarkVc = sequelize.define('BookmarkVc', {
        id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
        },
        user_id: {
        type: DataTypes.BIGINT,
        allowNull: false
        },
        vc_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'sign_vc',
            key: 'vc_id'
        },
        onDelete: 'CASCADE'
        }
    }, {
        tableName: 'bookmark_vc',
        timestamps: false
    });
    
    BookmarkVc.associate = (models) => {
        BookmarkVc.belongsTo(models.SignVc, { foreignKey: 'vc_id' });
    };
    
    return BookmarkVc;
    };