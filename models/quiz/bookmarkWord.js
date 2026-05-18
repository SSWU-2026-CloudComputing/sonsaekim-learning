module.exports = (sequelize, DataTypes) => {
const BookmarkWord = sequelize.define('BookmarkWord', {
    id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
    },
    user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
    },
    word_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
        model: 'sign_word',
        key: 'word_id'
    },
    onDelete: 'CASCADE'
    }
}, {
    tableName: 'bookmark_word',
    timestamps: false,
    underscored: true
});

BookmarkWord.associate = (models) => {
    BookmarkWord.belongsTo(models.SignWord, { foreignKey: 'word_id' });
};

return BookmarkWord;
};